import { useState } from 'react';

interface Badge {
  badgeId: string;
  name: string;
  description: string;
  iconUri: string;
  requiredPoints: string;
  maxEarnings: string;
  isActive: boolean;
}

interface Reward {
  rewardId: string;
  badgeId: string;
  name: string;
  description: string;
  rewardType: string;
  rewardValue: string;
  tokenMint: string;
  nftMint: string;
  isActive: boolean;
  stakeInitially?: boolean;
  minStakePeriod?: string;
  stakeStatus?: string;
  stakedAt?: number;
}

export default function DemoFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  
  const [badgeFormData, setBadgeFormData] = useState({
    badgeId: 'badge_001',
    name: 'Mountain Explorer',
    description: 'Complete the mountain trail quest to earn this badge',
    iconUri: 'https://via.placeholder.com/128?text=Mountain',
    requiredPoints: '100',
    maxEarnings: '5',
    isActive: true,
  });

  const [rewardFormData, setRewardFormData] = useState({
    badgeId: 'badge_001',
    rewardId: 'reward_001',
    name: '10 SOL Token Reward',
    description: 'Visitors who complete the mountain trail earn 10 SOL tokens',
    rewardType: '0',
    rewardValue: '10',
    tokenMint: 'EPjFWaLb3hyccqaoro45VqkfmbTo7nksY62rq7mp5gJ',
    nftMint: '11111111111111111111111111111111',
    isActive: true,
    stakeInitially: true,
    minStakePeriod: '86400',
  });

  const [badges, setBadges] = useState<Badge[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [showBadgeReview, setShowBadgeReview] = useState(false);
  const [showRewardReview, setShowRewardReview] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = [
    { number: 1, title: 'Landing Page', description: 'View the marketing homepage' },
    { number: 2, title: 'Connect Wallet', description: 'Authenticate with Solana wallet' },
    { number: 3, title: 'Create Badge', description: 'Fill in badge details' },
    { number: 4, title: 'Review Badge', description: 'Confirm badge information' },
    { number: 5, title: 'Badge Success', description: 'Badge created successfully' },
    { number: 6, title: 'Create Reward', description: 'Fill in reward details' },
    { number: 7, title: 'Review Reward', description: 'Confirm reward information' },
    { number: 8, title: 'Reward Success', description: 'Reward created successfully' },
  ];

  const handleStepComplete = (stepNumber: number) => {
    if (!completedSteps.includes(stepNumber)) {
      setCompletedSteps([...completedSteps, stepNumber]);
    }
    if (stepNumber < steps.length) {
      setCurrentStep(stepNumber);
    }
  };

  const handleBadgeApprove = () => {
    const newBadge: Badge = {
      badgeId: badgeFormData.badgeId,
      name: badgeFormData.name,
      description: badgeFormData.description,
      iconUri: badgeFormData.iconUri,
      requiredPoints: badgeFormData.requiredPoints,
      maxEarnings: badgeFormData.maxEarnings,
      isActive: badgeFormData.isActive,
    };
    setBadges([...badges, newBadge]);
    handleStepComplete(4);
    setShowBadgeReview(false);
    setTimeout(() => setCurrentStep(5), 500);
  };

  const handleRewardApprove = () => {
    const newReward: Reward = {
      rewardId: rewardFormData.rewardId,
      badgeId: rewardFormData.badgeId,
      name: rewardFormData.name,
      description: rewardFormData.description,
      rewardType: rewardFormData.rewardType,
      rewardValue: rewardFormData.rewardValue,
      tokenMint: rewardFormData.tokenMint,
      nftMint: rewardFormData.nftMint,
      isActive: rewardFormData.isActive,
    };
    setRewards([...rewards, newReward]);
    handleStepComplete(7);
    setShowRewardReview(false);
    setTimeout(() => setCurrentStep(7), 500);
  };

  const handleContinueToBadge = () => {
    handleStepComplete(1);
    setCurrentStep(2);
  };

  const handleBadgeInputChange = (field: string, value: string | boolean) => {
    setBadgeFormData({
      ...badgeFormData,
      [field]: value,
    });
  };

  const handleRewardInputChange = (field: string, value: string | boolean) => {
    setRewardFormData({
      ...rewardFormData,
      [field]: value,
    });
  };

  const handleReset = () => {
    setCurrentStep(0);
    setCompletedSteps([]);
    setShowBadgeReview(false);
    setShowRewardReview(false);
    setShowGallery(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-black bg-opacity-50 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">TripAnimal Agri - Complete Flow Demo</h1>
            <p className="text-slate-400 text-sm mt-1">Step {currentStep + 1} of {steps.length}</p>
          </div>
          <div className="flex gap-3">
            {(badges.length > 0 || rewards.length > 0) && (
              <button
                onClick={() => setShowGallery(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition font-semibold"
              >
                Gallery ({badges.length + rewards.length})
              </button>
            )}
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
            >
              Reset Demo
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition ${
                    completedSteps.includes(step.number)
                      ? 'bg-emerald-500 text-white'
                      : currentStep === index
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {completedSteps.includes(step.number) ? '✓' : step.number}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition ${
                      completedSteps.includes(step.number) ? 'bg-emerald-500' : 'bg-slate-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-white">{steps[currentStep].title}</h2>
            <p className="text-slate-400 text-sm mt-1">{steps[currentStep].description}</p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Step 0: Landing Page */}
        {currentStep === 0 && !showGallery && steps[currentStep] && (
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-12 py-20 text-center">
              <h1 className="text-5xl font-bold text-white mb-6">
                Grow Your Tourism Business with AR & Blockchain
              </h1>
              <p className="text-xl text-emerald-50 mb-8 max-w-2xl mx-auto">
                Engage visitors with interactive AR quests, reward their participation with blockchain-based badges and tokens, and grow your business revenue.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleContinueToBadge}
                  className="px-8 py-4 bg-white text-emerald-600 rounded-lg font-bold text-lg hover:bg-emerald-50 transition"
                >
                  Connect Wallet →
                </button>
                {badges.length > 0 && (
                  <button
                    onClick={() => setShowGallery(true)}
                    className="px-8 py-4 bg-indigo-500 text-white rounded-lg font-bold text-lg hover:bg-indigo-600 transition"
                  >
                    View Gallery →
                  </button>
                )}
              </div>
            </div>
            <div className="px-12 py-12">
              <div className="grid grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-emerald-600 mb-2">9.1M</div>
                  <p className="text-slate-600">Farms Worldwide</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-teal-600 mb-2">20K</div>
                  <p className="text-slate-600">Agri-Tourism Operators</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">46%</div>
                  <p className="text-slate-600">Seeking Revenue Growth</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Gallery View */}
        {showGallery && (
          <div className="space-y-12">
            {/* Close Button */}
            <div className="flex justify-between items-center">
              <h1 className="text-4xl font-bold text-white">Created Badges & Rewards</h1>
              <button
                onClick={() => setShowGallery(false)}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition font-semibold"
              >
                ← Back to Demo
              </button>
            </div>

            {/* Badges Section */}
            {badges.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold text-white mb-8">Badges ({badges.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {badges.map((badge, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:scale-105"
                    >
                      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 flex justify-center">
                        <img
                          src={badge.iconUri}
                          alt={badge.name}
                          className="w-32 h-32 object-cover rounded-lg shadow-md"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/128?text=Badge';
                          }}
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-black mb-2">{badge.name}</h3>
                        <p className="text-slate-600 text-sm mb-4">{badge.description}</p>
                        
                        <div className="space-y-3 border-t border-slate-200 pt-4">
                          <div className="flex justify-between">
                            <span className="text-slate-600 font-semibold">Badge ID:</span>
                            <span className="text-black font-mono text-sm">{badge.badgeId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600 font-semibold">Required Points:</span>
                            <span className="text-emerald-600 font-bold">{badge.requiredPoints}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600 font-semibold">Max Earnings:</span>
                            <span className="text-teal-600 font-bold">{badge.maxEarnings}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600 font-semibold">Status:</span>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              badge.isActive
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {badge.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rewards Section */}
            {rewards.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold text-white mb-8">Rewards ({rewards.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {rewards.map((reward, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:scale-105"
                    >
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-bold text-black">{reward.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            reward.rewardType === '0'
                              ? 'bg-blue-100 text-blue-700'
                              : reward.rewardType === '1'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-slate-100 text-slate-700'
                          }`}>
                            {reward.rewardType === '0' ? 'Token' : reward.rewardType === '1' ? 'NFT' : 'Other'}
                          </span>
                        </div>
                        <p className="text-slate-600 text-sm mb-4">{reward.description}</p>
                      </div>
                      <div className="p-6">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-slate-600 font-semibold">Reward ID:</span>
                            <span className="text-black font-mono text-sm">{reward.rewardId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600 font-semibold">Badge ID:</span>
                            <span className="text-black font-mono text-sm">{reward.badgeId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600 font-semibold">Value:</span>
                            <span className="text-pink-600 font-bold text-lg">{reward.rewardValue}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600 font-semibold">Status:</span>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              reward.isActive
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {reward.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        {reward.rewardType === '0' && (
                          <div className="mt-4 pt-4 border-t border-slate-200">
                            <p className="text-xs text-slate-500 font-mono break-all">
                              Token: {reward.tokenMint}
                            </p>
                          </div>
                        )}
                        {reward.rewardType === '1' && (
                          <div className="mt-4 pt-4 border-t border-slate-200">
                            <p className="text-xs text-slate-500 font-mono break-all">
                              NFT: {reward.nftMint}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {badges.length === 0 && rewards.length === 0 && (
              <div className="bg-white rounded-xl shadow-2xl p-12 text-center">
                <p className="text-slate-600 text-lg">No badges or rewards created yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Step 1: Wallet Connection */}
        {currentStep === 1 && !showGallery && steps[currentStep] && (
          <div className="bg-white rounded-xl shadow-2xl p-12 text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mx-auto flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.5 1.5H3.75A2.25 2.25 0 001.5 3.75v12.5A2.25 2.25 0 003.75 18.5h12.5a2.25 2.25 0 002.25-2.25V9.5m-15-4h12m-12 3h12m-12 3h6" stroke="currentColor" strokeWidth="1.5" fill="none" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-black mb-4">Connect Your Wallet</h2>
              <p className="text-slate-600 text-lg mb-8">
                Connect your Solana wallet to start managing badges and rewards for your business.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <p className="text-slate-700 font-mono text-sm">
                  Connected Wallet: DtzZhcYa...YpZPajt9
                </p>
              </div>
              <button
                onClick={() => {
                  handleStepComplete(1);
                  setCurrentStep(2);
                }}
                className="px-8 py-4 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700 transition"
              >
                Continue to Dashboard →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Create Badge Form */}
        {currentStep === 2 && !showGallery && steps[currentStep] && (
          <div className="bg-white rounded-xl shadow-2xl p-12">
            <h2 className="text-3xl font-bold text-black mb-8">Create New Badge</h2>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Badge ID *</label>
                <input
                  type="text"
                  value={badgeFormData.badgeId}
                  onChange={(e) => handleBadgeInputChange('badgeId', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                  placeholder="e.g., badge_001"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Badge Name *</label>
                <input
                  type="text"
                  value={badgeFormData.name}
                  onChange={(e) => handleBadgeInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                  placeholder="e.g., Mountain Explorer"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-black mb-2">Description *</label>
                <textarea
                  value={badgeFormData.description}
                  onChange={(e) => handleBadgeInputChange('description', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 h-24 text-black"
                  placeholder="Describe what visitors need to do to earn this badge"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-black mb-2">Icon URL *</label>
                <input
                  type="text"
                  value={badgeFormData.iconUri}
                  onChange={(e) => handleBadgeInputChange('iconUri', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-black"
                  placeholder="https://example.com/badge-icon.png"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Required Points *</label>
                <input
                  type="number"
                  value={badgeFormData.requiredPoints}
                  onChange={(e) => handleBadgeInputChange('requiredPoints', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                  placeholder="e.g., 100"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Max Earnings *</label>
                <input
                  type="number"
                  value={badgeFormData.maxEarnings}
                  onChange={(e) => handleBadgeInputChange('maxEarnings', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                  placeholder="e.g., 5"
                />
              </div>
              <div className="col-span-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={badgeFormData.isActive}
                    onChange={(e) => handleBadgeInputChange('isActive', e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span className="ml-3 text-sm font-medium text-black">Make this badge active immediately</span>
                </label>
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => {
                  setShowBadgeReview(true);
                  handleStepComplete(2);
                }}
                className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition"
              >
                Review Badge →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Badge Review Modal */}
        {currentStep === 3 && !showBadgeReview && !showGallery && steps[currentStep] && (
          <div className="bg-white rounded-xl shadow-2xl p-12 text-center">
            <p className="text-slate-600 mb-4">Click the button below to see the review modal</p>
            <button
              onClick={() => setShowBadgeReview(true)}
              className="px-8 py-4 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition"
            >
              Show Review Modal
            </button>
          </div>
        )}

        {/* Step 4: Badge Success */}
        {currentStep === 4 && !showGallery && steps[currentStep] && (
          <div className="bg-white rounded-xl shadow-2xl p-12 text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-emerald-100 rounded-full mx-auto flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-emerald-600 mb-4">Badge Created Successfully!</h2>
              <p className="text-slate-600 text-lg mb-8">
                Your badge "{badgeFormData.name}" has been created and is ready for visitors to earn.
              </p>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 mb-8">
                <p className="text-slate-700 font-mono text-sm">Badge ID: {badgeFormData.badgeId}</p>
              </div>
              <button
                onClick={() => {
                  handleStepComplete(4);
                  setCurrentStep(5);
                }}
                className="px-8 py-4 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700 transition"
              >
                Continue to Create Reward →
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Create Reward Form */}
        {currentStep === 5 && !showGallery && steps[currentStep] && (
          <div className="bg-white rounded-xl shadow-2xl p-12">
            <h2 className="text-3xl font-bold text-black mb-8">Create New Reward</h2>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Badge ID *</label>
                <input
                  type="text"
                  value={rewardFormData.badgeId}
                  onChange={(e) => handleRewardInputChange('badgeId', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                  placeholder="e.g., badge_001"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Reward ID *</label>
                <input
                  type="text"
                  value={rewardFormData.rewardId}
                  onChange={(e) => handleRewardInputChange('rewardId', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                  placeholder="e.g., reward_001"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Reward Name *</label>
                <input
                  type="text"
                  value={rewardFormData.name}
                  onChange={(e) => handleRewardInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                  placeholder="e.g., 10 SOL Token"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Reward Type *</label>
                <select
                  value={rewardFormData.rewardType}
                  onChange={(e) => handleRewardInputChange('rewardType', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                >
                  <option value="0">Token</option>
                  <option value="1">NFT</option>
                  <option value="2">Other</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-black mb-2">Description *</label>
                <textarea
                  value={rewardFormData.description}
                  onChange={(e) => handleRewardInputChange('description', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 h-24 text-black"
                  placeholder="Describe what the visitor receives"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Reward Value *</label>
                <input
                  type="number"
                  value={rewardFormData.rewardValue}
                  onChange={(e) => handleRewardInputChange('rewardValue', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                  placeholder="e.g., 10"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Token Mint *</label>
                <input
                  type="text"
                  value={rewardFormData.tokenMint}
                  onChange={(e) => handleRewardInputChange('tokenMint', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs text-black"
                  placeholder="Solana token mint address"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-black mb-2">NFT Mint *</label>
                <input
                  type="text"
                  value={rewardFormData.nftMint}
                  onChange={(e) => handleRewardInputChange('nftMint', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs text-black"
                  placeholder="Solana NFT mint address"
                />
              </div>
              <div className="col-span-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rewardFormData.isActive}
                    onChange={(e) => handleRewardInputChange('isActive', e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="ml-3 text-sm font-medium text-black">Make this reward active immediately</span>
                </label>
              </div>
            </div>

            {/* Staking Section */}
            <div className="border-t-2 border-slate-300 pt-6 mt-6">
              <h3 className="text-lg font-bold text-black mb-4">Reward Staking (Optional)</h3>
              <div className="grid grid-cols-2 gap-8">
                <div className="col-span-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={rewardFormData.stakeInitially || false}
                      onChange={(e) => handleRewardInputChange('stakeInitially', e.target.checked)}
                      className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <span className="ml-3 text-sm font-medium text-black">Stake this reward initially</span>
                  </label>
                  <p className="text-xs text-slate-500 mt-2">
                    If checked, the reward will be created in a staked (locked) state. You must unstake it before visitors can claim it.
                  </p>
                </div>

                {rewardFormData.stakeInitially && (
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-black mb-2">Minimum Stake Period (seconds)</label>
                    <input
                      type="number"
                      value={rewardFormData.minStakePeriod || '0'}
                      onChange={(e) => handleRewardInputChange('minStakePeriod', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                      placeholder="e.g., 86400 (1 day) or 0 (no minimum)"
                      min="0"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      How long the reward must remain staked before you can unstake it. 0 = no minimum.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => {
                  setShowRewardReview(true);
                  handleStepComplete(5);
                }}
                className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
              >
                Review Reward →
              </button>
            </div>
          </div>
        )}

        {/* Step 6: Reward Review Modal */}
        {currentStep === 6 && !showRewardReview && !showGallery && steps[currentStep] && (
          <div className="bg-white rounded-xl shadow-2xl p-12 text-center">
            <p className="text-slate-600 mb-4">Click the button below to see the review modal</p>
            <button
              onClick={() => setShowRewardReview(true)}
              className="px-8 py-4 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition"
            >
              Show Review Modal
            </button>
          </div>
        )}

        {/* Step 7: Reward Success */}
        {currentStep === 7 && !showGallery && (
          <div className="bg-white rounded-xl shadow-2xl p-12 text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-purple-100 rounded-full mx-auto flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-purple-600 mb-4">Reward Created Successfully!</h2>
              <p className="text-slate-600 text-lg mb-8">
                Your reward "{rewardFormData.name}" has been created and is ready to be claimed by visitors.
              </p>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
                <p className="text-slate-700 font-mono text-sm">Reward ID: {rewardFormData.rewardId}</p>
              </div>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => {
                    setCurrentStep(0);
                    setCompletedSteps([]);
                  }}
                  className="px-8 py-4 bg-slate-600 text-white rounded-lg font-bold text-lg hover:bg-slate-700 transition"
                >
                  Start Over
                </button>
                <button
                  onClick={() => setShowGallery(true)}
                  className="px-8 py-4 bg-indigo-600 text-white rounded-lg font-bold text-lg hover:bg-indigo-700 transition"
                >
                  View Gallery
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Badge Review Modal */}
      {showBadgeReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-black mb-6">Review Your Badge</h2>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-6 mb-6 border border-emerald-200">
              <div className="flex justify-center mb-6">
                <img
                  src={badgeFormData.iconUri}
                  alt={badgeFormData.name}
                  className="w-32 h-32 object-cover rounded-lg shadow-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/128?text=Badge';
                  }}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Badge Name</p>
                  <p className="text-xl font-bold text-black">{badgeFormData.name}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Badge ID</p>
                  <p className="text-sm text-slate-700 font-mono">{badgeFormData.badgeId}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Description</p>
                  <p className="text-sm text-slate-700">{badgeFormData.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-emerald-200">
                  <div>
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Required Points</p>
                    <p className="text-lg font-bold text-emerald-600">{badgeFormData.requiredPoints}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Max Earnings</p>
                    <p className="text-lg font-bold text-teal-600">{badgeFormData.maxEarnings}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-emerald-200">
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Status</p>
                  <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-700">
                    {badgeFormData.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleBadgeApprove}
                className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition"
              >
                Approve Badge
              </button>
              <button
                onClick={() => setShowBadgeReview(false)}
                className="flex-1 px-6 py-3 bg-slate-200 text-black rounded-lg font-semibold hover:bg-slate-300 transition"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reward Review Modal */}
      {showRewardReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-black mb-6">Review Your Reward</h2>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 mb-6 border border-purple-200">
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Reward Name</p>
                  <p className="text-xl font-bold text-black">{rewardFormData.name}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Reward ID</p>
                  <p className="text-sm text-slate-700 font-mono">{rewardFormData.rewardId}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Description</p>
                  <p className="text-sm text-slate-700">{rewardFormData.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-purple-200">
                  <div>
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Reward Type</p>
                    <p className="text-sm font-bold text-purple-600">
                      {rewardFormData.rewardType === '0' ? 'Token' : rewardFormData.rewardType === '1' ? 'NFT' : 'Other'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Reward Value</p>
                    <p className="text-lg font-bold text-pink-600">{rewardFormData.rewardValue}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Badge ID</p>
                  <p className="text-sm text-slate-700 font-mono">{rewardFormData.badgeId}</p>
                </div>

                <div className="pt-4 border-t border-purple-200">
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Status</p>
                  <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-700">
                    {rewardFormData.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleRewardApprove}
                className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
              >
                Approve Reward
              </button>
              <button
                onClick={() => setShowRewardReview(false)}
                className="flex-1 px-6 py-3 bg-slate-200 text-black rounded-lg font-semibold hover:bg-slate-300 transition"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
