use crate::*;
use anchor_lang::prelude::*;
use std::str::FromStr;

use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token, TokenAccount},
};

#[derive(Accounts)]
#[instruction(
	badge_id: u64,
	reward_id: u64,
	name: String,
	description: String,
	reward_type: u8,
	reward_value: u64,
	token_mint: Option<Pubkey>,
	nft_mint: Option<Pubkey>,
	is_active: bool,
)]
pub struct InitializeReward<'info> {
	#[account(
		mut,
	)]
	pub fee_payer: Signer<'info>,

	#[account(
		init,
		space=918,
		payer=fee_payer,
		seeds = [
			b"reward",
			owner.key().as_ref(),
			badge_id.to_le_bytes().as_ref(),
			reward_id.to_le_bytes().as_ref(),
		],
		bump,
	)]
	pub reward: Account<'info, Reward>,

	pub owner: Signer<'info>,

	pub system_program: Program<'info, System>,
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
pub fn handler(
	ctx: Context<InitializeReward>,
	badge_id: u64,
	reward_id: u64,
	name: String,
	description: String,
	reward_type: u8,
	reward_value: u64,
	token_mint: Option<Pubkey>,
	nft_mint: Option<Pubkey>,
	is_active: bool,
) -> Result<()> {
    // Validate inputs
    require!(reward_type <= 2, BadgeRewardsError::InvalidRewardType);
    require!(reward_value > 0, BadgeRewardsError::InvalidRewardValue);
    require!(name.len() <= 100, BadgeRewardsError::NameTooLong);
    require!(description.len() <= 500, BadgeRewardsError::DescriptionTooLong);
    
    // For token rewards, token_mint must be provided
    if reward_type == 0 {
        require!(token_mint.is_some(), BadgeRewardsError::MissingTokenMint);
    }
    
    // For NFT rewards, nft_mint must be provided
    if reward_type == 1 {
        require!(nft_mint.is_some(), BadgeRewardsError::MissingNftMint);
    }
    
    // Initialize the reward
    let reward = &mut ctx.accounts.reward;
    reward.badge_id = badge_id;
    reward.reward_id = reward_id;
    reward.name = name;
    reward.description = description;
    reward.reward_type = reward_type;
    reward.reward_value = reward_value;
    reward.token_mint = token_mint;
    reward.nft_mint = nft_mint;
    reward.is_active = is_active;
    reward.bump = ctx.bumps.reward;
    
    Ok(())
}