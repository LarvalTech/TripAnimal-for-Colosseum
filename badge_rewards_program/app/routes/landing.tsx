import type { Route } from "./+types/landing";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { Header } from "~/components/Header";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "TripAnimal Agri - Grow Your Tourism Business with AR & Blockchain" },
    {
      name: "description",
      content:
        "TripAnimal Agri helps tourism operators increase visitor engagement and revenue through AR gaming and token-based rewards on Solana.",
    },
  ];
}

const Component = () => {
  const { connected } = useWallet();

  return (
    <>
      <Header />

      {/* Hero Section - B2B Focus */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-20 md:py-32">
        <div className="container mx-auto px-5">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Grow Your Tourism Business with AR & Blockchain
              </h1>
              <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed">
                TripAnimal Agri empowers tourism operators to create immersive AR experiences, 
                increase visitor engagement, and unlock new revenue streams through token-based rewards.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {!connected ? (
                  <WalletMultiButton />
                ) : (
                  <Link
                    to="/app"
                    className="px-8 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition text-center"
                  >
                    Go to Dashboard
                  </Link>
                )}
                <Link
                  to="/docs"
                  className="px-8 py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 transition text-center"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="flex-1 hidden md:block">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-12 shadow-2xl">
                <div className="text-center">
                  <svg
                    className="w-32 h-32 mx-auto mb-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  <h3 className="text-2xl font-bold mb-3">
                    Increase Visitor Engagement
                  </h3>
                  <p className="text-emerald-50">
                    Create interactive AR quests that keep visitors engaged and coming back.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-5">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-16">
            Why Tourism Operators Choose TripAnimal Agri
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Benefit 1: Revenue */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-8 shadow-lg hover:shadow-xl transition border-l-4 border-emerald-600">
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
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Boost Revenue
              </h3>
              <p className="text-slate-700 mb-4">
                Create new revenue streams through quest subscriptions and token-based rewards. 
                Monetize your unique location and experiences.
              </p>
              <ul className="text-sm text-slate-600 space-y-2">
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-2 font-bold">✓</span>
                  <span>Subscription-based quest management</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-2 font-bold">✓</span>
                  <span>Token rewards for visitor engagement</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-2 font-bold">✓</span>
                  <span>Profit-share model on badge sales</span>
                </li>
              </ul>
            </div>

            {/* Benefit 2: Engagement */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 shadow-lg hover:shadow-xl transition border-l-4 border-blue-600">
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
                    d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1m2-1v2.5M9 21l-2-1-2 1m2-1v-2.5M20 14l-2-1m2 1l-2 1m2-1v-2.5M14 17l-2 1m2-1l-2-1m2 1v-2.5"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Increase Engagement
              </h3>
              <p className="text-slate-700 mb-4">
                Keep visitors entertained and engaged longer with interactive AR quests. 
                Encourage repeat visits and word-of-mouth marketing.
              </p>
              <ul className="text-sm text-slate-600 space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 font-bold">✓</span>
                  <span>Interactive AR experiences at your location</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 font-bold">✓</span>
                  <span>Gamified visitor journeys</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 font-bold">✓</span>
                  <span>Social sharing and viral growth</span>
                </li>
              </ul>
            </div>

            {/* Benefit 3: Easy to Use */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 shadow-lg hover:shadow-xl transition border-l-4 border-purple-600">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Simple to Manage
              </h3>
              <p className="text-slate-700 mb-4">
                No technical expertise required. Set up quests, manage badges, and track 
                performance through an intuitive dashboard.
              </p>
              <ul className="text-sm text-slate-600 space-y-2">
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2 font-bold">✓</span>
                  <span>Intuitive dashboard interface</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2 font-bold">✓</span>
                  <span>No coding or technical skills needed</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2 font-bold">✓</span>
                  <span>Real-time analytics and reporting</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works for Operators */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-5">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-16">
            How It Works for Your Business
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition">
              <div className="flex items-center justify-center w-12 h-12 bg-emerald-600 text-white rounded-full mb-6 text-lg font-bold">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">
                Connect Wallet
              </h3>
              <p className="text-slate-600 text-sm">
                Sign in with your Solana wallet to access the TripAnimal Agri dashboard.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition">
              <div className="flex items-center justify-center w-12 h-12 bg-emerald-600 text-white rounded-full mb-6 text-lg font-bold">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">
                Create Quests
              </h3>
              <p className="text-slate-600 text-sm">
                Set up AR quests at your location with custom badges and reward values.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition">
              <div className="flex items-center justify-center w-12 h-12 bg-emerald-600 text-white rounded-full mb-6 text-lg font-bold">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">
                Engage Visitors
              </h3>
              <p className="text-slate-600 text-sm">
                Visitors discover and complete your AR quests, earning badges and rewards.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition">
              <div className="flex items-center justify-center w-12 h-12 bg-emerald-600 text-white rounded-full mb-6 text-lg font-bold">
                4
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">
                Earn Revenue
              </h3>
              <p className="text-slate-600 text-sm">
                Receive payments from subscriptions and token-based reward sharing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Market Validation */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-5">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-16">
            Proven Demand from Tourism Operators
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-8">
                Market Opportunity
              </h3>
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-6 border-l-4 border-emerald-600">
                  <p className="text-slate-600 text-sm mb-2">EU Small Farms</p>
                  <p className="text-4xl font-bold text-emerald-600">9.1M</p>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border-l-4 border-blue-600">
                  <p className="text-slate-600 text-sm mb-2">Agri-Tourism Businesses</p>
                  <p className="text-4xl font-bold text-blue-600">20,000</p>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border-l-4 border-purple-600">
                  <p className="text-slate-600 text-sm mb-2">Actively Seeking Revenue Growth</p>
                  <p className="text-4xl font-bold text-purple-600">46%</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-8">
                Validated by Operators
              </h3>
              <div className="space-y-6">
                <div className="bg-white border-2 border-slate-200 rounded-lg p-6 hover:border-emerald-600 transition">
                  <p className="text-slate-700 font-semibold mb-2">
                    "Actively seeking new revenue and cost savings measures."
                  </p>
                  <p className="text-slate-600 text-sm">— BiaEnergy (Ireland)</p>
                </div>
                <div className="bg-white border-2 border-slate-200 rounded-lg p-6 hover:border-emerald-600 transition">
                  <p className="text-slate-700 font-semibold mb-2">
                    "We are actively seeking innovations to manage digestate and increase income."
                  </p>
                  <p className="text-slate-600 text-sm">— Blu-H Energy (Italy)</p>
                </div>
                <div className="bg-white border-2 border-slate-200 rounded-lg p-6 hover:border-emerald-600 transition">
                  <p className="text-slate-700 font-semibold mb-2">
                    "We were already aware of the VFAs recovery opportunity and specifically asked to keep an eye out for technologies."
                  </p>
                  <p className="text-slate-600 text-sm">— Bessozzi (Italy)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology & Security */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-5">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-16">
            Built on Secure, Scalable Technology
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg">
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">
                Solana Blockchain
              </h3>
              <p className="text-slate-600 text-sm">
                Fast, low-cost transactions with industry-leading performance and security.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="flex items-center justify-center w-14 h-14 bg-green-600 text-white rounded-lg mb-6">
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
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">
                Enterprise Security
              </h3>
              <p className="text-slate-600 text-sm">
                Your data and transactions are protected with bank-level encryption and security protocols.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
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
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">
                Real-Time Analytics
              </h3>
              <p className="text-slate-600 text-sm">
                Track quest performance, visitor engagement, and revenue in real-time dashboards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="container mx-auto px-5 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Grow Your Tourism Business?
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Connect your wallet to access the TripAnimal Agri dashboard and start creating 
            AR quests for your visitors today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!connected ? (
              <WalletMultiButton />
            ) : (
              <Link
                to="/app"
                className="px-8 py-3 bg-white text-emerald-600 rounded-lg font-semibold hover:bg-slate-100 transition"
              >
                Go to Dashboard
              </Link>
            )}
            <Link
              to="/docs"
              className="px-8 py-3 bg-emerald-700 text-white rounded-lg font-semibold hover:bg-emerald-800 transition"
            >
              View Documentation
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="container mx-auto px-5">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold mb-4">TripAnimal Agri</h4>
              <p className="text-sm">
                Empowering tourism operators with AR gaming and blockchain-based rewards.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Resources</h4>
              <ul className="text-sm space-y-2">
                <li>
                  <Link to="/docs" className="hover:text-white transition">
                    Documentation
                  </Link>
                </li>
                <li>
                  <a
                    href="https://github.com/LarvalTech/TripAnimal-for-Colosseum"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition"
                  >
                    GitHub Repository
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Built On</h4>
              <ul className="text-sm space-y-2">
                <li>Solana Blockchain</li>
                <li>React & React Router</li>
                <li>Anchor Framework</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center text-sm">
            <p>
              &copy; 2025 TripAnimal Agri. All rights reserved. Built for green tourism operators.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default function Landing() {
  return (
    <WalletModalProvider>
      <Component />
    </WalletModalProvider>
  );
}
