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
            🎁 Rewards ({availableRewards.length + lockedRewards.length})
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
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{badge.name}</h3>
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
            <h2 className="text-3xl font-bold text-white mb-6">Available & Locked Rewards</h2>

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

            {availableRewards.length === 0 && lockedRewards.length === 0 && (
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
          <div className="bg-white rounded-lg max-w-md w-full p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Confirm Claim</h2>
            
            <div className="bg-purple-50 rounded-lg p-6 mb-6">
              <p className="text-slate-600 mb-2">You are about to claim:</p>
              <h3 className="text-2xl font-bold text-purple-600 mb-2">{selectedReward.name}</h3>
              <p className="text-slate-600 mb-4">{selectedReward.description}</p>
              
              <div className="bg-white rounded p-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-slate-700">Type:</span>
                  <span className="text-purple-600 font-bold">{selectedReward.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-700">Value:</span>
                  <span className="text-purple-600 font-bold">{selectedReward.value}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowClaimModal(false)}
                className="flex-1 bg-slate-300 text-slate-900 font-bold py-2 rounded-lg hover:bg-slate-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmClaim}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-2 rounded-lg hover:shadow-lg transition-all"
              >
                Confirm Claim
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && selectedReward && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-8 shadow-2xl text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Reward Claimed!</h2>
            <p className="text-slate-600 mb-4">You have successfully claimed:</p>
            <p className="text-xl font-bold text-purple-600 mb-6">{selectedReward.name}</p>
            <p className="text-sm text-slate-500">Redirecting to your rewards...</p>
          </div>
        </div>
      )}
    </div>
  );
}
