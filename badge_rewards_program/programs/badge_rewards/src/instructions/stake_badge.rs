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
)]
pub struct StakeBadge<'info> {
	#[account(
		mut,
	)]
	pub fee_payer: Signer<'info>,

	#[account(
		mut,
		seeds = [
			b"badge",
			badge_owner.key().as_ref(),
			badge_id.to_le_bytes().as_ref(),
		],
		bump = badge.bump,
	)]
	pub badge: Account<'info, Badge>,

	#[account(
		init,
		space = 40,
		payer = fee_payer,
		seeds = [
			b"user_badge",
			user.key().as_ref(),
			badge_id.to_le_bytes().as_ref(),
		],
		bump,
	)]
	pub user_badge: Account<'info, UserBadge>,

	pub badge_owner: Signer<'info>,
	pub user: Signer<'info>,

	pub system_program: Program<'info, System>,
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
pub fn handler(
	ctx: Context<StakeBadge>,
	badge_id: u64,
) -> Result<()> {
    // Validate that the badge exists and is active
    require!(ctx.accounts.badge.is_active, BadgeRewardsError::BadgeNotActive);
    require!(ctx.accounts.badge.owner == ctx.accounts.badge_owner.key(), BadgeRewardsError::Unauthorized);
    
    // Check if user already has this badge
    // Initialize the user badge account
    ctx.accounts.user_badge.user = ctx.accounts.user.key();
    ctx.accounts.user_badge.badge_id = badge_id;
    ctx.accounts.user_badge.earned_at = Clock::get()?.unix_timestamp;
    ctx.accounts.user_badge.bump = ctx.bumps.user_badge;
    
    // Update badge total earned count
    ctx.accounts.badge.total_earned = ctx.accounts.badge.total_earned.saturating_add(1);
    
    Ok(())
}