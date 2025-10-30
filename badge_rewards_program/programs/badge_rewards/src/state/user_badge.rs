use anchor_lang::prelude::*;

#[account]
pub struct UserBadge {
	pub user: Pubkey,
	pub badge_id: u64,
	pub earned_at: i64,
	pub bump: u8,
}