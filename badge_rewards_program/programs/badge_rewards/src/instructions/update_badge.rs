use crate::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(
	badge_id: u64,
)]
pub struct UpdateBadge<'info> {
	#[account(
		mut,
	)]
	pub fee_payer: Signer<'info>,

	#[account(
		mut,
		seeds = [
			b"badge",
			owner.key().as_ref(),
			badge_id.to_le_bytes().as_ref(),
		],
		bump = badge.bump,
	)]
	pub badge: Account<'info, Badge>,

	pub owner: Signer<'info>,
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
pub fn handler(
	ctx: Context<UpdateBadge>,
	badge_id: u64,
	name: Option<String>,
	description: Option<String>,
	icon_uri: Option<String>,
	required_points: Option<u64>,
	max_earnings: Option<u64>,
	is_active: Option<bool>,
) -> Result<()> {
    // Validate that the badge exists and is owned by the owner
    require!(ctx.accounts.badge.owner == ctx.accounts.owner.key(), BadgeRewardsError::Unauthorized);
    require!(ctx.accounts.badge.badge_id == badge_id, BadgeRewardsError::InvalidBadgeId);
    
    // Update badge fields if provided
    if let Some(name) = name {
        require!(name.len() <= 100, BadgeRewardsError::NameTooLong);
        ctx.accounts.badge.name = name;
    }
    
    if let Some(description) = description {
        require!(description.len() <= 500, BadgeRewardsError::DescriptionTooLong);
        ctx.accounts.badge.description = description;
    }
    
    if let Some(icon_uri) = icon_uri {
        require!(icon_uri.len() <= 200, BadgeRewardsError::IconUriTooLong);
        ctx.accounts.badge.icon_uri = icon_uri;
    }
    
    if let Some(required_points) = required_points {
        require!(required_points > 0, BadgeRewardsError::InvalidRequiredPoints);
        ctx.accounts.badge.required_points = required_points;
    }
    
    if let Some(max_earnings) = max_earnings {
        require!(max_earnings > 0, BadgeRewardsError::InvalidMaxEarnings);
        ctx.accounts.badge.max_earnings = max_earnings;
    }
    
    if let Some(is_active) = is_active {
        ctx.accounts.badge.is_active = is_active;
    }
    
    Ok(())
}