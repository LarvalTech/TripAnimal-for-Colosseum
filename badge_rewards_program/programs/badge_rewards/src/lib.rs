pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;
use std::str::FromStr;

pub use constants::*;
pub use instructions::*;
pub use state::*;
pub use error::*;

declare_id!("Cw4KGKQcW3Y2C2h299p8h45ETKmtVipVsm7ZkDtEsEQR");

#[program]
pub mod badge_rewards {
    use super::*;

    /// Initialize a new badge
    ///
    /// Accounts:
    /// 0. `[writable, signer]` fee_payer: [AccountInfo] 
    /// 1. `[writable]` badge: [Badge] 
    /// 2. `[signer]` owner: [AccountInfo] The owner of the badge
    /// 3. `[]` system_program: [AccountInfo] Auto-generated, for account initialization
    ///
    /// Data:
    /// - badge_id: [u64] Unique identifier for this badge
    /// - name: [String] Name of the badge
    /// - description: [String] type
    /// - icon_uri: [String] URI to the badge icon
    /// - required_points: [u64] Points required to earn this badge
    /// - max_earnings: [u64] Maximum number of times this badge can be earned
    /// - is_active: [bool] Whether this badge is currently available for earning
    pub fn initialize_badge(ctx: Context<InitializeBadge>, badge_id: u64, name: String, description: String, icon_uri: String, required_points: u64, max_earnings: u64, is_active: bool) -> Result<()> {
        initialize_badge::handler(ctx, badge_id, name, description, icon_uri, required_points, max_earnings, is_active)
    }

    /// Update badge information
    ///
    /// Accounts:
    /// 0. `[writable, signer]` fee_payer: [AccountInfo] 
    /// 1. `[writable]` badge: [Badge] 
    /// 2. `[signer]` owner: [AccountInfo] The owner of the badge
    ///
    /// Data:
    /// - badge_id: [u64] Unique identifier for this badge
    /// - name: [Option<String>] Name of the badge
    /// - description: [Option<String>] type
    /// - icon_uri: [Option<String>] URI to the badge icon
    /// - required_points: [Option<u64>] Points required to earn this badge
    /// - max_earnings: [Option<u64>] Maximum number of times this badge can be earned
    /// - is_active: [Option<bool>] Whether this badge is currently available for earning
    pub fn update_badge(ctx: Context<UpdateBadge>, badge_id: u64, name: Option<String>, description: Option<String>, icon_uri: Option<String>, required_points: Option<u64>, max_earnings: Option<u64>, is_active: Option<bool>) -> Result<()> {
        update_badge::handler(ctx, badge_id, name, description, icon_uri, required_points, max_earnings, is_active)
    }

    /// Initialize a new reward for a badge
    ///
    /// Accounts:
    /// 0. `[writable, signer]` fee_payer: [AccountInfo] 
    /// 1. `[writable]` reward: [Reward] 
    /// 2. `[signer]` owner: [AccountInfo] The owner of the reward
    /// 3. `[]` system_program: [AccountInfo] Auto-generated, for account initialization
    ///
    /// Data:
    /// - badge_id: [u64] The badge ID this reward is associated with
    /// - reward_id: [u64] Unique identifier for this reward
    /// - name: [String] Name of the reward
    /// - description: [String] type
    /// - reward_type: [u8] Type of reward (0 = token, 1 = NFT, 2 = other)
    /// - reward_value: [u64] Value of the reward
    /// - token_mint: [Option<Pubkey>] Token mint for token rewards
    /// - nft_mint: [Option<Pubkey>] NFT mint for NFT rewards
    /// - is_active: [bool] Whether this reward is currently available
    pub fn initialize_reward(ctx: Context<InitializeReward>, badge_id: u64, reward_id: u64, name: String, description: String, reward_type: u8, reward_value: u64, token_mint: Option<Pubkey>, nft_mint: Option<Pubkey>, is_active: bool) -> Result<()> {
        initialize_reward::handler(ctx, badge_id, reward_id, name, description, reward_type, reward_value, token_mint, nft_mint, is_active)
    }

    /// Update reward information
    ///
    /// Accounts:
    /// 0. `[writable, signer]` fee_payer: [AccountInfo] 
    /// 1. `[writable]` reward: [Reward] 
    /// 2. `[signer]` owner: [AccountInfo] The owner of the reward
    ///
    /// Data:
    /// - badge_id: [u64] The badge ID this reward is associated with
    /// - reward_id: [u64] Unique identifier for this reward
    /// - name: [Option<String>] Name of the reward
    /// - description: [Option<String>] type
    /// - reward_type: [Option<u8>] Type of reward (0 = token, 1 = NFT, 2 = other)
    /// - reward_value: [Option<u64>] Value of the reward
    /// - token_mint: [Option<Pubkey>] Token mint for token rewards
    /// - nft_mint: [Option<Pubkey>] NFT mint for NFT rewards
    /// - is_active: [Option<bool>] Whether this reward is currently available
    pub fn update_reward(ctx: Context<UpdateReward>, badge_id: u64, reward_id: u64, name: Option<String>, description: Option<String>, reward_type: Option<u8>, reward_value: Option<u64>, token_mint: Option<Pubkey>, nft_mint: Option<Pubkey>, is_active: Option<bool>) -> Result<()> {
        update_reward::handler(ctx, badge_id, reward_id, name, description, reward_type, reward_value, token_mint, nft_mint, is_active)
    }

