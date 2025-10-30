use anchor_lang::prelude::*;

#[account]
pub struct UserReward {
	pub user: Pubkey,
	pub reward_id: u64,
	pub claimed_at: i64,
	pub bump: u8,
}