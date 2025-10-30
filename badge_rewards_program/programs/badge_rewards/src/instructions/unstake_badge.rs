use crate::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(
	badge_id: u64,
)]
pub struct UnstakeBadge<'info> {
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
		mut,
		seeds = [
			b"user_badge",
			user.key().as_ref(),
			badge_id.to_le_bytes().as_ref(),
		],
		bump = user_badge.bump,
	)]
	pub user_badge: Account<'info, UserBadge>,

	pub badge_owner: Signer<'info>,
	pub user: Signer<'info>,

	pub system_program: Program<'info, System>,
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
pub fn handler(
	ctx: Context<UnstakeBadge>,
	badge_id: u64,
) -> Result<()> {
    // Validate that the badge exists and is owned by the owner
    require!(ctx.accounts.badge.owner == ctx.accounts.badge_owner.key(), BadgeRewardsError::Unauthorized);
    require!(ctx.accounts.badge.badge_id == badge_id, BadgeRewardsError::InvalidBadgeId);
    
    // Validate that the user has the badge
    require!(ctx.accounts.user_badge.user == ctx.accounts.user.key(), BadgeRewardsError::Unauthorized);
    require!(ctx.accounts.user_badge.badge_id == badge_id, BadgeRewardsError::InvalidBadgeId);
    
    // Unstake the badge from the user
    // We'll just close the user_badge account to remove the badge
    // In a real implementation, you might want to mark it as un-staked instead
    
    // Update badge total earned count
    if ctx.accounts.badge.total_earned > 0 {
        ctx.accounts.badge.total_earned = ctx.accounts.badge.total_earned.saturating_sub(1);
    }
    
    Ok(())
}