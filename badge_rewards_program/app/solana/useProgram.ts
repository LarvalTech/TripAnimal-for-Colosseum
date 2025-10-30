import { AnchorProvider } from "@coral-xyz/anchor";
import {
  Keypair,
  PublicKey,
  type AccountMeta,
  type TransactionInstruction,
  type TransactionSignature,
} from "@solana/web3.js";
import { useCallback, useState, useEffect } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import * as programClient from "~/solana/client";

// Props interface for the useProgram hook
export interface UseProgramProps {
  // Optional override for the VITE_SOLANA_PROGRAM_ID env var
  programId?: string;
}

// Error structure returned from sendAndConfirmTx if transaction fails
type SendAndConfirmTxError = {
  message: string;
  logs: string[];
  stack: string | undefined;
};

// Result structure returned from sendAndConfirmTx
type SendAndConfirmTxResult = {
  // Signature of successful transaction
  signature?: string;

  // Error details if transaction fails
  error?: SendAndConfirmTxError;
};

// Helper function to send and confirm a transaction, with error handling
const sendAndConfirmTx = async (
  fn: () => Promise<TransactionSignature>,
): Promise<SendAndConfirmTxResult> => {
  try {
    const signature = await fn();
    return {
      signature,
    };
  } catch (e: any) {
    let message = `An unknown error occurred: ${e}`;
    let logs = [];
    let stack = "";

    if ("logs" in e && e.logs instanceof Array) {
      logs = e.logs;
    }

    if ("stack" in e) {
      stack = e.stack;
    }

    if ("message" in e) {
      message = e.message;
    }

    return {
      error: {
        logs,
        stack,
        message,
      },
    };
  }
};

