'use client'

import { useEffect, useState } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import LoadingSpinner from '@/components/LoadingSpinner'
import MembershipCard from '@/components/MembershipCard'
import { Membership } from '@/types'
import { MEMBERSHIP_NFT_ABI } from '@/lib/contract'

export const dynamic = 'force-dynamic'

export default function DashboardPage() {
  const { address, isConnected } = useAccount()
  const { open } = useWeb3Modal()
  const [memberships, setMemberships] = useState<Membership[]>([])
  const [userMemberships, setUserMemberships] = useState<Membership[]>([])
  const [createdMemberships, setCreatedMemberships] = useState<Membership[]>([])
  const [loading, setLoading] = useState(true)

  const contractAddress = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0') as `0x${string}`

  // Fetch user's memberships from blockchain
  const { data: userMembershipIds } = useReadContract({
    address: contractAddress,
    abi: MEMBERSHIP_NFT_ABI,
    functionName: 'getUserMemberships',
    args: [address || '0x0'],
    query: { enabled: isConnected && !!address && contractAddress !== '0x0' },
  })

  useEffect(() => {
    if (isConnected && address) {
      fetchData()
    }
  }, [isConnected, address, userMembershipIds])

  // Refresh data when page becomes visible (user returns from creating membership)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isConnected && address) {
        fetchData()
      }
    }
    
    const handleFocus = () => {
      if (isConnected && address) {
        fetchData()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [isConnected, address])

  async function fetchData() {
    if (!address) return
    
    setLoading(true)
    try {
      // Add cache-busting to ensure fresh data
      const res = await fetch(`/api/memberships?t=${Date.now()}`)
      if (!res.ok) {
        throw new Error('Failed to fetch memberships')
      }
      const data = await res.json()
      setMemberships(data)
      
      // Filter created memberships
      const created = data.filter((m: Membership) => m.creator.toLowerCase() === address.toLowerCase())
      setCreatedMemberships(created)
      
      // Filter user's memberships (from blockchain if available)
      if (userMembershipIds && Array.isArray(userMembershipIds)) {
        const ids = (userMembershipIds as bigint[]).map(id => Number(id))
        const userMems = data.filter((m: Membership) => ids.includes(m.membershipId))
        setUserMemberships(userMems)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
            <div className="text-6xl mb-4">🔐</div>
            <h1 className="text-4xl font-bold mb-6 text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mb-8">Please connect your wallet to view your dashboard</p>
            <button
              onClick={() => open()}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl text-lg font-semibold hover:from-pink-600 hover:to-pink-700 transition shadow-lg"
            >
              Connect Wallet
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600 text-lg">Manage your memberships and communities</p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-pink-100">
            <div className="text-3xl mb-2">🎫</div>
            <div className="text-3xl font-bold text-pink-600 mb-1">{userMemberships.length}</div>
            <div className="text-gray-600">My Memberships</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-pink-100">
            <div className="text-3xl mb-2">✨</div>
            <div className="text-3xl font-bold text-pink-600 mb-1">{createdMemberships.length}</div>
            <div className="text-gray-600">Created</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-pink-100">
            <div className="text-3xl mb-2">👥</div>
            <div className="text-3xl font-bold text-pink-600 mb-1">
              {createdMemberships.reduce((sum, m) => sum + (m.totalMembers || 0), 0)}
            </div>
            <div className="text-gray-600">Total Members</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl p-8 mb-12 text-white">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/create-membership"
              className="px-6 py-3 bg-white text-pink-600 rounded-xl hover:bg-pink-50 transition font-semibold"
            >
              ✨ Create Membership
            </Link>
            <Link
              href="/explore"
              className="px-6 py-3 bg-pink-700 text-white rounded-xl hover:bg-pink-800 transition font-semibold"
            >
              🔍 Explore Memberships
            </Link>
            <Link
              href="/analytics"
              className="px-6 py-3 bg-pink-700 text-white rounded-xl hover:bg-pink-800 transition font-semibold"
            >
              📊 View Analytics
            </Link>
          </div>
        </div>

        {/* My Memberships */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-pink-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">My Memberships</h2>
            <div className="flex items-center gap-4">
              <button
                onClick={fetchData}
                disabled={loading}
                className="px-4 py-2 text-pink-600 hover:text-pink-700 font-semibold hover:bg-pink-50 rounded-lg transition disabled:opacity-50"
                title="Refresh"
              >
                🔄 Refresh
              </button>
              <Link
                href="/explore"
                className="text-pink-600 hover:text-pink-700 font-semibold"
              >
                Browse More →
              </Link>
            </div>
          </div>
          {loading ? (
            <div className="text-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : userMemberships.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🎫</div>
              <p className="text-gray-600 mb-4 text-lg">You haven't joined any memberships yet</p>
              <Link
                href="/explore"
                className="inline-block px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl hover:from-pink-600 hover:to-pink-700 transition font-semibold"
              >
                Explore Memberships
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userMemberships.map((membership) => (
                <MembershipCard key={membership._id} membership={membership} />
              ))}
            </div>
          )}
        </div>

        {/* Created Memberships */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-pink-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">My Created Memberships</h2>
            <div className="flex items-center gap-4">
              <button
                onClick={fetchData}
                disabled={loading}
                className="px-4 py-2 text-pink-600 hover:text-pink-700 font-semibold hover:bg-pink-50 rounded-lg transition disabled:opacity-50"
                title="Refresh"
              >
                🔄 Refresh
              </button>
              <Link
                href="/create-membership"
                className="text-pink-600 hover:text-pink-700 font-semibold"
              >
                Create New →
              </Link>
            </div>
          </div>
          {loading ? (
            <div className="text-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : createdMemberships.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">📝</div>
              <p className="text-gray-600 mb-4 text-lg">You haven't created any memberships yet</p>
              <Link
                href="/create-membership"
                className="inline-block px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl hover:from-pink-600 hover:to-pink-700 transition font-semibold"
              >
                Create Your First Membership
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {createdMemberships.map((membership) => (
                <MembershipCard key={membership._id} membership={membership} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
