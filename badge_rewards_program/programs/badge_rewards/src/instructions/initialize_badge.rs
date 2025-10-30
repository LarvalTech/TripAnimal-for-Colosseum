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
	name: String,
	description: String,
	icon_uri: String,
	required_points: u64,
	max_earnings: u64,
	is_active: bool,
)]
pub struct InitializeBadge<'info> {
	#[account(
		mut,
	)]
	pub fee_payer: Signer<'info>,

	#[account(
		init,
		space=918,
		payer=fee_payer,
		seeds = [
			b"badge",
			owner.key().as_ref(),
			badge_id.to_le_bytes().as_ref(),
		],
		bump,
	)]
	pub badge: Account<'info, Badge>,

	pub owner: Signer<'info>,

	pub system_program: Program<'info, System>,
}

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
pub fn handler(
	ctx: Context<InitializeBadge>,
	badge_id: u64,
	name: String,
	description: String,
	icon_uri: String,
	required_points: u64,
	max_earnings: u64,
	is_active: bool,
) -> Result<()> {
    // Validate inputs
    require!(required_points > 0, BadgeRewardsError::InvalidRequiredPoints);
    require!(max_earnings > 0, BadgeRewardsError::InvalidMaxEarnings);
    require!(name.len() <= 100, BadgeRewardsError::NameTooLong);
    require!(description.len() <= 500, BadgeRewardsError::DescriptionTooLong);
    require!(icon_uri.len() <= 200, BadgeRewardsError::IconUriTooLong);
    
    // Initialize the badge
    let badge = &mut ctx.accounts.badge;
    badge.owner = ctx.accounts.owner.key();
    badge.badge_id = badge_id;
    badge.name = name;
    badge.description = description;
    badge.icon_uri = icon_uri;
    badge.required_points = required_points;
    badge.max_earnings = max_earnings;
    badge.total_earned = 0;
    badge.is_active = is_active;
    badge.bump = ctx.bumps.badge;
    
    Ok(())
}