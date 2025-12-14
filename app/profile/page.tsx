'use client'

import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import Navbar from '@/components/Navbar'
import LoadingSpinner from '@/components/LoadingSpinner'
import { User, Membership } from '@/types'

export const dynamic = 'force-dynamic'

export default function ProfilePage() {
  const { address, isConnected } = useAccount()
  const { open } = useWeb3Modal()
  const [user, setUser] = useState<User | null>(null)
  const [memberships, setMemberships] = useState<Membership[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
  })

  useEffect(() => {
    if (isConnected && address) {
      fetchData()
    }
  }, [isConnected, address])

  async function fetchData() {
    if (!address) return
    setLoading(true)
    try {
      // Fetch user
      const userRes = await fetch(`/api/users?walletAddress=${address}`)
      if (userRes.ok) {
        const userData = await userRes.json()
        setUser(userData)
        setFormData({
          username: userData.username || '',
          bio: userData.bio || '',
        })
      } else {
        // Create user if doesn't exist
        const createRes = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ walletAddress: address }),
        })
        if (createRes.ok) {
          const newUser = await createRes.json()
          setUser(newUser)
        }
      }

      // Fetch user's memberships
      const membershipsRes = await fetch('/api/memberships')
      const allMemberships = await membershipsRes.json()
      // Filter by user's wallet (this would ideally come from blockchain)
      setMemberships(allMemberships.filter((m: Membership) => m.creator.toLowerCase() === address?.toLowerCase()))
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!address) return
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: address,
          username: formData.username,
          bio: formData.bio,
        }),
      })
      if (res.ok) {
        const updatedUser = await res.json()
        setUser(updatedUser)
        setEditing(false)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-4xl font-bold mb-6 text-gray-900">Profile</h1>
          <p className="text-gray-600 mb-8">Please connect your wallet to view your profile</p>
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <LoadingSpinner size="lg" />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-pink-100">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold text-gray-900">My Profile</h1>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
              >
                Edit Profile
              </button>
            )}
          </div>

          {editing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Enter username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Tell us about yourself..."
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl hover:from-pink-600 hover:to-pink-700 transition font-semibold"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setEditing(false)
                    setFormData({
                      username: user?.username || '',
                      bio: user?.bio || '',
                    })
                  }}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <div className="text-sm text-gray-500 mb-1">Wallet Address</div>
                <div className="text-lg font-mono text-gray-900 bg-pink-50 px-4 py-2 rounded-lg">
                  {address}
                </div>
              </div>
              {user?.username && (
                <div>
                  <div className="text-sm text-gray-500 mb-1">Username</div>
                  <div className="text-lg text-gray-900">{user.username}</div>
                </div>
              )}
              {user?.bio && (
                <div>
                  <div className="text-sm text-gray-500 mb-1">Bio</div>
                  <div className="text-lg text-gray-900">{user.bio}</div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-pink-100">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">My Created Memberships</h2>
          {memberships.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">📝</div>
              <p className="text-gray-600 mb-4">You haven't created any memberships yet</p>
              <a
                href="/create-membership"
                className="inline-block px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl hover:from-pink-600 hover:to-pink-700 transition font-semibold"
              >
                Create Your First Membership
              </a>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {memberships.map((membership) => (
                <a
                  key={membership._id}
                  href={`/membership/${membership.membershipId}`}
                  className="p-4 border-2 border-pink-200 rounded-xl hover:border-pink-500 hover:bg-pink-50 transition"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">{membership.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{membership.totalMembers} members</p>
                  <p className="text-lg font-bold text-pink-600">${membership.price}</p>
                </a>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

