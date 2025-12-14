'use client'

import Navbar from '@/components/Navbar'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function HelpPage() {
  const faqs = [
    {
      question: 'How do I join a membership?',
      answer: 'Connect your wallet, browse memberships, select one you like, and pay with any cryptocurrency. SideShift will automatically convert your crypto to USDC, and you\'ll receive an NFT that proves your membership.',
    },
    {
      question: 'What cryptocurrencies can I use to pay?',
      answer: 'You can pay with Bitcoin, Ethereum, Solana, Polygon, USDC, USDT, DAI, and many more. SideShift handles the conversion automatically.',
    },
    {
      question: 'How do I access gated content?',
      answer: 'Once you join a membership, you\'ll receive an NFT. This NFT proves your membership and grants you access to exclusive content. Just navigate to the membership\'s content page.',
    },
    {
      question: 'Can I create my own membership?',
      answer: 'Yes! Connect your wallet, go to "Create Membership", fill in the details, set your price, and publish. You\'ll be able to manage it from your dashboard.',
    },
    {
      question: 'What is a recurring membership?',
      answer: 'A recurring membership requires monthly payments. Your NFT will expire after the billing period, and you\'ll need to renew to maintain access.',
    },
    {
      question: 'How do I renew my membership?',
      answer: 'For recurring memberships, you can renew directly from your dashboard or the membership page when your subscription expires.',
    },
    {
      question: 'What blockchain is this built on?',
      answer: 'CryptoMembership is built on Polygon (Amoy testnet for now). This ensures low gas fees and fast transactions.',
    },
    {
      question: 'Is my membership NFT transferable?',
      answer: 'Yes! Your membership NFT is a standard ERC-721 token, so you can transfer it to another wallet or sell it if the creator allows it.',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Help & Support</h1>
          <p className="text-xl text-gray-600">Get answers to common questions</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-pink-100">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-pink-100 pb-6 last:border-0">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Still need help?</h2>
          <p className="text-pink-100 mb-6">Contact our support team or check out our documentation</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@cryptomembership.xyz"
              className="px-6 py-3 bg-white text-pink-600 rounded-xl hover:bg-pink-50 transition font-semibold"
            >
              📧 Email Support
            </a>
            <Link
              href="/explore"
              className="px-6 py-3 bg-pink-700 text-white rounded-xl hover:bg-pink-800 transition font-semibold"
            >
              🚀 Get Started
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

