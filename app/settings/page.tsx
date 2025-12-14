'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import Navbar from '@/components/Navbar'
import Toast from '@/components/Toast'

export const dynamic = 'force-dynamic'

export default function SettingsPage() {
  const { address, isConnected } = useAccount()
  const { open } = useWeb3Modal()
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    membership: true,
  })

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-4xl font-bold mb-6 text-gray-900">Settings</h1>
          <p className="text-gray-600 mb-8">Please connect your wallet to access settings</p>
          <button
            onClick={() => open()}
            className="px-8 py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl text-lg font-semibold hover:from-pink-600 hover:to-pink-700 transition shadow-lg"
          >
            Connect Wallet
          </button>
        </main>
      </div>
    )
  }

  function handleSave() {
    // Save settings (would integrate with backend)
    setToast({ message: 'Settings saved successfully!', type: 'success' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <Navbar />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Settings</h1>

        <div className="space-y-6">
          {/* Account Settings */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-pink-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Account</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wallet Address
                </label>
                <div className="px-4 py-3 bg-pink-50 rounded-xl font-mono text-gray-900">
                  {address}
                </div>
              </div>
              <button
                onClick={() => open()}
                className="px-4 py-2 border-2 border-pink-500 text-pink-600 rounded-xl hover:bg-pink-50 transition font-semibold"
              >
                Change Wallet
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-pink-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Notifications</h2>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <div className="font-semibold text-gray-900">Email Notifications</div>
                  <div className="text-sm text-gray-600">Receive updates via email</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                  className="w-12 h-6 rounded-full bg-pink-200 appearance-none cursor-pointer checked:bg-pink-500 transition"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <div className="font-semibold text-gray-900">Push Notifications</div>
                  <div className="text-sm text-gray-600">Browser push notifications</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.push}
                  onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
                  className="w-12 h-6 rounded-full bg-pink-200 appearance-none cursor-pointer checked:bg-pink-500 transition"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <div className="font-semibold text-gray-900">Membership Updates</div>
                  <div className="text-sm text-gray-600">Notifications about your memberships</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.membership}
                  onChange={(e) => setNotifications({ ...notifications, membership: e.target.checked })}
                  className="w-12 h-6 rounded-full bg-pink-200 appearance-none cursor-pointer checked:bg-pink-500 transition"
                />
              </label>
            </div>
          </div>

          {/* Privacy */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-pink-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Privacy</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Public Profile</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Your wallet address and membership NFTs are public on the blockchain. You can choose to add a username and bio to personalize your profile.
                </p>
                <a
                  href="/profile"
                  className="text-pink-600 hover:text-pink-700 font-semibold"
                >
                  Edit Profile →
                </a>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl hover:from-pink-600 hover:to-pink-700 transition shadow-lg font-semibold"
            >
              Save Settings
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

