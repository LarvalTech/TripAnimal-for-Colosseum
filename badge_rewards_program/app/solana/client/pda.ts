import {PublicKey} from "@solana/web3.js";
import BN from "bn.js";

export type BadgeSeeds = {
    owner: PublicKey, 
    badgeId: bigint, 
};

export const deriveBadgePDA = (
    seeds: BadgeSeeds,
    programId: PublicKey
): [PublicKey, number] => {
    // Validate inputs to prevent null/undefined errors
    if (seeds === null || seeds === undefined) {
        throw new Error("Invalid seeds provided to deriveBadgePDA: seeds is null/undefined");
    }
    if (seeds.owner === null || seeds.owner === undefined) {
        throw new Error("Invalid seeds provided to deriveBadgePDA: owner is null/undefined");
    }
    if (seeds.badgeId === null || seeds.badgeId === undefined) {
        throw new Error("Invalid seeds provided to deriveBadgePDA: badgeId is null/undefined");
    }
    // Check if badgeId is a valid bigint
    if (typeof seeds.badgeId !== 'bigint') {
        // Try to convert to bigint if it's a number or string
        if (typeof seeds.badgeId === 'number') {
            seeds.badgeId = BigInt(seeds.badgeId);
        } else if (typeof seeds.badgeId === 'string') {
            seeds.badgeId = BigInt(seeds.badgeId);
        } else {
            throw new Error("Invalid seeds provided to deriveBadgePDA: badgeId is not a bigint or convertible type");
        }
    }
    
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("badge"),
            seeds.owner.toBuffer(),
            Buffer.from(new BN(seeds.badgeId.toString()).toArray("le", 8)),
        ],
        programId,
    )
};

export type UserBadgeSeeds = {
    user: PublicKey, 
    badgeId: bigint, 
};

export const deriveUserBadgePDA = (
    seeds: UserBadgeSeeds,
    programId: PublicKey
): [PublicKey, number] => {
    // Validate inputs to prevent null/undefined errors
    if (seeds === null || seeds === undefined) {
        throw new Error("Invalid seeds provided to deriveUserBadgePDA: seeds is null/undefined");
    }
    if (seeds.user === null || seeds.user === undefined) {
        throw new Error("Invalid seeds provided to deriveUserBadgePDA: user is null/undefined");
    }
    if (seeds.badgeId === null || seeds.badgeId === undefined) {
        throw new Error("Invalid seeds provided to deriveUserBadgePDA: badgeId is null/undefined");
    }
    // Check if badgeId is a valid bigint
    if (typeof seeds.badgeId !== 'bigint') {
        // Try to convert to bigint if it's a number or string
        if (typeof seeds.badgeId === 'number') {
            seeds.badgeId = BigInt(seeds.badgeId);
        } else if (typeof seeds.badgeId === 'string') {
            seeds.badgeId = BigInt(seeds.badgeId);
        } else {
            throw new Error("Invalid seeds provided to deriveUserBadgePDA: badgeId is not a bigint or convertible type");
        }
    }
    
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("user_badge"),
            seeds.user.toBuffer(),
            Buffer.from(new BN(seeds.badgeId.toString()).toArray("le", 8)),
        ],
        programId,
    )
};

export type RewardSeeds = {
    owner: PublicKey,
    badgeId: bigint, 
    rewardId: bigint, 
};

