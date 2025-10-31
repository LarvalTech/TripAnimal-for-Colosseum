# TripAnimal Agri - Stake Rewards Function Design

## Overview

The `stakeRewards` function introduces a two-stage reward lifecycle that provides business users with control over reward availability and players with optional reward locking mechanisms. This design allows for:

1. **Business User Control**: Create rewards in a "staked" (inactive) state, then unstake to activate for claiming
2. **Player Flexibility**: Claim rewards and optionally stake them for later use
3. **Minimum Stake Period**: Optional time-lock mechanism to prevent immediate claiming after staking

---

## Reward Lifecycle State Machine

```
┌─────────────────────────────────────────────────────────────────┐
│                    BUSINESS USER FLOW                            │
└─────────────────────────────────────────────────────────────────┘

initializeReward()
       ↓
   [STAKED] ← Business user creates reward in staked state
       ↓
   unstakeReward() ← Business user activates reward for claiming
       ↓
   [AVAILABLE] ← Players can now claim this reward
       ↓
   claimReward() ← Player claims the reward
       ↓
   [CLAIMED]

┌─────────────────────────────────────────────────────────────────┐
│                     PLAYER FLOW                                  │
└─────────────────────────────────────────────────────────────────┘

claimReward() from [AVAILABLE]
       ↓
   [CLAIMED] ← Player owns the reward
       ↓
   stakeReward() ← Optional: Player locks reward for minimum period
       ↓
   [STAKED_BY_PLAYER] ← Locked until minStakePeriod expires
       ↓
   unstakeReward() ← Player unlocks reward after minimum period
       ↓
   [CLAIMED] ← Reward available for use/transfer
```

---

## Data Structure: Reward State

### Enhanced Reward Account

```typescript
interface RewardState {
  // Existing fields
  badgeId: string;
  rewardId: string;
  name: string;
  description: string;
  rewardType: "Token" | "NFT" | "Other";  // 0, 1, 2
  rewardValue: string;
  tokenMint?: string;
  nftMint?: string;
  isActive: boolean;
  
  // New staking fields
  stakeStatus: "AVAILABLE" | "STAKED_BY_BUSINESS" | "STAKED_BY_PLAYER";
  stakedBy: PublicKey;  // Who staked it (business owner or player)
  stakedAt: number;     // Unix timestamp when staked
  minStakePeriod: number;  // Minimum seconds to keep staked (0 = no minimum)
  canUnstakeAt: number;    // Unix timestamp when unstaking becomes available
}
```

---

## Smart Contract Functions

### 1. stakeReward (Business User)

**Purpose**: Business user stakes a newly created reward to keep it unavailable until ready to activate.

```rust
pub fn stake_reward(
    ctx: Context<StakeReward>,
    badge_id: String,
    reward_id: String,
    min_stake_period: u64,  // seconds (0 = no minimum)
) -> Result<()> {
    let reward = &mut ctx.accounts.reward;
    
    require!(
        reward.is_active == false,
        ErrorCode::RewardAlreadyActive
    );
    
    reward.stake_status = StakeStatus::StakedByBusiness;
    reward.staked_by = ctx.accounts.business_owner.key();
    reward.staked_at = Clock::get()?.unix_timestamp as u64;
    reward.min_stake_period = min_stake_period;
    reward.can_unstake_at = reward.staked_at + min_stake_period;
    
    emit!(RewardStaked {
        badge_id,
        reward_id,
        staked_by: ctx.accounts.business_owner.key(),
        min_stake_period,
    });
    
    Ok(())
}
```

**Accounts Required**:
- `reward`: The reward account to stake (mutable)
- `business_owner`: The business user's wallet (signer)
- `system_program`: System program

**Constraints**:
- Only business owner can stake their own rewards
- Reward must not already be active
- Min stake period must be >= 0

---

### 2. unstakeReward (Business User)

**Purpose**: Business user unstakes a reward to make it available for claiming.

```rust
pub fn unstake_reward(
    ctx: Context<UnstakeReward>,
    badge_id: String,
    reward_id: String,
) -> Result<()> {
    let reward = &mut ctx.accounts.reward;
    let current_time = Clock::get()?.unix_timestamp as u64;
    
    require!(
        reward.stake_status == StakeStatus::StakedByBusiness,
        ErrorCode::RewardNotStaked
    );
    
    require!(
        current_time >= reward.can_unstake_at,
        ErrorCode::MinStakePeriodNotMet
    );
    
    reward.stake_status = StakeStatus::Available;
    reward.is_active = true;
    reward.staked_by = Pubkey::default();
    reward.staked_at = 0;
    reward.can_unstake_at = 0;
    
    emit!(RewardUnstaked {
        badge_id,
        reward_id,
        unstaked_by: ctx.accounts.business_owner.key(),
    });
    
    Ok(())
}
```

**Accounts Required**:
- `reward`: The reward account to unstake (mutable)
- `business_owner`: The business user's wallet (signer)
- `system_program`: System program

