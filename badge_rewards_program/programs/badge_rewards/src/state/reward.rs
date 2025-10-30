use anchor_lang::prelude::*;

#[account]
pub struct Reward {
	pub owner: Pubkey,
	pub badge_id: u64,
	pub reward_id: u64,
	pub name: String,
	pub description: String,
	pub reward_type: u8,
	pub reward_value: u64,
	pub token_mint: Option<Pubkey>,
	pub nft_mint: Option<Pubkey>,
	pub is_active: bool,
	pub bump: u8,
}