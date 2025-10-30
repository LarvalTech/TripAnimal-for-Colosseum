use anchor_lang::prelude::*;

#[error_code]
pub enum BadgeRewardsError {
	#[msg("Badge not found")]
	BadgeNotFound,
	#[msg("Reward not found")]
	RewardNotFound,
	#[msg("Insufficient points to earn badge")]
	InsufficientPoints,
	#[msg("Badge already earned")]
	BadgeAlreadyEarned,
	#[msg("Reward already claimed")]
	RewardAlreadyClaimed,
	#[msg("Invalid reward type")]
	InvalidRewardType,
	#[msg("Unauthorized access")]
	Unauthorized,
	#[msg("Badge is not active")]
	BadgeNotActive,
	#[msg("Reward is not active")]
	RewardNotActive,
	#[msg("Maximum earnings for badge reached")]
	MaxEarningsReached,
	#[msg("Invalid badge ID")]
	InvalidBadgeId,
	#[msg("Invalid reward ID")]
	InvalidRewardId,
	#[msg("Invalid required points")]
	InvalidRequiredPoints,
	#[msg("Invalid max earnings")]
	InvalidMaxEarnings,
	#[msg("Name too long")]
	NameTooLong,
	#[msg("Description too long")]
	DescriptionTooLong,
	#[msg("Icon URI too long")]
	IconUriTooLong,
	#[msg("Invalid reward value")]
	InvalidRewardValue,
	#[msg("Missing token mint")]
	MissingTokenMint,
	#[msg("Missing NFT mint")]
	MissingNftMint,
	#[msg("Invalid token mint")]
	InvalidTokenMint,
}