import type { Route } from "./+types/app";
import { useWallet } from "@solana/wallet-adapter-react";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { Header } from "~/components/Header";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "TripAnimal Agri - Dashboard" },
    {
      name: "description",
      content: "Manage your AR quests, badges, and rewards.",
    },
  ];
}

const ADMIN_FEE_PAYER = "DqfUz313SoP7Xuu2GdnNx1Mnsvp21ChdbZ8wYMmnCU32";
const DEFAULT_BUSINESS_WALLET = "6gQwSq4jKSNHWtGFYvqxVC6v1HpjiTXhPPFQzZSZn5WD";

interface BadgeFormData {
  badgeId: string;
  name: string;
  description: string;
  iconUri: string;
  requiredPoints: string;
  maxEarnings: string;
  isActive: boolean;
}

interface RewardFormData {
  badgeId: string;
  rewardId: string;
  name: string;
  description: string;
  rewardType: string;
  rewardValue: string;
  tokenMint: string;
  nftMint: string;
  isActive: boolean;
  stakeInitially: boolean;
  minStakePeriod: string;
}

export default function Dashboard() {
  const { publicKey, connected } = useWallet();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"badges" | "rewards">("badges");
  const [activeForm, setActiveForm] = useState<
    "initialize" | "update" | null
  >(null);
  const [badgeFormData, setBadgeFormData] = useState<BadgeFormData>({
    badgeId: "",
    name: "",
    description: "",
    iconUri: "",
    requiredPoints: "",
    maxEarnings: "",
    isActive: false,
  });
  const [showBadgePreview, setShowBadgePreview] = useState(false);
  const [rewardFormData, setRewardFormData] = useState<RewardFormData>({
    badgeId: "",
    rewardId: "",
    name: "",
    description: "",
    rewardType: "0",
    rewardValue: "",
    tokenMint: "",
    nftMint: "",
    isActive: false,
    stakeInitially: false,
    minStakePeriod: "0",
  });
  const [showRewardPreview, setShowRewardPreview] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [createdBadges, setCreatedBadges] = useState<any[]>([]);
  const [createdRewards, setCreatedRewards] = useState<any[]>([]);

  // Redirect if not connected
  if (!connected || !publicKey) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="container mx-auto px-5 py-20 text-center">
          <h1 className="text-3xl font-bold text-black mb-4">
            Please Connect Your Wallet
          </h1>
          <p className="text-slate-600 mb-8">
            You need to connect your Solana wallet to access the dashboard.
          </p>
          <Link
            to="/"
            className="inline-block px-8 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const handleBadgePreview = (e: React.FormEvent) => {
    e.preventDefault();
    setShowBadgePreview(true);
  };

  const handleBadgeApprove = () => {
    // TODO: Call initializeBadge smart contract function
    console.log("Badge approved:", badgeFormData);
    setCreatedBadges([...createdBadges, badgeFormData]);
    setShowBadgePreview(false);
    setActiveForm(null);
    setBadgeFormData({
      badgeId: "",
      name: "",
      description: "",
      iconUri: "",
      requiredPoints: "",
      maxEarnings: "",
      isActive: false,
    });
  };

  const handleRewardPreview = (e: React.FormEvent) => {
    e.preventDefault();
    setShowRewardPreview(true);
  };

  const handleRewardApprove = () => {
    // TODO: Call initializeReward smart contract function
    console.log("Reward approved:", rewardFormData);
    setCreatedRewards([...createdRewards, rewardFormData]);
    setShowRewardPreview(false);
    setActiveForm(null);
    setRewardFormData({
      badgeId: "",
      rewardId: "",
      name: "",
      description: "",
      rewardType: "0",
      rewardValue: "",
      tokenMint: "",
      nftMint: "",
      isActive: false,
    });
  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-5 py-12">
          {/* Dashboard Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-black mb-2">
              Dashboard
            </h1>
            <p className="text-slate-600">
              Manage your AR quests, badges, and rewards
            </p>
            <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <p className="text-sm text-slate-600">
                <span className="font-semibold">Connected Business Wallet:</span>{" "}
                {DEFAULT_BUSINESS_WALLET.substring(0, 8)}...
                {DEFAULT_BUSINESS_WALLET.substring(DEFAULT_BUSINESS_WALLET.length - 8)}
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-4 mb-8 border-b border-slate-200 items-center justify-between"><div className="flex gap-4">
            <button
              onClick={() => {
                setActiveTab("badges");
                setActiveForm(null);
              }}
              className={`px-6 py-3 font-semibold transition ${
                activeTab === "badges"
                  ? "text-emerald-600 border-b-2 border-emerald-600"
                  : "text-slate-600 hover:text-black"
              }`}
            >
              Manage Badges
            </button>
            <button
              onClick={() => {
                setActiveTab("rewards");
                setActiveForm(null);
              }}
              className={`px-6 py-3 font-semibold transition ${
                activeTab === "rewards"
                  ? "text-emerald-600 border-b-2 border-emerald-600"
                  : "text-slate-600 hover:text-black"
              }`}
            >
              Manage Rewards
            </button>
          </div>
            </div>
            {(createdBadges.length > 0 || createdRewards.length > 0) && (
              <button
                onClick={() => setShowGallery(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition font-semibold"
              >
                Gallery ({createdBadges.length + createdRewards.length})
              </button>
            )}

          {/* Badges Tab */}
          {activeTab === "badges" && (
            <div>
              {activeForm === null ? (
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Initialize Badge Card */}
                  <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition">
                    <div className="flex items-center justify-center w-14 h-14 bg-emerald-600 text-white rounded-lg mb-6">
                      <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-black mb-3">
                      Create New Badge
                    </h3>
                    <p className="text-slate-600 mb-6">
                      Set up a new badge that visitors can earn at your
                      location.
                    </p>
                    <button
                      onClick={() => setActiveForm("initialize")}
                      className="w-full px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition"
                    >
                      Create Badge
                    </button>
                  </div>

                  {/* Update Badge Card */}
                  <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition">
                    <div className="flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-lg mb-6">
                      <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-black mb-3">
                      Update Badge
                    </h3>
                    <p className="text-slate-600 mb-6">
                      Modify an existing badge's details, requirements, or
                      settings.
                    </p>
                    <button
                      onClick={() => setActiveForm("update")}
                      className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                      Update Badge
                    </button>
                  </div>
                </div>
              ) : activeForm === "initialize" ? (
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <div className="flex items-center mb-6">
                    <button
                      onClick={() => setActiveForm(null)}
                      className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-2"
                    >
                      <span>← Back</span>
                    </button>
                  </div>
                  <h2 className="text-2xl font-bold text-black mb-6">
                    Create New Badge
                  </h2>

                  <form onSubmit={handleBadgePreview} className="space-y-6">
                    {/* Owner Field */}
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        Owner (Your Wallet)
                      </label>
                      <input
                        type="text"
                        disabled
                        value={publicKey.toString()}
                        className="w-full px-4 py-3 bg-slate-100 border border-slate-300 rounded-lg text-slate-600 cursor-not-allowed"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Auto-filled with your connected wallet
                      </p>
                    </div>

                    {/* Badge ID */}
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        Badge ID *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., badge_001"
                        value={badgeFormData.badgeId}
                        onChange={(e) =>
                          setBadgeFormData({
                            ...badgeFormData,
                            badgeId: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black bg-white"
                        required
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Must be unique across all badges
                      </p>
                    </div>

                    {/* Badge Name */}
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        Badge Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Mountain Explorer"
                        value={badgeFormData.name}
                        onChange={(e) =>
                          setBadgeFormData({
                            ...badgeFormData,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black bg-white"
                        required
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        Description *
                      </label>
                      <textarea
                        placeholder="Describe what visitors need to do to earn this badge"
                        value={badgeFormData.description}
                        onChange={(e) =>
                          setBadgeFormData({
                            ...badgeFormData,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none text-black"
                        rows={4}
                        required
                      />
                    </div>

                    {/* Icon URL */}
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        Icon URL *
                      </label>
                      <input
                        type="url"
                        placeholder="https://example.com/badge-icon.png"
                        value={badgeFormData.iconUri}
                        onChange={(e) =>
                          setBadgeFormData({
                            ...badgeFormData,
                            iconUri: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black bg-white"
                        required
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        URL to the badge icon image
                      </p>
                    </div>

                    {/* Required Points */}
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        Required Points *
                      </label>
                      <input
                        type="number"
                        placeholder="e.g., 100"
                        value={badgeFormData.requiredPoints}
                        onChange={(e) =>
                          setBadgeFormData({
                            ...badgeFormData,
                            requiredPoints: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black bg-white"
                        required
                      />
                    </div>

                    {/* Max Earnings */}
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        Max Earnings *
                      </label>
                      <input
                        type="number"
                        placeholder="e.g., 5"
                        value={badgeFormData.maxEarnings}
                        onChange={(e) =>
                          setBadgeFormData({
                            ...badgeFormData,
                            maxEarnings: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black bg-white"
                        required
                      />
                    </div>

                    {/* Active Status */}
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={badgeFormData.isActive}
                        onChange={(e) =>
                          setBadgeFormData({
                            ...badgeFormData,
                            isActive: e.target.checked,
                          })
                        }
                        className="w-5 h-5 rounded border-slate-300"
                      />
                      <label
                        htmlFor="isActive"
                        className="text-sm font-semibold text-black"
                      >
                        Make this badge active immediately
                      </label>
                    </div>
                    <p className="text-xs text-slate-500">
                      Inactive badges cannot be earned by visitors
                    </p>

                    {/* Submit Button */}
                    <div className="flex gap-4 pt-6">
                      <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition"
                      >
                        Review Badge
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveForm(null)}
                        className="flex-1 px-6 py-3 bg-slate-200 text-black rounded-lg font-semibold hover:bg-slate-300 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <div className="flex items-center mb-6">
                    <button
                      onClick={() => setActiveForm(null)}
                      className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
                    >
                      <span>← Back</span>
                    </button>
                  </div>
                  <h2 className="text-2xl font-bold text-black mb-6">
                    Update Badge
                  </h2>

                  <form onSubmit={handleBadgePreview} className="space-y-6">
                    {/* Owner Field */}
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        Owner (Your Wallet)
                      </label>
                      <input
                        type="text"
                        disabled
                        value={publicKey.toString()}
                        className="w-full px-4 py-3 bg-slate-100 border border-slate-300 rounded-lg text-slate-600 cursor-not-allowed"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Auto-filled with your connected wallet
                      </p>
                    </div>

                    {/* Badge ID */}
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        Badge ID *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., badge_001"
                        value={badgeFormData.badgeId}
                        onChange={(e) =>
                          setBadgeFormData({
                            ...badgeFormData,
                            badgeId: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        required
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Must be unique across all badges
                      </p>
                    </div>

                    {/* Badge Name */}
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        Badge Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Mountain Explorer"
                        value={badgeFormData.name}
                        onChange={(e) =>
                          setBadgeFormData({
                            ...badgeFormData,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        required
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        Description *
                      </label>
                      <textarea
                        placeholder="Describe what visitors need to do to earn this badge"
                        value={badgeFormData.description}
                        onChange={(e) =>
                          setBadgeFormData({
                            ...badgeFormData,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-black"
                        rows={4}
                        required
                      />
                    </div>

                    {/* Icon URL */}
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        Icon URL *
                      </label>
                      <input
                        type="url"
                        placeholder="https://example.com/badge-icon.png"
                        value={badgeFormData.iconUri}
                        onChange={(e) =>
                          setBadgeFormData({
                            ...badgeFormData,
                            iconUri: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        required
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        URL to the badge icon image
                      </p>
                    </div>

                    {/* Required Points */}
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        Required Points *
                      </label>
                      <input
                        type="number"
                        placeholder="e.g., 100"
                        value={badgeFormData.requiredPoints}
                        onChange={(e) =>
                          setBadgeFormData({
                            ...badgeFormData,
                            requiredPoints: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        required
                      />
                    </div>

                    {/* Max Earnings */}
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        Max Earnings *
                      </label>
                      <input
                        type="number"
                        placeholder="e.g., 5"
                        value={badgeFormData.maxEarnings}
                        onChange={(e) =>
                          setBadgeFormData({
                            ...badgeFormData,
                            maxEarnings: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        required
                      />
                    </div>

                    {/* Active Status */}
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={badgeFormData.isActive}
                        onChange={(e) =>
                          setBadgeFormData({
                            ...badgeFormData,
                            isActive: e.target.checked,
                          })
                        }
                        className="w-5 h-5 rounded border-slate-300"
                      />
                      <label
                        htmlFor="isActive"
                        className="text-sm font-semibold text-black"
                      >
                        Make this badge active immediately
                      </label>
                    </div>
                    <p className="text-xs text-slate-500">
                      Inactive badges cannot be earned by visitors
                    </p>

                    {/* Submit Button */}
                    <div className="flex gap-4 pt-6">
                      <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                      >
                        Review Badge
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveForm(null)}
                        className="flex-1 px-6 py-3 bg-slate-200 text-black rounded-lg font-semibold hover:bg-slate-300 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* Rewards Tab */}
          {activeTab === "rewards" && (
            <div>
              {activeForm === null ? (
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Initialize Reward Card */}
                  <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition">
                    <div className="flex items-center justify-center w-14 h-14 bg-purple-600 text-white rounded-lg mb-6">
                      <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-black mb-3">
                      Create New Reward
                    </h3>
                    <p className="text-slate-600 mb-6">
                      Set up a new reward that visitors can claim after earning
                      badges.
                    </p>
                    <button
                      onClick={() => setActiveForm("initialize")}
                      className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
                    >
                      Create Reward
                    </button>
                  </div>

                  {/* Update Reward Card */}
                  <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition">
                    <div className="flex items-center justify-center w-14 h-14 bg-pink-600 text-white rounded-lg mb-6">
                      <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-black mb-3">
                      Update Reward
                    </h3>
                    <p className="text-slate-600 mb-6">
                      Modify an existing reward's details, value, or
                      availability.
                    </p>
                    <button
                      onClick={() => setActiveForm("update")}
                      className="w-full px-6 py-3 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 transition"
                    >
                      Update Reward
                    </button>
                  </div>
                </div>
              ) : activeForm === "initialize" ? (
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <div className="flex items-center mb-6">
                    <button
                      onClick={() => setActiveForm(null)}
                      className="text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-2"
                    >
                      <span>← Back</span>
                    </button>
                  </div>
                  <h2 className="text-2xl font-bold text-black mb-6">
                    Create New Reward
                  </h2>

                  <form onSubmit={handleRewardPreview} className="space-y-6">
                    {/* Owner Field */}
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        Owner (Your Wallet)
                      </label>
                      <input
                        type="text"
                        disabled
                        value={publicKey.toString()}
                        className="w-full px-4 py-3 bg-slate-100 border border-slate-300 rounded-lg text-slate-600 cursor-not-allowed"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Auto-filled with your connected wallet
                      </p>
                    </div>

                    {/* Badge ID */}
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        Badge ID *
                      </label>
                      <input
                        type="text"
                        placeholder="ID of the badge this reward is for"
                        value={rewardFormData.badgeId}
                        onChange={(e) =>
                          setRewardFormData({
                            ...rewardFormData,
                            badgeId: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                        required
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        The badge that visitors must earn to claim this reward
                      </p>
                    </div>

                    {/* Reward ID */}
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        Reward ID *
                      </label>
                      <input
                        type="text"
                        placeholder="Unique identifier for this reward"
                        value={rewardFormData.rewardId}
                        onChange={(e) =>
                          setRewardFormData({
                            ...rewardFormData,
                            rewardId: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                        required
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Must be unique across all rewards
                      </p>
                    </div>

                    {/* Reward Name */}
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        Reward Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., 10 SOL Token"
                        value={rewardFormData.name}
                        onChange={(e) =>
                          setRewardFormData({
                            ...rewardFormData,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                        required
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        Description *
                      </label>
                      <textarea
                        placeholder="Describe what the visitor receives"
                        value={rewardFormData.description}
                        onChange={(e) =>
                          setRewardFormData({
                            ...rewardFormData,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-black"
                        rows={4}
                        required
                      />
                    </div>

                    {/* Reward Type */}
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        Reward Type *
                      </label>
                      <select
                        value={rewardFormData.rewardType}
                        onChange={(e) =>
                          setRewardFormData({
                            ...rewardFormData,
                            rewardType: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                        required
                      >
                        <option value="0">Token</option>
                        <option value="1">NFT</option>
                        <option value="2">Other</option>
                      </select>
                      <p className="text-xs text-slate-500 mt-1">
                        0 = Token, 1 = NFT, 2 = Other
                      </p>
                    </div>

                    {/* Reward Value */}
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        Reward Value *
                      </label>
                      <input
                        type="number"
                        placeholder="Value of the reward"
                        value={rewardFormData.rewardValue}
                        onChange={(e) =>
                          setRewardFormData({
                            ...rewardFormData,
                            rewardValue: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                        required
                      />
                    </div>

                    {/* Token Mint */}
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        Token Mint *
                      </label>
                      <input
                        type="text"
                        placeholder="Solana token mint address"
                        value={rewardFormData.tokenMint}
                        onChange={(e) =>
                          setRewardFormData({
                            ...rewardFormData,
                            tokenMint: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                        required
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        For token rewards
                      </p>
                    </div>

                    {/* NFT Mint */}
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        NFT Mint *
                      </label>
                      <input
                        type="text"
                        placeholder="Solana NFT mint address"
                        value={rewardFormData.nftMint}
                        onChange={(e) =>
                          setRewardFormData({
                            ...rewardFormData,
                            nftMint: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                        required
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        For NFT rewards
                      </p>
                    </div>

                    {/* Active Status */}
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={rewardFormData.isActive}
                        onChange={(e) =>
                          setRewardFormData({
                            ...rewardFormData,
                            isActive: e.target.checked,
                          })
                        }
                        className="w-5 h-5 rounded border-slate-300"
                      />
                      <label
                        htmlFor="isActive"
                        className="text-sm font-semibold text-black"
                      >
                        Make this reward active immediately
                      </label>
                    </div>
                    <p className="text-xs text-slate-500">
                      Inactive rewards cannot be claimed by visitors
                    </p>

                    {/* Staking Section */}
                    <div className="border-t-2 border-slate-200 pt-6 mt-6">
                      <h3 className="text-lg font-bold text-black mb-4">Reward Staking (Optional)</h3>
                      
                      {/* Stake Initially Checkbox */}
                      <div className="flex items-center gap-3 mb-4">
                        <input
                          type="checkbox"
                          id="stakeInitially"
                          checked={rewardFormData.stakeInitially}
                          onChange={(e) =>
                            setRewardFormData({
                              ...rewardFormData,
                              stakeInitially: e.target.checked,
                            })
                          }
                          className="w-5 h-5 rounded border-slate-300"
                        />
                        <label
                          htmlFor="stakeInitially"
                          className="text-sm font-semibold text-black"
                        >
                          Stake this reward initially
                        </label>
                      </div>
                      <p className="text-xs text-slate-500 mb-4">
                        If checked, the reward will be created in a staked (locked) state. You must unstake it before visitors can claim it.
                      </p>

                      {/* Min Stake Period */}
                      {rewardFormData.stakeInitially && (
                        <div>
                          <label className="block text-sm font-semibold text-black mb-2">
                            Minimum Stake Period (seconds)
                          </label>
                          <input
                            type="number"
                            placeholder="e.g., 86400 (1 day) or 0 (no minimum)"
                            value={rewardFormData.minStakePeriod}
                            onChange={(e) =>
                              setRewardFormData({
                                ...rewardFormData,
                                minStakePeriod: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                            min="0"
                          />
                          <p className="text-xs text-slate-500 mt-1">
                            How long the reward must remain staked before you can unstake it. 0 = no minimum.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4 pt-6">
                      <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
                      >
                        Review Reward
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveForm(null)}
                        className="flex-1 px-6 py-3 bg-slate-200 text-black rounded-lg font-semibold hover:bg-slate-300 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <div className="flex items-center mb-6">
                    <button
                      onClick={() => setActiveForm(null)}
                      className="text-pink-600 hover:text-pink-700 font-semibold flex items-center gap-2"
                    >
                      <span>← Back</span>
                    </button>
                  </div>
                  <h2 className="text-2xl font-bold text-black mb-6">
                    Update Reward
                  </h2>

                  <form onSubmit={handleRewardPreview} className="space-y-6">
                    {/* Owner Field */}
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        Owner (Your Wallet)
                      </label>
                      <input
                        type="text"
                        disabled
                        value={publicKey.toString()}
                        className="w-full px-4 py-3 bg-slate-100 border border-slate-300 rounded-lg text-slate-600 cursor-not-allowed"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Auto-filled with your connected wallet
                      </p>
                    </div>

                    {/* Badge ID */}
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        Badge ID *
                      </label>
                      <input
                        type="text"
                        placeholder="ID of the badge this reward is for"
                        value={rewardFormData.badgeId}
                        onChange={(e) =>
                          setRewardFormData({
                            ...rewardFormData,
                            badgeId: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-black"
                        required
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        The badge that visitors must earn to claim this reward
                      </p>
                    </div>

                    {/* Reward ID */}
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        Reward ID *
                      </label>
                      <input
                        type="text"
                        placeholder="Unique identifier for this reward"
                        value={rewardFormData.rewardId}
                        onChange={(e) =>
                          setRewardFormData({
                            ...rewardFormData,
                            rewardId: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-black"
                        required
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Must be unique across all rewards
                      </p>
                    </div>

                    {/* Reward Name */}
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        Reward Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., 10 SOL Token"
                        value={rewardFormData.name}
                        onChange={(e) =>
                          setRewardFormData({
                            ...rewardFormData,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-black"
                        required
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        Description *
                      </label>
                      <textarea
                        placeholder="Describe what the visitor receives"
                        value={rewardFormData.description}
                        onChange={(e) =>
                          setRewardFormData({
                            ...rewardFormData,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none text-black"
                        rows={4}
                        required
                      />
                    </div>

                    {/* Reward Type */}
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        Reward Type *
                      </label>
                      <select
                        value={rewardFormData.rewardType}
                        onChange={(e) =>
                          setRewardFormData({
                            ...rewardFormData,
                            rewardType: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-black"
                        required
                      >
                        <option value="0">Token</option>
                        <option value="1">NFT</option>
                        <option value="2">Other</option>
                      </select>
                      <p className="text-xs text-slate-500 mt-1">
                        0 = Token, 1 = NFT, 2 = Other
                      </p>
                    </div>

                    {/* Reward Value */}
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        Reward Value *
                      </label>
                      <input
                        type="number"
                        placeholder="Value of the reward"
                        value={rewardFormData.rewardValue}
                        onChange={(e) =>
                          setRewardFormData({
                            ...rewardFormData,
                            rewardValue: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-black"
                        required
                      />
                    </div>

                    {/* Token Mint */}
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        Token Mint *
                      </label>
                      <input
                        type="text"
                        placeholder="Solana token mint address"
                        value={rewardFormData.tokenMint}
                        onChange={(e) =>
                          setRewardFormData({
                            ...rewardFormData,
                            tokenMint: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-black"
                        required
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        For token rewards
                      </p>
                    </div>

                    {/* NFT Mint */}
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        NFT Mint *
                      </label>
                      <input
                        type="text"
                        placeholder="Solana NFT mint address"
                        value={rewardFormData.nftMint}
                        onChange={(e) =>
                          setRewardFormData({
                            ...rewardFormData,
                            nftMint: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-black"
                        required
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        For NFT rewards
                      </p>
                    </div>

                    {/* Active Status */}
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={rewardFormData.isActive}
                        onChange={(e) =>
                          setRewardFormData({
                            ...rewardFormData,
                            isActive: e.target.checked,
                          })
                        }
                        className="w-5 h-5 rounded border-slate-300"
                      />
                      <label
                        htmlFor="isActive"
                        className="text-sm font-semibold text-black"
                      >
                        Make this reward active immediately
                      </label>
                    </div>
                    <p className="text-xs text-slate-500">
                      Inactive rewards cannot be claimed by visitors
                    </p>

                    {/* Submit Button */}
                    <div className="flex gap-4 pt-6">
                      <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 transition"
                      >
                        Review Reward
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveForm(null)}
                        className="flex-1 px-6 py-3 bg-slate-200 text-black rounded-lg font-semibold hover:bg-slate-300 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Badge Preview Modal */}
      {showBadgePreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-black mb-6">
              Review Your Badge
            </h2>

            {/* Badge Preview Card */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-6 mb-6 border border-emerald-200">
              {/* Badge Icon */}
              {badgeFormData.iconUri && (
                <div className="flex justify-center mb-6">
                  <img
                    src={badgeFormData.iconUri}
                    alt={badgeFormData.name}
                    className="w-32 h-32 object-cover rounded-lg shadow-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/128?text=Badge";
                    }}
                  />
                </div>
              )}

              {/* Badge Details */}
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    Badge Name
                  </p>
                  <p className="text-xl font-bold text-black">
                    {badgeFormData.name || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    Badge ID
                  </p>
                  <p className="text-sm text-slate-700 font-mono">
                    {badgeFormData.badgeId || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    Description
                  </p>
                  <p className="text-sm text-slate-700">
                    {badgeFormData.description || "N/A"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-emerald-200">
                  <div>
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                      Required Points
                    </p>
                    <p className="text-lg font-bold text-emerald-600">
                      {badgeFormData.requiredPoints || "0"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                      Max Earnings
                    </p>
                    <p className="text-lg font-bold text-teal-600">
                      {badgeFormData.maxEarnings || "0"}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-emerald-200">
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
                    Status
                  </p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      badgeFormData.isActive
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {badgeFormData.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleBadgeApprove}
                className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition"
              >
                Approve Badge
              </button>
              <button
                onClick={() => setShowBadgePreview(false)}
                className="flex-1 px-6 py-3 bg-slate-200 text-black rounded-lg font-semibold hover:bg-slate-300 transition"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reward Preview Modal */}
      {showRewardPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-black mb-6">
              Review Your Reward
            </h2>

            {/* Reward Preview Card */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 mb-6 border border-purple-200">
              {/* Reward Details */}
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    Reward Name
                  </p>
                  <p className="text-xl font-bold text-black">
                    {rewardFormData.name || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    Reward ID
                  </p>
                  <p className="text-sm text-slate-700 font-mono">
                    {rewardFormData.rewardId || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    Description
                  </p>
                  <p className="text-sm text-slate-700">
                    {rewardFormData.description || "N/A"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-purple-200">
                  <div>
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                      Reward Type
                    </p>
                    <p className="text-sm font-bold text-purple-600">
                      {rewardFormData.rewardType === "0"
                        ? "Token"
                        : rewardFormData.rewardType === "1"
                          ? "NFT"
                          : "Other"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                      Reward Value
                    </p>
                    <p className="text-lg font-bold text-pink-600">
                      {rewardFormData.rewardValue || "0"}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
                    Badge ID
                  </p>
                  <p className="text-sm text-slate-700 font-mono">
                    {rewardFormData.badgeId || "N/A"}
                  </p>
                </div>

                <div className="pt-4 border-t border-purple-200">
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
                    Status
                  </p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      rewardFormData.isActive
                        ? "bg-purple-100 text-purple-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {rewardFormData.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleRewardApprove}
                className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
              >
                Approve Reward
              </button>
              <button
                onClick={() => setShowRewardPreview(false)}
                className="flex-1 px-6 py-3 bg-slate-200 text-black rounded-lg font-semibold hover:bg-slate-300 transition"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