**Constraints**:
- Only business owner can unstake their own rewards
- Reward must be staked by business
- Minimum stake period must have elapsed

---

### 3. stakeReward (Player)

**Purpose**: Player stakes a claimed reward to lock it for a minimum period.

```rust
pub fn stake_reward_player(
    ctx: Context<StakeRewardPlayer>,
    badge_id: String,
    reward_id: String,
    min_stake_period: u64,  // seconds (0 = no minimum)
) -> Result<()> {
    let player_reward = &mut ctx.accounts.player_reward;
    
    require!(
        player_reward.stake_status == StakeStatus::Available,
        ErrorCode::RewardAlreadyStaked
    );
    
    player_reward.stake_status = StakeStatus::StakedByPlayer;
    player_reward.staked_by = ctx.accounts.player.key();
    player_reward.staked_at = Clock::get()?.unix_timestamp as u64;
    player_reward.min_stake_period = min_stake_period;
    player_reward.can_unstake_at = player_reward.staked_at + min_stake_period;
    
    emit!(PlayerRewardStaked {
        badge_id,
        reward_id,
        player: ctx.accounts.player.key(),
        min_stake_period,
    });
    
    Ok(())
}
```

**Accounts Required**:
- `player_reward`: The player's claimed reward account (mutable)
- `player`: The player's wallet (signer)
- `system_program`: System program

**Constraints**:
- Only the player who claimed the reward can stake it
- Reward must not already be staked
- Min stake period must be >= 0

---

### 4. unstakeReward (Player)

**Purpose**: Player unstakes a claimed reward after minimum period has elapsed.

```rust
pub fn unstake_reward_player(
    ctx: Context<UnstakeRewardPlayer>,
    badge_id: String,
    reward_id: String,
) -> Result<()> {
    let player_reward = &mut ctx.accounts.player_reward;
    let current_time = Clock::get()?.unix_timestamp as u64;
    
    require!(
        player_reward.stake_status == StakeStatus::StakedByPlayer,
        ErrorCode::RewardNotStaked
    );
    
    require!(
        current_time >= player_reward.can_unstake_at,
        ErrorCode::MinStakePeriodNotMet
    );
    
    player_reward.stake_status = StakeStatus::Available;
    player_reward.staked_by = Pubkey::default();
    player_reward.staked_at = 0;
    player_reward.can_unstake_at = 0;
    
    emit!(PlayerRewardUnstaked {
        badge_id,
        reward_id,
        player: ctx.accounts.player.key(),
    });
    
    Ok(())
}
```

**Accounts Required**:
- `player_reward`: The player's claimed reward account (mutable)
- `player`: The player's wallet (signer)
- `system_program`: System program

**Constraints**:
- Only the player who staked the reward can unstake it
- Reward must be staked by player
- Minimum stake period must have elapsed

---

## Enum: StakeStatus

```rust
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum StakeStatus {
    Available = 0,           // Reward is available for claiming/use
    StakedByBusiness = 1,    // Reward is staked by business owner (unavailable)
    StakedByPlayer = 2,      // Reward is staked by player (locked)
}
```

---

## Events

### RewardStaked (Business)
```rust
#[event]
pub struct RewardStaked {
    pub badge_id: String,
    pub reward_id: String,
    pub staked_by: Pubkey,
    pub min_stake_period: u64,
}
```

### RewardUnstaked (Business)
```rust
#[event]
pub struct RewardUnstaked {
    pub badge_id: String,
    pub reward_id: String,
    pub unstaked_by: Pubkey,
}
```

### PlayerRewardStaked
```rust
#[event]
pub struct PlayerRewardStaked {
    pub badge_id: String,
    pub reward_id: String,
    pub player: Pubkey,
    pub min_stake_period: u64,
}
```

### PlayerRewardUnstaked
```rust
#[event]
pub struct PlayerRewardUnstaked {
    pub badge_id: String,
    pub reward_id: String,
    pub player: Pubkey,
}
```

---

## Error Codes

```rust
#[error_code]
pub enum ErrorCode {
    #[msg("Reward is already active")]
    RewardAlreadyActive,
    
    #[msg("Reward is not staked")]
    RewardNotStaked,
    
    #[msg("Reward is already staked")]
    RewardAlreadyStaked,
    
    #[msg("Minimum stake period has not elapsed")]
    MinStakePeriodNotMet,
    
    #[msg("Only the staker can unstake this reward")]
    UnauthorizedUnstake,
    
    #[msg("Invalid minimum stake period")]
    InvalidStakePeriod,
}
```

---

## Integration with Existing Functions

### initializeReward (Modified)

When a business user creates a reward, it can optionally be created in a staked state:

```typescript
interface InitializeRewardParams {
  badgeId: string;
  rewardId: string;
  name: string;
  description: string;
  rewardType: "Token" | "NFT" | "Other";
  rewardValue: string;
  tokenMint?: string;
  nftMint?: string;
  isActive: boolean;
  
  // New optional staking
  stakeInitially?: boolean;  // Default: false
  minStakePeriod?: number;   // Default: 0 (no minimum)
}
```