export const deriveRewardPDA = (
    seeds: RewardSeeds,
    programId: PublicKey
): [PublicKey, number] => {
    // Validate inputs to prevent null/undefined errors
    if (seeds === null || seeds === undefined) {
        throw new Error("Invalid seeds provided to deriveRewardPDA: seeds is null/undefined");
    }
    if (seeds.owner === null || seeds.owner === undefined) {
        throw new Error("Invalid seeds provided to deriveRewardPDA: owner is null/undefined");
    }
    if (seeds.badgeId === null || seeds.badgeId === undefined) {
        throw new Error("Invalid seeds provided to deriveRewardPDA: badgeId is null/undefined");
    }
    if (seeds.rewardId === null || seeds.rewardId === undefined) {
        throw new Error("Invalid seeds provided to deriveRewardPDA: rewardId is null/undefined");
    }
    // Check if badgeId and rewardId are valid bigints
    if (typeof seeds.badgeId !== 'bigint') {
        // Try to convert to bigint if it's a number or string
        if (typeof seeds.badgeId === 'number') {
            seeds.badgeId = BigInt(seeds.badgeId);
        } else if (typeof seeds.badgeId === 'string') {
            seeds.badgeId = BigInt(seeds.badgeId);
        } else {
            throw new Error("Invalid seeds provided to deriveRewardPDA: badgeId is not a bigint or convertible type");
        }
    }
    if (typeof seeds.rewardId !== 'bigint') {
        // Try to convert to bigint if it's a number or string
        if (typeof seeds.rewardId === 'number') {
            seeds.rewardId = BigInt(seeds.rewardId);
        } else if (typeof seeds.rewardId === 'string') {
            seeds.rewardId = BigInt(seeds.rewardId);
        } else {
            throw new Error("Invalid seeds provided to deriveRewardPDA: rewardId is not a bigint or convertible type");
        }
    }
    
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("reward"),
            seeds.owner.toBuffer(),
            Buffer.from(new BN(seeds.badgeId.toString()).toArray("le", 8)),
            Buffer.from(new BN(seeds.rewardId.toString()).toArray("le", 8)),
        ],
        programId,
    )
};

export type UserRewardSeeds = {
    user: PublicKey, 
    rewardId: bigint, 
};

export const deriveUserRewardPDA = (
    seeds: UserRewardSeeds,
    programId: PublicKey
): [PublicKey, number] => {
    // Validate inputs to prevent null/undefined errors
    if (seeds === null || seeds === undefined) {
        throw new Error("Invalid seeds provided to deriveUserRewardPDA: seeds is null/undefined");
    }
    if (seeds.user === null || seeds.user === undefined) {
        throw new Error("Invalid seeds provided to deriveUserRewardPDA: user is null/undefined");
    }
    if (seeds.rewardId === null || seeds.rewardId === undefined) {
        throw new Error("Invalid seeds provided to deriveUserRewardPDA: rewardId is null/undefined");
    }
    // Check if rewardId is a valid bigint
    if (typeof seeds.rewardId !== 'bigint') {
        // Try to convert to bigint if it's a number or string
        if (typeof seeds.rewardId === 'number') {
            seeds.rewardId = BigInt(seeds.rewardId);
        } else if (typeof seeds.rewardId === 'string') {
            seeds.rewardId = BigInt(seeds.rewardId);
        } else {
            throw new Error("Invalid seeds provided to deriveUserRewardPDA: rewardId is not a bigint or convertible type");
        }
    }
    
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("user_reward"),
            seeds.user.toBuffer(),
            Buffer.from(new BN(seeds.rewardId.toString()).toArray("le", 8)),
        ],
        programId,
    )
};

export module TokenProgramPDAs {
    export type AccountSeeds = {
        wallet: PublicKey, 
        tokenProgram: PublicKey, 
        mint: PublicKey, 
    };
    
    export const deriveAccountPDA = (
        seeds: AccountSeeds,
        programId: PublicKey
    ): [PublicKey, number] => {
        // Validate inputs to prevent null/undefined errors
        if (seeds === null || seeds === undefined) {
            throw new Error("Invalid seeds provided to deriveAccountPDA: seeds is null/undefined");
        }
        if (seeds.wallet === null || seeds.wallet === undefined) {
            throw new Error("Invalid seeds provided to deriveAccountPDA: wallet is null/undefined");
        }
        if (seeds.tokenProgram === null || seeds.tokenProgram === undefined) {
            throw new Error("Invalid seeds provided to deriveAccountPDA: tokenProgram is null/undefined");
        }
        if (seeds.mint === null || seeds.mint === undefined) {
            throw new Error("Invalid seeds provided to deriveAccountPDA: mint is null/undefined");
        }
        
        return PublicKey.findProgramAddressSync(
            [
                seeds.wallet.toBuffer(),
                seeds.tokenProgram.toBuffer(),
                seeds.mint.toBuffer(),
            ],
            programId,
        )
    };
    
}