const useProgram = (props?: UseProgramProps | undefined) => {
  const [programId, setProgramId] = useState<PublicKey|undefined>(undefined)
  const { connection } = useConnection();

  useEffect(() => {
    let prgId = import.meta.env.VITE_SOLANA_PROGRAM_ID as string | undefined;

    if (props?.programId) {
      prgId = props.programId;
    }

    if (!prgId) {
      throw new Error(
        "the program id must be provided either by the useProgram props or the env var VITE_SOLANA_PROGRAM_ID",
      );
    }

    const pid = new PublicKey(prgId)
    setProgramId(pid)
    programClient.initializeClient(pid, new AnchorProvider(connection));
  }, [props?.programId, connection.rpcEndpoint]);

  /**
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
   *
   * @returns {@link TransactionInstruction}
   */
  const initializeBadge = useCallback(programClient.initializeBadge, [])

  /**
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
   *
   * @returns {@link SendAndConfirmTxResult}
   */
  const initializeBadgeSendAndConfirm = useCallback(async (
    args: Omit<programClient.InitializeBadgeArgs, "feePayer" | "owner"> & {
    signers: {
        feePayer: Keypair,
        owner: Keypair,
    }}, 
    remainingAccounts: Array<AccountMeta> = []
  ): Promise<SendAndConfirmTxResult> => sendAndConfirmTx(() => programClient.initializeBadgeSendAndConfirm(args, remainingAccounts)), [])

  /**
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
   *
   * @returns {@link TransactionInstruction}
   */
  const updateBadge = useCallback(programClient.updateBadge, [])

  /**
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
   *
   * @returns {@link SendAndConfirmTxResult}
   */
  const updateBadgeSendAndConfirm = useCallback(async (
    args: Omit<programClient.UpdateBadgeArgs, "feePayer" | "owner"> & {
    signers: {
        feePayer: Keypair,
        owner: Keypair,
    }}, 
    remainingAccounts: Array<AccountMeta> = []
  ): Promise<SendAndConfirmTxResult> => sendAndConfirmTx(() => programClient.updateBadgeSendAndConfirm(args, remainingAccounts)), [])

  /**
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
   *
   * @returns {@link TransactionInstruction}
   */
  const initializeReward = useCallback(programClient.initializeReward, [])

  /**
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
   *
   * @returns {@link SendAndConfirmTxResult}
   */
  const initializeRewardSendAndConfirm = useCallback(async (
    args: Omit<programClient.InitializeRewardArgs, "feePayer" | "owner"> & {
    signers: {
        feePayer: Keypair,
        owner: Keypair,
    }}, 
    remainingAccounts: Array<AccountMeta> = []
  ): Promise<SendAndConfirmTxResult> => sendAndConfirmTx(() => programClient.initializeRewardSendAndConfirm(args, remainingAccounts)), [])

  /**
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
   *
   * @returns {@link TransactionInstruction}
   */
  const updateReward = useCallback(programClient.updateReward, [])

  /**
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
   *
   * @returns {@link SendAndConfirmTxResult}
   */
  const updateRewardSendAndConfirm = useCallback(async (
    args: Omit<programClient.UpdateRewardArgs, "feePayer" | "owner"> & {
    signers: {
        feePayer: Keypair,
        owner: Keypair,
    }}, 
    remainingAccounts: Array<AccountMeta> = []
  ): Promise<SendAndConfirmTxResult> => sendAndConfirmTx(() => programClient.updateRewardSendAndConfirm(args, remainingAccounts)), [])

  /**
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
   *
   * @returns {@link TransactionInstruction}
   */
  const claimReward = useCallback(programClient.claimReward, [])

  /**
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
   *
   * @returns {@link SendAndConfirmTxResult}
   */
  const claimRewardSendAndConfirm = useCallback(async (
    args: Omit<programClient.ClaimRewardArgs, "feePayer" | "user" | "authority"> & {
    signers: {
        feePayer: Keypair,
        user: Keypair,
        authority: Keypair,
    }}, 
    remainingAccounts: Array<AccountMeta> = []
  ): Promise<SendAndConfirmTxResult> => sendAndConfirmTx(() => programClient.claimRewardSendAndConfirm(args, remainingAccounts)), [])

  /**
   * Get all badges earned by a user
   *
   * Accounts:
   * 0. `[writable, signer]` fee_payer: {@link PublicKey} Auto-generated, default fee payer
   *
   * Data:
   * - user: {@link PublicKey} The user to get badges for
   *
   * @returns {@link TransactionInstruction}
   */
  const getUserBadges = useCallback(programClient.getUserBadges, [])

  /**
   * Get all badges earned by a user
   *
   * Accounts:
   * 0. `[writable, signer]` fee_payer: {@link PublicKey} Auto-generated, default fee payer
   *
   * Data:
   * - user: {@link PublicKey} The user to get badges for
   *
   * @returns {@link SendAndConfirmTxResult}
   */
  const getUserBadgesSendAndConfirm = useCallback(async (
    args: Omit<programClient.GetUserBadgesArgs, "feePayer"> & {
    signers: {
        feePayer: Keypair,
    }}, 
    remainingAccounts: Array<AccountMeta> = []
  ): Promise<SendAndConfirmTxResult> => sendAndConfirmTx(() => programClient.getUserBadgesSendAndConfirm(args, remainingAccounts)), [])

  /**
   * Get all rewards claimed by a user
   *
   * Accounts:
   * 0. `[writable, signer]` fee_payer: {@link PublicKey} Auto-generated, default fee payer
   *
   * Data:
   * - user: {@link PublicKey} The user to get rewards for
   *
   * @returns {@link TransactionInstruction}
   */
  const getUserRewards = useCallback(programClient.getUserRewards, [])

  /**
   * Get all rewards claimed by a user
   *
   * Accounts:
   * 0. `[writable, signer]` fee_payer: {@link PublicKey} Auto-generated, default fee payer
   *
   * Data:
   * - user: {@link PublicKey} The user to get rewards for
   *
   * @returns {@link SendAndConfirmTxResult}
   */
  const getUserRewardsSendAndConfirm = useCallback(async (
    args: Omit<programClient.GetUserRewardsArgs, "feePayer"> & {
    signers: {
        feePayer: Keypair,
    }}, 
    remainingAccounts: Array<AccountMeta> = []
  ): Promise<SendAndConfirmTxResult> => sendAndConfirmTx(() => programClient.getUserRewardsSendAndConfirm(args, remainingAccounts)), [])


  const getBadge = useCallback(programClient.getBadge, [])
  const getUserBadge = useCallback(programClient.getUserBadge, [])
  const getReward = useCallback(programClient.getReward, [])
  const getUserReward = useCallback(programClient.getUserReward, [])

  const deriveBadge = useCallback(programClient.deriveBadgePDA,[])
  const deriveUserBadge = useCallback(programClient.deriveUserBadgePDA,[])
  const deriveReward = useCallback(programClient.deriveRewardPDA,[])
  const deriveUserReward = useCallback(programClient.deriveUserRewardPDA,[])
  const deriveAccountFromTokenProgram = useCallback(programClient.TokenProgramPDAs.deriveAccountPDA, [])

  return {
	programId,
    initializeBadge,
    initializeBadgeSendAndConfirm,
    updateBadge,
    updateBadgeSendAndConfirm,
    initializeReward,
    initializeRewardSendAndConfirm,
    updateReward,
    updateRewardSendAndConfirm,
    claimReward,
    claimRewardSendAndConfirm,
    getUserBadges,
    getUserBadgesSendAndConfirm,
    getUserRewards,
    getUserRewardsSendAndConfirm,
    getBadge,
    getUserBadge,
    getReward,
    getUserReward,
    deriveBadge,
    deriveUserBadge,
    deriveReward,
    deriveUserReward,
    deriveAccountFromTokenProgram,
  };
};

export { useProgram };