**Behavior**:
- If `stakeInitially = false`: Reward is created in AVAILABLE state, ready to claim
- If `stakeInitially = true`: Reward is created in STAKED_BY_BUSINESS state, must be unstaked first

### claimReward (Unchanged)

Players can only claim rewards that are in AVAILABLE state:

```rust
require!(
    reward.stake_status == StakeStatus::Available,
    ErrorCode::RewardNotAvailable
);
```

---

## UI/UX Flow

### Business Dashboard - Create Reward

```
┌─────────────────────────────────────┐
│  Create Reward Form                 │
├─────────────────────────────────────┤
│ Badge ID: [________]                │
│ Reward ID: [________]               │
│ Name: [________]                    │
│ Description: [________]             │
│ Type: [Token / NFT / Other]         │
│ Value: [________]                   │
│ Token Mint: [________]              │
│ NFT Mint: [________]                │
│                                     │
│ ☐ Stake this reward initially      │
│ Min Stake Period (seconds): [___]   │
│                                     │
│ [Preview] [Create Reward]           │
└─────────────────────────────────────┘
```

### Business Dashboard - Manage Rewards

```
┌─────────────────────────────────────┐
│  My Rewards                         │
├─────────────────────────────────────┤
│ Reward Name                         │
│ Status: [STAKED] [AVAILABLE]        │
│ Min Stake Period: 7 days            │
│ Can Unstake At: 2025-11-07          │
│                                     │
│ [Unstake Reward]  [Edit]  [Delete]  │
└─────────────────────────────────────┘
```

### Player Hub - Claim Reward

```
┌─────────────────────────────────────┐
│  Available Reward                   │
├─────────────────────────────────────┤
│ 10 SOL Token Reward                 │
│ Status: AVAILABLE                   │
│                                     │
│ [Claim Reward]                      │
└─────────────────────────────────────┘
```

### Player Hub - Manage Claimed Rewards

```
┌─────────────────────────────────────┐
│  My Claimed Rewards                 │
├─────────────────────────────────────┤
│ 10 SOL Token Reward                 │
│ Status: [CLAIMED] [STAKED]          │
│                                     │
│ ☐ Stake this reward                │
│ Min Stake Period (seconds): [___]   │
│                                     │
│ [Stake Reward]  [Transfer]          │
│                                     │
│ OR                                  │
│                                     │
│ Status: STAKED                      │
│ Can Unstake At: 2025-11-07          │
│ [Unstake Reward]                    │
└─────────────────────────────────────┘
```

---

## Demo Flow Integration

### Step-by-Step Demo with Staking

1. **Landing Page** - Introduce TripAnimal Agri
2. **Connect Wallet** - Auto-connect business wallet
3. **Create Badge** - Business creates "Mountain Explorer" badge
4. **Create Reward** - Business creates "10 SOL Token" reward with "Stake Initially" checked
   - Reward is created in STAKED state
   - Min Stake Period: 86400 seconds (1 day)
5. **Unstake Reward** - Business unstakes reward to activate it
   - Reward becomes AVAILABLE for claiming
6. **Switch to Player** - Auto-connect player wallet
7. **Claim Reward** - Player claims the "10 SOL Token" reward
   - Reward moves to CLAIMED state
8. **Stake Reward (Player)** - Player optionally stakes their claimed reward
   - Dummy button: "Stake Reward"
   - Min Stake Period: 3600 seconds (1 hour)
   - Shows countdown timer
9. **Unstake Reward (Player)** - After minimum period, player can unstake
   - Dummy button: "Unstake Reward"
10. **Gallery** - Display all badges and rewards with their stake statuses

---

## Summary of New Functions

| Function | Actor | Input | Output | State Change |
|----------|-------|-------|--------|--------------|
| `stakeReward` | Business | badgeId, rewardId, minStakePeriod | Event | AVAILABLE → STAKED_BY_BUSINESS |
| `unstakeReward` | Business | badgeId, rewardId | Event | STAKED_BY_BUSINESS → AVAILABLE |
| `stakeRewardPlayer` | Player | badgeId, rewardId, minStakePeriod | Event | AVAILABLE → STAKED_BY_PLAYER |
| `unstakeRewardPlayer` | Player | badgeId, rewardId | Event | STAKED_BY_PLAYER → AVAILABLE |

---

## Benefits

1. **Business Control**: Rewards can be created but held until the business is ready to activate them
2. **Player Flexibility**: Players can lock rewards for future use or transfer
3. **Time-Lock Mechanism**: Prevents immediate claiming/unstaking with optional minimum periods
4. **Extensibility**: Foundation for future features like reward staking pools, yield generation, etc.
5. **Clear State Management**: Explicit state machine makes behavior predictable and auditable