    /// Stake a badge (mint it to user)
    ///
    /// Accounts:
    /// 0. `[writable, signer]` fee_payer: [AccountInfo] 
    /// 1. `[writable]` badge: [Badge] 
    /// 2. `[writable]` user_badge: [UserBadge] 
    /// 3. `[signer]` badge_owner: [AccountInfo] The owner of the badge
    /// 4. `[signer]` user: [AccountInfo] The user staking the badge
    /// 5. `[]` system_program: [AccountInfo] Auto-generated, for account initialization
    ///
    /// Data:
    /// - badge_id: [u64] The badge ID to stake
    pub fn stake_badge(ctx: Context<StakeBadge>, badge_id: u64) -> Result<()> {
        stake_badge::handler(ctx, badge_id)
    }

    /// Unstake a badge
    ///
    /// Accounts:
    /// 0. `[writable, signer]` fee_payer: [AccountInfo] 
    /// 1. `[writable]` badge: [Badge] 
    /// 2. `[writable]` user_badge: [UserBadge] 
    /// 3. `[signer]` badge_owner: [AccountInfo] The owner of the badge
    /// 4. `[signer]` user: [AccountInfo] The user unstaking the badge
    /// 5. `[]` system_program: [AccountInfo] Auto-generated, for account initialization
    ///
    /// Data:
    /// - badge_id: [u64] The badge ID to unstake
    pub fn unstake_badge(ctx: Context<UnstakeBadge>, badge_id: u64) -> Result<()> {
        unstake_badge::handler(ctx, badge_id)
    }

    /// Freeze a badge (make it inactive)
    ///
    /// Accounts:
    /// 0. `[writable, signer]` fee_payer: [AccountInfo] 
    /// 1. `[writable]` badge: [Badge] 
    /// 2. `[signer]` badge_owner: [AccountInfo] The owner of the badge
    /// 3. `[]` system_program: [AccountInfo] Auto-generated, for account initialization
    ///
    /// Data:
    /// - badge_id: [u64] The badge ID to freeze
    pub fn freeze_badge(ctx: Context<FreezeBadge>, badge_id: u64) -> Result<()> {
        freeze_badge::handler(ctx, badge_id)
    }

    /// Revoke a badge from a user
    ///
    /// Accounts:
    /// 0. `[writable, signer]` fee_payer: [AccountInfo] 
    /// 1. `[writable]` badge: [Badge] 
    /// 2. `[writable]` user_badge: [UserBadge] 
    /// 3. `[signer]` badge_owner: [AccountInfo] The owner of the badge
    /// 4. `[signer]` user: [AccountInfo] The user to revoke the badge from
    /// 5. `[]` system_program: [AccountInfo] Auto-generated, for account initialization
    ///
    /// Data:
    /// - badge_id: [u64] The badge ID to revoke
    pub fn revoke_badge(ctx: Context<RevokeBadge>, badge_id: u64) -> Result<()> {
        revoke_badge::handler(ctx, badge_id)
    }

    /// Claim a reward for a badge
    ///
    /// Accounts:
    /// 0. `[writable, signer]` fee_payer: [AccountInfo] 
    /// 1. `[signer]` user: [AccountInfo] The user claiming the reward
    /// 2. `[writable]` user_reward: [UserReward] 
    /// 3. `[writable]` reward: [Reward] 
    /// 4. `[writable]` badge: [Badge] 
    /// 5. `[writable]` user_badge: [UserBadge] 
    /// 6. `[writable]` user_token_account: [AccountInfo] User's token account for reward transfer
    /// 7. `[writable]` reward_token_account: [AccountInfo] Reward token account for transfer
    /// 8. `[]` reward_mint: [Mint] The token mint for the reward
    /// 9. `[]` system_program: [AccountInfo] Auto-generated, for account initialization
    /// 10. `[writable]` source: [AccountInfo] The source account.
    /// 11. `[]` mint: [Mint] The token mint.
    /// 12. `[writable]` destination: [AccountInfo] The destination account.
    /// 13. `[signer]` authority: [AccountInfo] The source account's owner/delegate.
    /// 14. `[]` token_program: [AccountInfo] Auto-generated, TokenProgram
    ///
    /// Data:
    /// - owner: [Pubkey] The owner of the badge
    /// - badge_id: [u64] The badge ID
    /// - reward_id: [u64] The reward ID
    /// - reward_type: [u8] Type of reward (0 = token, 1 = NFT, 2 = other)
    /// - reward_value: [u64] Value of the reward
    pub fn claim_reward(ctx: Context<ClaimReward>, owner: Pubkey, badge_id: u64, reward_id: u64, reward_type: u8, reward_value: u64) -> Result<()> {
        claim_reward::handler(ctx, owner, badge_id, reward_id, reward_type, reward_value)
    }

    /// Get all badges earned by a user
    ///
    /// Accounts:
    /// 0. `[writable, signer]` fee_payer: [AccountInfo] Auto-generated, default fee payer
    ///
    /// Data:
    /// - user: [Pubkey] The user to get badges for
    pub fn get_user_badges(ctx: Context<GetUserBadges>, user: Pubkey) -> Result<()> {
        get_user_badges::handler(ctx, user)
    }

    /// Get all rewards claimed by a user
    ///
    /// Accounts:
    /// 0. `[writable, signer]` fee_payer: [AccountInfo] Auto-generated, default fee payer
    ///
    /// Data:
    /// - user: [Pubkey] The user to get rewards for
    pub fn get_user_rewards(ctx: Context<GetUserRewards>, user: Pubkey) -> Result<()> {
        get_user_rewards::handler(ctx, user)
    }
}