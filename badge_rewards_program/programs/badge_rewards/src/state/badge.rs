use anchor_lang::prelude::*;

#[account]
pub struct Badge {
	pub owner: Pubkey,
	pub badge_id: u64,
	pub name: String,
	pub description: String,
	pub icon_uri: String,
	pub required_points: u64,
	pub max_earnings: u64,
	pub total_earned: u64,
	pub is_active: bool,
	pub bump: u8,
}