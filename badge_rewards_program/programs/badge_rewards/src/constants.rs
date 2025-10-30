use anchor_lang::prelude::*;

#[constant]
pub const SEED: &str = "anchor";

// Badge and reward types
pub const REWARD_TYPE_TOKEN: u8 = 0;
pub const REWARD_TYPE_NFT: u8 = 1;
pub const REWARD_TYPE_OTHER: u8 = 2;

// Badge and reward status
pub const BADGE_ACTIVE: bool = true;
pub const BADGE_INACTIVE: bool = false;
pub const REWARD_ACTIVE: bool = true;
pub const REWARD_INACTIVE: bool = false;