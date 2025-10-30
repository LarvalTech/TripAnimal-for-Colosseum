import BN from "bn.js";
import {
  AnchorProvider,
  type IdlAccounts,
  Program,
  web3,
} from "@coral-xyz/anchor";
import { MethodsBuilder } from "@coral-xyz/anchor/dist/cjs/program/namespace/methods";
import type { BadgeRewards } from "../../../target/types/badge_rewards";
import idl from "../../../target/idl/badge_rewards.json";
import * as pda from "./pda";



let _program: Program<BadgeRewards>;


export const initializeClient = (
    programId: web3.PublicKey,
    anchorProvider = AnchorProvider.env(),
) => {
    _program = new Program<BadgeRewards>(
        idl as BadgeRewards,
        anchorProvider,
    );


};

export type InitializeBadgeArgs = {
  feePayer: web3.PublicKey;
  owner: web3.PublicKey;
  badgeId: bigint;
  name: string;
  description: string;
  iconUri: string;
  requiredPoints: bigint;
  maxEarnings: bigint;
  isActive: boolean;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Initialize a new badge
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` badge: {@link Badge} 
 * 2. `[signer]` owner: {@link PublicKey} The owner of the badge
 * 3. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - badge_id: {@link BigInt} Unique identifier for this badge
 * - name: {@link string} Name of the badge
 * - description: {@link string} type
 * - icon_uri: {@link string} URI to the badge icon
 * - required_points: {@link BigInt} Points required to earn this badge
 * - max_earnings: {@link BigInt} Maximum number of times this badge can be earned
 * - is_active: {@link boolean} Whether this badge is currently available for earning
 */
export const initializeBadgeBuilder = (
	args: InitializeBadgeArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<BadgeRewards, never> => {
    const [badgePubkey] = pda.deriveBadgePDA({
        owner: args.owner,
        badgeId: args.badgeId,
    }, _program.programId);

  // Helper function to safely create BN from bigint or undefined
  const safeBN = (value: bigint | undefined | null): BN | null => {
    if (value === undefined || value === null) {
      return null;
    }
    try {
      return new BN(value.toString());
    } catch (e) {
      // If BN constructor fails, return null to avoid invalid values
      return null;
    }
  };

  // For initializeBadge, we must pass actual BN values, not null
  // But we need to handle the case where values might be undefined
  const badgeIdBN = safeBN(args.badgeId) || new BN(0);
  const requiredPointsBN = safeBN(args.requiredPoints) || new BN(0);
  const maxEarningsBN = safeBN(args.maxEarnings) || new BN(0);

  return _program
    .methods
    .initializeBadge(
      badgeIdBN,
      args.name,
      args.description,
      args.iconUri,
      requiredPointsBN,
      maxEarningsBN,
      args.isActive,
    )
    .accountsStrict({
      feePayer: args.feePayer,
      badge: badgePubkey,
      owner: args.owner,
      systemProgram: new web3.PublicKey("11111111111111111111111111111111"),
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Initialize a new badge
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` badge: {@link Badge} 
 * 2. `[signer]` owner: {@link PublicKey} The owner of the badge
 * 3. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - badge_id: {@link BigInt} Unique identifier for this badge
 * - name: {@link string} Name of the badge
 * - description: {@link string} type
 * - icon_uri: {@link string} URI to the badge icon
 * - required_points: {@link BigInt} Points required to earn this badge
 * - max_earnings: {@link BigInt} Maximum number of times this badge can be earned
 * - is_active: {@link boolean} Whether this badge is currently available for earning
 */
export const initializeBadge = (
	args: InitializeBadgeArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    initializeBadgeBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Initialize a new badge
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` badge: {@link Badge} 
 * 2. `[signer]` owner: {@link PublicKey} The owner of the badge
 * 3. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - badge_id: {@link BigInt} Unique identifier for this badge
 * - name: {@link string} Name of the badge
 * - description: {@link string} type
 * - icon_uri: {@link string} URI to the badge icon
 * - required_points: {@link BigInt} Points required to earn this badge
 * - max_earnings: {@link BigInt} Maximum number of times this badge can be earned
 * - is_active: {@link boolean} Whether this badge is currently available for earning
 */
export const initializeBadgeSendAndConfirm = async (
  args: Omit<InitializeBadgeArgs, "feePayer" | "owner"> & {
    signers: {
      feePayer: web3.Signer,
      owner: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return initializeBadgeBuilder({
      ...args,
      feePayer: args.signers.feePayer.publicKey,
      owner: args.signers.owner.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.feePayer, args.signers.owner])
    .rpc();
}

export type UpdateBadgeArgs = {
  feePayer: web3.PublicKey;
  owner: web3.PublicKey;
  badgeId: bigint;
  name: string | undefined;
  description: string | undefined;
  iconUri: string | undefined;
  requiredPoints: bigint | undefined;
  maxEarnings: bigint | undefined;
  isActive: boolean | undefined;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Update badge information
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` badge: {@link Badge} 
 * 2. `[signer]` owner: {@link PublicKey} The owner of the badge
 *
 * Data:
 * - badge_id: {@link BigInt} Unique identifier for this badge
 * - name: {@link string | undefined} Name of the badge
 * - description: {@link string | undefined} type
 * - icon_uri: {@link string | undefined} URI to the badge icon
 * - required_points: {@link BigInt | undefined} Points required to earn this badge
 * - max_earnings: {@link BigInt | undefined} Maximum number of times this badge can be earned
 * - is_active: {@link boolean | undefined} Whether this badge is currently available for earning
 */
export const updateBadgeBuilder = (
	args: UpdateBadgeArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<BadgeRewards, never> => {
    const [badgePubkey] = pda.deriveBadgePDA({
        owner: args.owner,
        badgeId: args.badgeId,
    }, _program.programId);

  // Helper function to safely create BN from bigint or undefined
  const safeBN = (value: bigint | undefined | null): BN | null => {
    if (value === undefined || value === null) {
      return null;
    }
    try {
      return new BN(value.toString());
    } catch (e) {
      // If BN constructor fails, return null to avoid invalid values
      return null;
    }
  };

  return _program
    .methods
    .updateBadge(
      safeBN(args.badgeId) || new BN(0),
      args.name,
      args.description,
      args.iconUri,
      args.requiredPoints ? safeBN(args.requiredPoints) : undefined,
      args.maxEarnings ? safeBN(args.maxEarnings) : undefined,
      args.isActive,
    )
    .accountsStrict({
      feePayer: args.feePayer,
      badge: badgePubkey,
      owner: args.owner,
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Update badge information
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` badge: {@link Badge} 
 * 2. `[signer]` owner: {@link PublicKey} The owner of the badge
 *
 * Data:
 * - badge_id: {@link BigInt} Unique identifier for this badge
 * - name: {@link string | undefined} Name of the badge
 * - description: {@link string | undefined} type
 * - icon_uri: {@link string | undefined} URI to the badge icon
 * - required_points: {@link BigInt | undefined} Points required to earn this badge
 * - max_earnings: {@link BigInt | undefined} Maximum number of times this badge can be earned
 * - is_active: {@link boolean | undefined} Whether this badge is currently available for earning
 */
export const updateBadge = (
	args: UpdateBadgeArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    updateBadgeBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Update badge information
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` badge: {@link Badge} 
 * 2. `[signer]` owner: {@link PublicKey} The owner of the badge
 *
 * Data:
 * - badge_id: {@link BigInt} Unique identifier for this badge
 * - name: {@link string | undefined} Name of the badge
 * - description: {@link string | undefined} type
 * - icon_uri: {@link string | undefined} URI to the badge icon
 * - required_points: {@link BigInt | undefined} Points required to earn this badge
 * - max_earnings: {@link BigInt | undefined} Maximum number of times this badge can be earned
 * - is_active: {@link boolean | undefined} Whether this badge is currently available for earning
 */
export const updateBadgeSendAndConfirm = async (
  args: Omit<UpdateBadgeArgs, "feePayer" | "owner"> & {
    signers: {
      feePayer: web3.Signer,
      owner: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return updateBadgeBuilder({
      ...args,
      feePayer: args.signers.feePayer.publicKey,
      owner: args.signers.owner.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.feePayer, args.signers.owner])
    .rpc();
}

export type InitializeRewardArgs = {
  feePayer: web3.PublicKey;
  owner: web3.PublicKey;
  badgeId: bigint;
  rewardId: bigint;
  name: string;
  description: string;
  rewardType: number;
  rewardValue: bigint;
  tokenMint: web3.PublicKey | undefined;
  nftMint: web3.PublicKey | undefined;
  isActive: boolean;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Initialize a new reward for a badge
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` reward: {@link Reward} 
 * 2. `[signer]` owner: {@link PublicKey} The owner of the reward
 * 3. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - badge_id: {@link BigInt} The badge ID this reward is associated with
 * - reward_id: {@link BigInt} Unique identifier for this reward
 * - name: {@link string} Name of the reward
 * - description: {@link string} type
 * - reward_type: {@link number} Type of reward (0 = token, 1 = NFT, 2 = other)
 * - reward_value: {@link BigInt} Value of the reward
 * - token_mint: {@link PublicKey | undefined} Token mint for token rewards
 * - nft_mint: {@link PublicKey | undefined} NFT mint for NFT rewards
 * - is_active: {@link boolean} Whether this reward is currently available
 */
export const initializeRewardBuilder = (
	args: InitializeRewardArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<BadgeRewards, never> => {
    const [rewardPubkey] = pda.deriveRewardPDA({
        // This is the problematic line - it's missing owner parameter
        badgeId: args.badgeId,
        rewardId: args.rewardId,
    }, _program.programId);

  // Helper function to safely create BN from bigint or undefined
  const safeBN = (value: bigint | undefined | null): BN | null => {
    if (value === undefined || value === null) {
      return null;
    }
    try {
      return new BN(value.toString());
    } catch (e) {
      // If BN constructor fails, return null to avoid invalid values
      return null;
    }
  };

  // For initializeReward, we must pass actual BN values, not null
  // But we need to handle the case where values might be undefined
  const badgeIdBN = safeBN(args.badgeId) || new BN(0);
  const rewardIdBN = safeBN(args.rewardId) || new BN(0);
  const rewardValueBN = safeBN(args.rewardValue) || new BN(0);

  return _program
    .methods
    .initializeReward(
      badgeIdBN,
      rewardIdBN,
      args.name,
      args.description,
      args.rewardType,
      rewardValueBN,
      args.tokenMint,
      args.nftMint,
      args.isActive,
    )
    .accountsStrict({
      feePayer: args.feePayer,
      reward: rewardPubkey,
      owner: args.owner,
      systemProgram: new web3.PublicKey("11111111111111111111111111111111"),
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Initialize a new reward for a badge
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` reward: {@link Reward} 
 * 2. `[signer]` owner: {@link PublicKey} The owner of the reward
 * 3. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - badge_id: {@link BigInt} The badge ID this reward is associated with
 * - reward_id: {@link BigInt} Unique identifier for this reward
 * - name: {@link string} Name of the reward
 * - description: {@link string} type
 * - reward_type: {@link number} Type of reward (0 = token, 1 = NFT, 2 = other)
 * - reward_value: {@link BigInt} Value of the reward
 * - token_mint: {@link PublicKey | undefined} Token mint for token rewards
 * - nft_mint: {@link PublicKey | undefined} NFT mint for NFT rewards
 * - is_active: {@link boolean} Whether this reward is currently available
 */
export const initializeReward = (
	args: InitializeRewardArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    initializeRewardBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Initialize a new reward for a badge
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` reward: {@link Reward} 
 * 2. `[signer]` owner: {@link PublicKey} The owner of the reward
 * 3. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - badge_id: {@link BigInt} The badge ID this reward is associated with
 * - reward_id: {@link BigInt} Unique identifier for this reward
 * - name: {@link string} Name of the reward
 * - description: {@link string} type
 * - reward_type: {@link number} Type of reward (0 = token, 1 = NFT, 2 = other)
 * - reward_value: {@link BigInt} Value of the reward
 * - token_mint: {@link PublicKey | undefined} Token mint for token rewards
 * - nft_mint: {@link PublicKey | undefined} NFT mint for NFT rewards
 * - is_active: {@link boolean} Whether this reward is currently available
 */
export const initializeRewardSendAndConfirm = async (
  args: Omit<InitializeRewardArgs, "feePayer" | "owner"> & {
    signers: {
      feePayer: web3.Signer,
      owner: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return initializeRewardBuilder({
      ...args,
      feePayer: args.signers.feePayer.publicKey,
      owner: args.signers.owner.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.feePayer, args.signers.owner])
    .rpc();
}

export type UpdateRewardArgs = {
  feePayer: web3.PublicKey;
  owner: web3.PublicKey;
  badgeId: bigint;
  rewardId: bigint;
  name: string | undefined;
  description: string | undefined;
  rewardType: number | undefined;
  rewardValue: bigint | undefined;
  tokenMint: web3.PublicKey | undefined;
  nftMint: web3.PublicKey | undefined;
  isActive: boolean | undefined;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Update reward information
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` reward: {@link Reward} 
 * 2. `[signer]` owner: {@link PublicKey} The owner of the reward
 *
 * Data:
 * - badge_id: {@link BigInt} The badge ID this reward is associated with
 * - reward_id: {@link BigInt} Unique identifier for this reward
 * - name: {@link string | undefined} Name of the reward
 * - description: {@link string | undefined} type
 * - reward_type: {@link number | undefined} Type of reward (0 = token, 1 = NFT, 2 = other)
 * - reward_value: {@link BigInt | undefined} Value of the reward
 * - token_mint: {@link PublicKey | undefined} Token mint for token rewards
 * - nft_mint: {@link PublicKey | undefined} NFT mint for NFT rewards
 * - is_active: {@link boolean | undefined} Whether this reward is currently available
 */
export const updateRewardBuilder = (
	args: UpdateRewardArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<BadgeRewards, never> => {
    const [rewardPubkey] = pda.deriveRewardPDA({
        // This is also problematic - missing owner parameter
        badgeId: args.badgeId,
        rewardId: args.rewardId,
    }, _program.programId);

  // Helper function to safely create BN from bigint or undefined
  const safeBN = (value: bigint | undefined | null): BN | null => {
    if (value === undefined || value === null) {
      return null;
    }
    try {
      return new BN(value.toString());
    } catch (e) {
      // If BN constructor fails, return null to avoid invalid values
      return null;
    }
  };

  // For updateReward, we can pass null for optional parameters
  // But we still need to ensure we pass valid BNs for required parameters
  const badgeIdBN = safeBN(args.badgeId) || new BN(0);
  const rewardIdBN = safeBN(args.rewardId) || new BN(0);
  const rewardValueBN = args.rewardValue !== undefined ? safeBN(args.rewardValue) : null;

  return _program
    .methods
    .updateReward(
      badgeIdBN,
      rewardIdBN,
      args.name,
      args.description,
      args.rewardType !== undefined ? args.rewardType : null,
      rewardValueBN,
      args.tokenMint !== undefined ? args.tokenMint : null,
      args.nftMint !== undefined ? args.nftMint : null,
      args.isActive !== undefined ? args.isActive : null,
    )
    .accountsStrict({
      feePayer: args.feePayer,
      reward: rewardPubkey,
      owner: args.owner,
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Update reward information
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` reward: {@link Reward} 
 * 2. `[signer]` owner: {@link PublicKey} The owner of the reward
 *
 * Data:
 * - badge_id: {@link BigInt} The badge ID this reward is associated with
 * - reward_id: {@link BigInt} Unique identifier for this reward
 * - name: {@link string | undefined} Name of the reward
 * - description: {@link string | undefined} type
 * - reward_type: {@link number | undefined} Type of reward (0 = token, 1 = NFT, 2 = other)
 * - reward_value: {@link BigInt | undefined} Value of the reward
 * - token_mint: {@link PublicKey | undefined} Token mint for token rewards
 * - nft_mint: {@link PublicKey | undefined} NFT mint for NFT rewards
 * - is_active: {@link boolean | undefined} Whether this reward is currently available
 */
export const updateReward = (
	args: UpdateRewardArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    updateRewardBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Update reward information
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` reward: {@link Reward} 
 * 2. `[signer]` owner: {@link PublicKey} The owner of the reward
 *
 * Data:
 * - badge_id: {@link BigInt} The badge ID this reward is associated with
 * - reward_id: {@link BigInt} Unique identifier for this reward
 * - name: {@link string | undefined} Name of the reward
 * - description: {@link string | undefined} type
 * - reward_type: {@link number | undefined} Type of reward (0 = token, 1 = NFT, 2 = other)
 * - reward_value: {@link BigInt | undefined} Value of the reward
 * - token_mint: {@link PublicKey | undefined} Token mint for token rewards
 * - nft_mint: {@link PublicKey | undefined} NFT mint for NFT rewards
 * - is_active: {@link boolean | undefined} Whether this reward is currently available
 */
export const updateRewardSendAndConfirm = async (
  args: Omit<UpdateRewardArgs, "feePayer" | "owner"> & {
    signers: {
      feePayer: web3.Signer,
      owner: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return updateRewardBuilder({
      ...args,
      feePayer: args.signers.feePayer.publicKey,
      owner: args.signers.owner.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.feePayer, args.signers.owner])
    .rpc();
}

export type ClaimRewardArgs = {
  feePayer: web3.PublicKey;
  user: web3.PublicKey;
  userTokenAccount: web3.PublicKey;
  rewardTokenAccount: web3.PublicKey;
  rewardMint: web3.PublicKey;
  source: web3.PublicKey;
  mint: web3.PublicKey;
  destination: web3.PublicKey;
  authority: web3.PublicKey;
  owner: web3.PublicKey;
  badgeId: bigint;
  rewardId: bigint;
  rewardType: number;
  rewardValue: bigint;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Claim a reward for a badge
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[signer]` user: {@link PublicKey} The user claiming the reward
 * 2. `[writable]` user_reward: {@link UserReward} 
 * 3. `[writable]` reward: {@link Reward} 
 * 4. `[writable]` badge: {@link Badge} 
 * 5. `[writable]` user_badge: {@link UserBadge} 
 * 6. `[writable]` user_token_account: {@link PublicKey} User's token account for reward transfer
 * 7. `[writable]` reward_token_account: {@link PublicKey} Reward token account for transfer
 * 8. `[]` reward_mint: {@link Mint} The token mint for the reward
 * 9. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 * 10. `[writable]` source: {@link PublicKey} The source account.
 * 11. `[]` mint: {@link Mint} The token mint.
 * 12. `[writable]` destination: {@link PublicKey} The destination account.
 * 13. `[signer]` authority: {@link PublicKey} The source account's owner/delegate.
 * 14. `[]` token_program: {@link PublicKey} Auto-generated, TokenProgram
 *
 * Data:
 * - owner: {@link PublicKey} The owner of the badge
 * - badge_id: {@link BigInt} The badge ID
 * - reward_id: {@link BigInt} The reward ID
 * - reward_type: {@link number} Type of reward (0 = token, 1 = NFT, 2 = other)
 * - reward_value: {@link BigInt} Value of the reward
 */
export const claimRewardBuilder = (
	args: ClaimRewardArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<BadgeRewards, never> => {
    const [userRewardPubkey] = pda.deriveUserRewardPDA({
        user: args.user,
        rewardId: args.rewardId,
    }, _program.programId);
    const [rewardPubkey] = pda.deriveRewardPDA({
        // This one is correct - has owner parameter
        owner: args.owner,
        badgeId: args.badgeId,
        rewardId: args.rewardId,
    }, _program.programId);
    const [badgePubkey] = pda.deriveBadgePDA({
        owner: args.owner,
        badgeId: args.badgeId,
    }, _program.programId);
    const [userBadgePubkey] = pda.deriveUserBadgePDA({
        user: args.user,
        badgeId: args.badgeId,
    }, _program.programId);

  // Helper function to safely create BN from bigint or undefined
  const safeBN = (value: bigint | undefined | null): BN | null => {
    if (value === undefined || value === null) {
      return null;
    }
    try {
      return new BN(value.toString());
    } catch (e) {
      // If BN constructor fails, return null to avoid invalid values
      return null;
    }
  };

  // For claimReward, we must pass actual BN values, not null
  const badgeIdBN = safeBN(args.badgeId) || new BN(0);
  const rewardIdBN = safeBN(args.rewardId) || new BN(0);
  const rewardValueBN = safeBN(args.rewardValue) || new BN(0);

  return _program
    .methods
    .claimReward(
      args.owner,
      badgeIdBN,
      rewardIdBN,
      args.rewardType,
      rewardValueBN,
    )
    .accountsStrict({
      feePayer: args.feePayer,
      user: args.user,
      userReward: userRewardPubkey,
      reward: rewardPubkey,
      badge: badgePubkey,
      userBadge: userBadgePubkey,
      userTokenAccount: args.userTokenAccount,
      rewardTokenAccount: args.rewardTokenAccount,
      rewardMint: args.rewardMint,
      systemProgram: new web3.PublicKey("11111111111111111111111111111111"),
      source: args.source,
      mint: args.mint,
      destination: args.destination,
      authority: args.authority,
      tokenProgram: new web3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Claim a reward for a badge
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[signer]` user: {@link PublicKey} The user claiming the reward
 * 2. `[writable]` user_reward: {@link UserReward} 
 * 3. `[writable]` reward: {@link Reward} 
 * 4. `[writable]` badge: {@link Badge} 
 * 5. `[writable]` user_badge: {@link UserBadge} 
 * 6. `[writable]` user_token_account: {@link PublicKey} User's token account for reward transfer
 * 7. `[writable]` reward_token_account: {@link PublicKey} Reward token account for transfer
 * 8. `[]` reward_mint: {@link Mint} The token mint for the reward
 * 9. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 * 10. `[writable]` source: {@link PublicKey} The source account.
 * 11. `[]` mint: {@link Mint} The token mint.
 * 12. `[writable]` destination: {@link PublicKey} The destination account.
 * 13. `[signer]` authority: {@link PublicKey} The source account's owner/delegate.
 * 14. `[]` token_program: {@link PublicKey} Auto-generated, TokenProgram
 *
 * Data:
 * - owner: {@link PublicKey} The owner of the badge
 * - badge_id: {@link BigInt} The badge ID
 * - reward_id: {@link BigInt} The reward ID
 * - reward_type: {@link number} Type of reward (0 = token, 1 = NFT, 2 = other)
 * - reward_value: {@link BigInt} Value of the reward
 */
export const claimReward = (
	args: ClaimRewardArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    claimRewardBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Claim a reward for a badge
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[signer]` user: {@link PublicKey} The user claiming the reward
 * 2. `[writable]` user_reward: {@link UserReward} 
 * 3. `[writable]` reward: {@link Reward} 
 * 4. `[writable]` badge: {@link Badge} 
 * 5. `[writable]` user_badge: {@link UserBadge} 
 * 6. `[writable]` user_token_account: {@link PublicKey} User's token account for reward transfer
 * 7. `[writable]` reward_token_account: {@link PublicKey} Reward token account for transfer
 * 8. `[]` reward_mint: {@link Mint} The token mint for the reward
 * 9. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 * 10. `[writable]` source: {@link PublicKey} The source account.
 * 11. `[]` mint: {@link Mint} The token mint.
 * 12. `[writable]` destination: {@link PublicKey} The destination account.
 * 13. `[signer]` authority: {@link PublicKey} The source account's owner/delegate.
 * 14. `[]` token_program: {@link PublicKey} Auto-generated, TokenProgram
 *
 * Data:
 * - owner: {@link PublicKey} The owner of the badge
 * - badge_id: {@link BigInt} The badge ID
 * - reward_id: {@link BigInt} The reward ID
 * - reward_type: {@link number} Type of reward (0 = token, 1 = NFT, 2 = other)
 * - reward_value: {@link BigInt} Value of the reward
 */
export const claimRewardSendAndConfirm = async (
  args: Omit<ClaimRewardArgs, "feePayer" | "user" | "authority"> & {
    signers: {
      feePayer: web3.Signer,
      user: web3.Signer,
      authority: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return claimRewardBuilder({
      ...args,
      feePayer: args.signers.feePayer.publicKey,
      user: args.signers.user.publicKey,
      authority: args.signers.authority.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.feePayer, args.signers.user, args.signers.authority])
    .rpc();
}

export type GetUserBadgesArgs = {
  feePayer: web3.PublicKey;
  user: web3.PublicKey;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Get all badges earned by a user
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} Auto-generated, default fee payer
 *
 * Data:
 * - user: {@link PublicKey} The user to get badges for
 */
export const getUserBadgesBuilder = (
	args: GetUserBadgesArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<BadgeRewards, never> => {
  return _program
    .methods
    .getUserBadges(
      args.user,
    )
    .accountsStrict({
      feePayer: args.feePayer,
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Get all badges earned by a user
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} Auto-generated, default fee payer
 *
 * Data:
 * - user: {@link PublicKey} The user to get badges for
 */
export const getUserBadges = (
	args: GetUserBadgesArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    getUserBadgesBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Get all badges earned by a user
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} Auto-generated, default fee payer
 *
 * Data:
 * - user: {@link PublicKey} The user to get badges for
 */
export const getUserBadgesSendAndConfirm = async (
  args: Omit<GetUserBadgesArgs, "feePayer"> & {
    signers: {
      feePayer: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return getUserBadgesBuilder({
      ...args,
      feePayer: args.signers.feePayer.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.feePayer])
    .rpc();
}

export type GetUserRewardsArgs = {
  feePayer: web3.PublicKey;
  user: web3.PublicKey;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Get all rewards claimed by a user
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} Auto-generated, default fee payer
 *
 * Data:
 * - user: {@link PublicKey} The user to get rewards for
 */
export const getUserRewardsBuilder = (
	args: GetUserRewardsArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<BadgeRewards, never> => {
  return _program
    .methods
    .getUserRewards(
      args.user,
    )
    .accountsStrict({
      feePayer: args.feePayer,
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Get all rewards claimed by a user
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} Auto-generated, default fee payer
 *
 * Data:
 * - user: {@link PublicKey} The user to get rewards for
 */
export const getUserRewards = (
	args: GetUserRewardsArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    getUserRewardsBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Get all rewards claimed by a user
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} Auto-generated, default fee payer
 *
 * Data:
 * - user: {@link PublicKey} The user to get rewards for
 */
export const getUserRewardsSendAndConfirm = async (
  args: Omit<GetUserRewardsArgs, "feePayer"> & {
    signers: {
      feePayer: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return getUserRewardsBuilder({
      ...args,
      feePayer: args.signers.feePayer.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.feePayer])
    .rpc();
}

// Getters

export const getBadge = (
    publicKey: web3.PublicKey,
    commitment?: web3.Commitment
): Promise<IdlAccounts<BadgeRewards>["badge"]> => _program.account.badge.fetch(publicKey, commitment);

export const getUserBadge = (
    publicKey: web3.PublicKey,
    commitment?: web3.Commitment
): Promise<IdlAccounts<BadgeRewards>["userBadge"]> => _program.account.userBadge.fetch(publicKey, commitment);

export const getReward = (
    publicKey: web3.PublicKey,
    commitment?: web3.Commitment
): Promise<IdlAccounts<BadgeRewards>["reward"]> => _program.account.reward.fetch(publicKey, commitment);

export const getUserReward = (
    publicKey: web3.PublicKey,
    commitment?: web3.Commitment
): Promise<IdlAccounts<BadgeRewards>["userReward"]> => _program.account.userReward.fetch(publicKey, commitment);