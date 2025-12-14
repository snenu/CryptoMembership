import Link from 'next/link'
import Navbar from '@/components/Navbar'

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center pt-20 pb-16">
          <div className="inline-block mb-6">
            <span className="text-6xl">🎫</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
            Decentralized
            <br />
            <span className="bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent">
              Membership Platform
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            A Web3 alternative to Patreon, Discord subscriptions, and paid communities.
            <br />
            Join memberships with any crypto and prove access via NFT.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/explore"
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl text-lg font-semibold hover:from-pink-600 hover:to-pink-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              🚀 Explore Memberships
            </Link>
            <Link
              href="/create-membership"
              className="px-8 py-4 bg-white text-pink-600 border-2 border-pink-500 rounded-xl text-lg font-semibold hover:bg-pink-50 transition shadow-md hover:shadow-lg"
            >
              ✨ Create Membership
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-32 grid md:grid-cols-3 gap-8 mb-32">
          <div className="bg-white p-8 rounded-2xl shadow-lg card-hover border border-pink-100">
            <div className="text-5xl mb-6">🪪</div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">NFT-Based Access</h3>
            <p className="text-gray-600 leading-relaxed">
              Your membership is an NFT. Own it, prove it, and never lose access due to platform bans.
              True ownership in your wallet.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg card-hover border border-pink-100">
            <div className="text-5xl mb-6">💳</div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Pay with Any Crypto</h3>
            <p className="text-gray-600 leading-relaxed">
              Use Bitcoin, Ethereum, Solana, or any crypto you own. SideShift converts it automatically.
              No need to swap tokens.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg card-hover border border-pink-100">
            <div className="text-5xl mb-6">🌐</div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Fully Decentralized</h3>
            <p className="text-gray-600 leading-relaxed">
              Built on Polygon. No central authority. Your membership, your control.
              Censorship-resistant and transparent.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-3xl p-12 md:p-16 shadow-xl mb-32 border border-pink-100">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Connect Wallet', desc: 'Link your Web3 wallet securely' },
              { step: '2', title: 'Browse Memberships', desc: 'Find communities you love' },
              { step: '3', title: 'Pay & Join', desc: 'Pay with any cryptocurrency' },
              { step: '4', title: 'Get Access', desc: 'NFT unlocks exclusive content' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                  <span className="text-3xl font-bold text-pink-600">{item.step}</span>
                </div>
                <h4 className="font-bold text-lg mb-2 text-gray-900">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-3xl p-12 text-white mb-32 shadow-xl">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">100%</div>
              <div className="text-pink-100">Decentralized</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">∞</div>
              <div className="text-pink-100">Crypto Options</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">0%</div>
              <div className="text-pink-100">Platform Fees</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

