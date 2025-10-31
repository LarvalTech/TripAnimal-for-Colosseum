import { useState, useEffect } from 'react';

export default function PlayerInterface() {
  const [currentTab, setCurrentTab] = useState<'badges' | 'rewards'>('badges');
  const [playerWallet] = useState('4DcDfygFULrgssMf6aqZn4kpVqPd3yXjm3CctgvKADwW');
  const [userBadges, setUserBadges] = useState<any[]>([]);
  const [allRewards, setAllRewards] = useState<any[]>([]);
  const [claimedRewards, setClaimedRewards] = useState<any[]>([]);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState<any>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [stakedRewards, setStakedRewards] = useState<Record<string, {stakedAt: number, minPeriod: number}>>({});
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [selectedRewardToStake, setSelectedRewardToStake] = useState<any>(null);
  const [stakeMinPeriod, setStakeMinPeriod] = useState('3600');
  const [countdownTimers, setCountdownTimers] = useState<{[key: string]: number}>({});

  // Mock data - In production, this would come from smart contracts
  useEffect(() => {
    // Simulate fetching user badges
    setUserBadges([
      {
        id: 'badge_001',
        name: 'Mountain Explorer',
        description: 'Complete the mountain trail quest to earn this badge',
        icon: 'https://via.placeholder.com/128?text=Mountain',
        requiredPoints: 100,
        dateEarned: '2025-10-15',
      },
    ]);

    // Simulate fetching all rewards
    setAllRewards([
      {
        id: 'reward_001',
        name: '10 SOL Token Reward',
        description: 'Visitors who complete the mountain trail earn 10 SOL tokens',
        type: 'Token',
        value: 10,
        badgeId: 'badge_001',
        status: 'available',
      },
      {
        id: 'reward_002',
        name: 'Forest Explorer NFT',
        description: 'Exclusive NFT for completing the forest trail',
        type: 'NFT',
        value: 1,
        badgeId: 'badge_002',
        status: 'locked',
      },
      {
        id: 'reward_003',
        name: 'Eco Warrior Tokens',
        description: 'Earn tokens for sustainable tourism activities',
        type: 'Token',
        value: 50,
        badgeId: 'badge_003',
        status: 'locked',
      },
    ]);

    // Simulate fetching claimed rewards
    setClaimedRewards([]);
  }, []);

  // Countdown timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdownTimers(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(rewardId => {
          updated[rewardId] = Math.max(0, updated[rewardId] - 1);
          if (updated[rewardId] === 0) {
            delete updated[rewardId];
          }
        });
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleClaimReward = (reward: any) => {
    setSelectedReward(reward);
    setShowClaimModal(true);
  };

  const confirmClaim = () => {
    if (selectedReward) {
      setClaimedRewards([...claimedRewards, { ...selectedReward, claimedDate: new Date().toISOString().split('T')[0] }]);
      setShowClaimModal(false);
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        setCurrentTab('rewards');
      }, 2000);
    }
  };

  const handleStakeReward = (reward: any) => {
    setSelectedRewardToStake(reward);
    setShowStakeModal(true);
  };

  const confirmStake = () => {
    if (selectedRewardToStake) {
      const minPeriodSeconds = parseInt(stakeMinPeriod) || 0;
      const stakedAt = Date.now();
      setStakedRewards({
        ...stakedRewards,
        [selectedRewardToStake.id]: {
          stakedAt,
          minPeriod: minPeriodSeconds,
        },
      });
      setCountdownTimers({
        ...countdownTimers,
        [selectedRewardToStake.id]: minPeriodSeconds,
      });
      setShowStakeModal(false);
      setSelectedRewardToStake(null);
      setStakeMinPeriod('3600');
    }
  };

  const handleUnstakeReward = (rewardId: string) => {
    setStakedRewards(prev => {
      const updated = { ...prev };
      delete updated[rewardId];
      return updated;
    });
    setCountdownTimers(prev => {
      const updated = { ...prev };
      delete updated[rewardId];
      return updated;
    });
  };

  const canUnstake = (rewardId: string) => {
    const timer = countdownTimers[rewardId];
    return timer === undefined || timer === 0;
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m ${secs}s`;
  };

  const earnedBadgeIds = userBadges.map(b => b.id);
  const availableRewards = allRewards.filter(r => earnedBadgeIds.includes(r.badgeId));
  const lockedRewards = allRewards.filter(r => !earnedBadgeIds.includes(r.badgeId));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">🎮 TripAnimal Agri - Player Hub</h1>
          <p className="text-emerald-100">Connected Wallet: {playerWallet.slice(0, 8)}...{playerWallet.slice(-8)}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setCurrentTab('badges')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              currentTab === 'badges'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
            }`}
          >
            🏆 My Badges ({userBadges.length})
          </button>
          <button
            onClick={() => setCurrentTab('rewards')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              currentTab === 'rewards'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
            }`}
          >
            🎁 Rewards ({claimedRewards.length + availableRewards.length})
          </button>
        </div>

        {/* Badges Tab */}
        {currentTab === 'badges' && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">My Earned Badges</h2>
            {userBadges.length === 0 ? (
              <div className="bg-slate-700 rounded-lg p-8 text-center text-slate-300">
                <p className="text-lg">No badges earned yet. Complete quests to earn badges!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userBadges.map((badge) => (
                  <div key={badge.id} className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                    {/* Badge Icon */}
                    <div className="bg-gradient-to-br from-emerald-100 to-teal-100 p-6 flex items-center justify-center">
                      <img src={badge.icon} alt={badge.name} className="w-24 h-24 object-cover rounded-lg" />
                    </div>

                    {/* Badge Details */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-black mb-2">{badge.name}</h3>
                      <p className="text-slate-600 text-sm mb-4">{badge.description}</p>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span className="text-slate-600 font-semibold">Required Points:</span>
                          <span className="text-emerald-600 font-bold">{badge.requiredPoints}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600 font-semibold">Date Earned:</span>
                          <span className="text-teal-600 font-bold">{badge.dateEarned}</span>
                        </div>
                      </div>

                      <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold inline-block">
                        ✓ Earned
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Rewards Tab */}
        {currentTab === 'rewards' && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Available & Claimed Rewards</h2>

            {/* Claimed Rewards */}
            {claimedRewards.length > 0 && (
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-blue-400 mb-4">💎 My Claimed Rewards</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {claimedRewards.map((reward) => {
                    const isStaked = stakedRewards[reward.id];
                    const timeRemaining = countdownTimers[reward.id];
                    return (
                      <div key={reward.id} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                        {/* Reward Header */}
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-4 text-white">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-bold">{reward.name}</h3>
                              <span className="inline-block bg-white text-blue-600 px-3 py-1 rounded-full text-xs font-semibold mt-2">
                                {reward.type}
                              </span>
                            </div>
                            <div className="text-3xl font-bold">{reward.value}</div>
                          </div>
                        </div>

                        {/* Reward Details */}
                        <div className="p-6">
                          <p className="text-slate-600 text-sm mb-4">{reward.description}</p>

                          {isStaked ? (
                            <div className="space-y-3">
                              <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg font-semibold text-center">
                                🔒 Staked
                              </div>
                              {timeRemaining && timeRemaining > 0 ? (
                                <div className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-center text-sm">
                                  Can unstake in: <span className="font-bold">{formatTime(timeRemaining)}</span>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleUnstakeReward(reward.id)}
                                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-2 rounded-lg hover:shadow-lg transition-all"
                                >
                                  Unstake Reward
                                </button>
                              )}
                            </div>
                          ) : (
                            <button
                              onClick={() => handleStakeReward(reward)}
                              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-2 rounded-lg hover:shadow-lg transition-all"
                            >
                              Stake Reward
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Available Rewards */}
            {availableRewards.length > 0 && (
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-emerald-400 mb-4">🎁 Available Rewards</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableRewards.map((reward) => {
                    const isClaimed = claimedRewards.some(r => r.id === reward.id);
                    return (
                      <div key={reward.id} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                        {/* Reward Header */}
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-white">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-bold">{reward.name}</h3>
                              <span className="inline-block bg-white text-purple-600 px-3 py-1 rounded-full text-xs font-semibold mt-2">
                                {reward.type}
                              </span>
                            </div>
                            <div className="text-3xl font-bold">{reward.value}</div>
                          </div>
                        </div>

                        {/* Reward Details */}
                        <div className="p-6">
                          <p className="text-slate-600 text-sm mb-4">{reward.description}</p>

                          {isClaimed ? (
                            <div className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg font-semibold text-center">
                              ✓ Claimed
                            </div>
                          ) : (
                            <button
                              onClick={() => handleClaimReward(reward)}
                              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-2 rounded-lg hover:shadow-lg transition-all"
                            >
                              Claim Reward
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Locked Rewards */}
            {lockedRewards.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-slate-400 mb-4">🔒 Locked Rewards</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {lockedRewards.map((reward) => (
                    <div key={reward.id} className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg overflow-hidden shadow-lg opacity-60">
                      {/* Reward Header */}
                      <div className="bg-slate-600 p-4 text-slate-300">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-bold">{reward.name}</h3>
                            <span className="inline-block bg-slate-500 text-slate-200 px-3 py-1 rounded-full text-xs font-semibold mt-2">
                              {reward.type}
                            </span>
                          </div>
                          <div className="text-3xl font-bold">🔒</div>
                        </div>
                      </div>

                      {/* Reward Details */}
                      <div className="p-6">
                        <p className="text-slate-400 text-sm mb-4">{reward.description}</p>
                        <div className="bg-slate-700 text-slate-300 px-4 py-2 rounded-lg font-semibold text-center">
                          Earn Badge to Unlock
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {claimedRewards.length === 0 && availableRewards.length === 0 && lockedRewards.length === 0 && (
              <div className="bg-slate-700 rounded-lg p-8 text-center text-slate-300">
                <p className="text-lg">No rewards available yet.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Claim Reward Modal */}
      {showClaimModal && selectedReward && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-black mb-6">Confirm Claim</h2>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 mb-6 border border-purple-200">
              <p className="text-slate-700 mb-4">
                <span className="font-bold">Reward:</span> {selectedReward.name}
              </p>
              <p className="text-slate-700 mb-4">
                <span className="font-bold">Type:</span> {selectedReward.type}
              </p>
              <p className="text-slate-700">
                <span className="font-bold">Value:</span> {selectedReward.value}
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowClaimModal(false)}
                className="flex-1 px-6 py-3 bg-slate-200 text-black rounded-lg font-semibold hover:bg-slate-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmClaim}
                className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
              >
                Claim
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stake Reward Modal */}
      {showStakeModal && selectedRewardToStake && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-black mb-6">Stake Reward</h2>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 mb-6 border border-blue-200">
              <p className="text-slate-700 mb-4">
                <span className="font-bold">Reward:</span> {selectedRewardToStake.name}
              </p>
              <p className="text-slate-700 mb-4">
                <span className="font-bold">Type:</span> {selectedRewardToStake.type}
              </p>
              <p className="text-slate-700">
                <span className="font-bold">Value:</span> {selectedRewardToStake.value}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-black mb-2">
                Minimum Stake Period (seconds)
              </label>
              <input
                type="number"
                value={stakeMinPeriod}
                onChange={(e) => setStakeMinPeriod(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="e.g., 3600 (1 hour)"
                min="0"
              />
              <p className="text-xs text-slate-500 mt-2">
                Your reward will be locked for this duration. 0 = no minimum.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowStakeModal(false);
                  setSelectedRewardToStake(null);
                }}
                className="flex-1 px-6 py-3 bg-slate-200 text-black rounded-lg font-semibold hover:bg-slate-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmStake}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Stake
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full mx-auto flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-emerald-600">Reward Claimed!</h2>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
