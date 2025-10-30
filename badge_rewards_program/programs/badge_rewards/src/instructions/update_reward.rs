use crate::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(
	badge_id: u64,
	reward_id: u64,
)]
pub struct UpdateReward<'info> {
	#[account(
		mut,
	)]
	pub fee_payer: Signer<'info>,

	#[account(
		mut,
		seeds = [
			b"reward",
			owner.key().as_ref(),
			badge_id.to_le_bytes().as_ref(),
			reward_id.to_le_bytes().as_ref(),
		],
		bump = reward.bump,
	)]
	pub reward: Account<'info, Reward>,

	pub owner: Signer<'info>,
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
pub fn handler(
	ctx: Context<UpdateReward>,
	badge_id: u64,
	reward_id: u64,
	name: Option<String>,
	description: Option<String>,
	reward_type: Option<u8>,
	reward_value: Option<u64>,
	token_mint: Option<Pubkey>,
	nft_mint: Option<Pubkey>,
	is_active: Option<bool>,
) -> Result<()> {
    // Validate that the reward exists and is owned by the owner
    require!(ctx.accounts.reward.owner == ctx.accounts.owner.key(), BadgeRewardsError::Unauthorized);
    require!(ctx.accounts.reward.badge_id == badge_id, BadgeRewardsError::InvalidBadgeId);
    require!(ctx.accounts.reward.reward_id == reward_id, BadgeRewardsError::InvalidRewardId);
    
    // Update reward fields if provided
    if let Some(name) = name {
        require!(name.len() <= 100, BadgeRewardsError::NameTooLong);
        ctx.accounts.reward.name = name;
    }
    
    if let Some(description) = description {
        require!(description.len() <= 500, BadgeRewardsError::DescriptionTooLong);
        ctx.accounts.reward.description = description;
    }
    
    if let Some(reward_type) = reward_type {
        require!(reward_type <= 2, BadgeRewardsError::InvalidRewardType);
        ctx.accounts.reward.reward_type = reward_type;
    }
    
    if let Some(reward_value) = reward_value {
        require!(reward_value > 0, BadgeRewardsError::InvalidRewardValue);
        ctx.accounts.reward.reward_value = reward_value;
    }
    
    if let Some(token_mint) = token_mint {
        // For token rewards, token_mint must be provided
        if ctx.accounts.reward.reward_type == 0 {
            ctx.accounts.reward.token_mint = Some(token_mint);
        } else {
            // If reward type is not token, clear the token mint
            ctx.accounts.reward.token_mint = None;
        }
    }
    
    if let Some(nft_mint) = nft_mint {
        // For NFT rewards, nft_mint must be provided
        if ctx.accounts.reward.reward_type == 1 {
            ctx.accounts.reward.nft_mint = Some(nft_mint);
        } else {
            // If reward type is not NFT, clear the NFT mint
            ctx.accounts.reward.nft_mint = None;
        }
    }
    
    if let Some(is_active) = is_active {
        ctx.accounts.reward.is_active = is_active;
    }
    
    Ok(())
}