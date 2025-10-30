use crate::*;
use anchor_lang::prelude::*;

use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token, TokenAccount},
};

#[derive(Accounts)]
#[instruction(
    owner: Pubkey,
    badge_id: u64,
    reward_id: u64,
    reward_type: u8,
    reward_value: u64,
)]
pub struct ClaimReward<'info> {
    #[account(
        mut,
    )]
    pub fee_payer: Signer<'info>,

    #[account(
        seeds = [
            b"badge",
            owner.as_ref(),
            badge_id.to_le_bytes().as_ref(),
        ],
        bump = badge.bump,
    )]
    pub badge: Account<'info, Badge>,

    #[account(
        mut,
        seeds = [
            b"reward",
            owner.as_ref(),
            badge_id.to_le_bytes().as_ref(),
            reward_id.to_le_bytes().as_ref(),
        ],
        bump = reward.bump,
    )]
    pub reward: Account<'info, Reward>,

    #[account(
        init,
        space = 40,
        payer = fee_payer,
        seeds = [
            b"user_reward",
            user.key().as_ref(),
            reward_id.to_le_bytes().as_ref(),
        ],
        bump,
    )]
    pub user_reward: Account<'info, UserReward>,

    #[account(
        mut,
        seeds = [
            b"user_badge",
            user.key().as_ref(),
            badge_id.to_le_bytes().as_ref(),
        ],
        bump = user_badge.bump,
    )]
    pub user_badge: Account<'info, UserBadge>,

    #[account(
        mut,
    )]
    pub user_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
    )]
    pub reward_token_account: Account<'info, TokenAccount>,

    /// The mint for the reward token
    pub reward_mint: Account<'info, Mint>,

    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Program<'info, Token>,
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
/// 10. `[]` associated_token_program: [AccountInfo] Auto-generated, for associated token program
/// 11. `[]` token_program: [AccountInfo] Auto-generated, TokenProgram
///
/// Data:
/// - owner: [Pubkey] The owner of the badge
/// - badge_id: [u64] The badge ID
/// - reward_id: [u64] The reward ID
/// - reward_type: [u8] Type of reward (0 = token, 1 = NFT, 2 = other)
/// - reward_value: [u64] Value of the reward
pub fn handler(
    ctx: Context<ClaimReward>,
    owner: Pubkey,
    badge_id: u64,
    reward_id: u64,
    reward_type: u8,
    reward_value: u64,
) -> Result<()> {
    // Validate that the badge exists and is owned by the owner
    require!(ctx.accounts.badge.owner == owner, BadgeRewardsError::Unauthorized);
    require!(ctx.accounts.badge.badge_id == badge_id, BadgeRewardsError::InvalidBadgeId);
    
    // Validate that the reward exists and is owned by the owner
    require!(ctx.accounts.reward.badge_id == badge_id, BadgeRewardsError::InvalidBadgeId);
    require!(ctx.accounts.reward.reward_id == reward_id, BadgeRewardsError::InvalidRewardId);
    require!(ctx.accounts.reward.owner == owner, BadgeRewardsError::Unauthorized);
    
    // Validate that the reward is active
    require!(ctx.accounts.reward.is_active, BadgeRewardsError::RewardNotActive);
    
    // Validate that the reward type matches
    require!(ctx.accounts.reward.reward_type == reward_type, BadgeRewardsError::InvalidRewardType);
    
    // Validate that the reward value matches
    require!(ctx.accounts.reward.reward_value == reward_value, BadgeRewardsError::InvalidRewardValue);
    
    // Validate that the user has the badge
    require!(ctx.accounts.user_badge.user == ctx.accounts.user.key(), BadgeRewardsError::Unauthorized);
    require!(ctx.accounts.user_badge.badge_id == badge_id, BadgeRewardsError::InvalidBadgeId);
    
    // Validate that the user hasn't already claimed this reward
    // Check if the user_reward account is already initialized with the same user
    // If user_reward.user is already set to the current user, they've already claimed
    if ctx.accounts.user_reward.user != Pubkey::default() {
        require!(ctx.accounts.user_reward.user != ctx.accounts.user.key(), BadgeRewardsError::RewardAlreadyClaimed);
    }
    
    // Transfer reward based on reward type
    match reward_type {
        0 => {
            // Token reward - transfer tokens
            require!(ctx.accounts.reward.token_mint.is_some(), BadgeRewardsError::MissingTokenMint);
            let token_mint = ctx.accounts.reward.token_mint.unwrap();
            
            // Validate that the reward mint matches
            require!(ctx.accounts.reward_mint.key() == token_mint, BadgeRewardsError::InvalidTokenMint);
            
            // Transfer tokens from reward token account to user token account
            let cpi_accounts = anchor_spl::token::Transfer {
                from: ctx.accounts.reward_token_account.to_account_info(),
                to: ctx.accounts.user_token_account.to_account_info(),
                authority: ctx.accounts.badge.to_account_info(),
            };
            let cpi_program = ctx.accounts.token_program.to_account_info();
            let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
            anchor_spl::token::transfer(cpi_ctx, reward_value)?;
        },
        1 => {
            // NFT reward - transfer NFT (this would require more complex logic)
            // For now, we'll just validate that the NFT mint is provided
            require!(ctx.accounts.reward.nft_mint.is_some(), BadgeRewardsError::MissingNftMint);
        },
        2 => {
            // Other reward - no transfer needed
        },
        _ => {
            return Err(BadgeRewardsError::InvalidRewardType.into());
        }
    }
    
    // Record that the user has claimed this reward
    ctx.accounts.user_reward.user = ctx.accounts.user.key();
    ctx.accounts.user_reward.reward_id = reward_id;
    ctx.accounts.user_reward.claimed_at = Clock::get()?.unix_timestamp;
    ctx.accounts.user_reward.bump = ctx.bumps.user_reward;
    
    Ok(())
}