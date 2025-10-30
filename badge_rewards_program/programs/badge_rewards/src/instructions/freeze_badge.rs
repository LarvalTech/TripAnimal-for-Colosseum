use crate::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(
	badge_id: u64,
)]
pub struct FreezeBadge<'info> {
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

	pub badge_owner: Signer<'info>,
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
pub fn handler(
	ctx: Context<FreezeBadge>,
	badge_id: u64,
) -> Result<()> {
    // Validate that the badge exists and is owned by the owner
    require!(ctx.accounts.badge.owner == ctx.accounts.badge_owner.key(), BadgeRewardsError::Unauthorized);
    require!(ctx.accounts.badge.badge_id == badge_id, BadgeRewardsError::InvalidBadgeId);
    
    // Freeze the badge
    ctx.accounts.badge.is_active = false;
    
    Ok(())
}