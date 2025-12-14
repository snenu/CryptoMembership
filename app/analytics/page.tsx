'use client'

import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import Navbar from '@/components/Navbar'
import { Membership } from '@/types'

export const dynamic = 'force-dynamic'

export default function AnalyticsPage() {
  const { address, isConnected } = useAccount()
  const { open } = useWeb3Modal()
  const [memberships, setMemberships] = useState<Membership[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalMemberships: 0,
    totalMembers: 0,
    totalRevenue: 0,
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
      const res = await fetch(`/api/memberships?creator=${address}`)
      const data = await res.json()
      setMemberships(data)
      
      // Calculate stats
      const totalMembers = data.reduce((sum: number, m: Membership) => sum + (m.totalMembers || 0), 0)
      const totalRevenue = data.reduce((sum: number, m: Membership) => {
        const revenue = (m.price || 0) * (m.totalMembers || 0)
        return sum + revenue
      }, 0)
      
      setStats({
        totalMemberships: data.length,
        totalMembers,
        totalRevenue,
      })
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-4xl font-bold mb-6 text-gray-900">Analytics</h1>
          <p className="text-gray-600 mb-8">Please connect your wallet to view analytics</p>
          <button
            onClick={() => open()}
            className="px-8 py-4 bg-pink-500 text-white rounded-lg text-lg font-semibold hover:bg-pink-600 transition"
          >
            Connect Wallet
          </button>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Analytics Dashboard</h1>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-gray-600 mb-2">Total Memberships</h3>
                <p className="text-3xl font-bold text-pink-600">{stats.totalMemberships}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-gray-600 mb-2">Total Members</h3>
                <p className="text-3xl font-bold text-pink-600">{stats.totalMembers}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-gray-600 mb-2">Total Revenue</h3>
                <p className="text-3xl font-bold text-pink-600">${stats.totalRevenue.toFixed(2)}</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md">
              <h2 className="text-2xl font-semibold mb-6 text-gray-900">Membership Performance</h2>
              <div className="space-y-4">
                {memberships.map((membership) => (
                  <div
                    key={membership._id}
                    className="p-6 border border-pink-200 rounded-lg hover:bg-pink-50 transition"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{membership.name}</h3>
                        <p className="text-gray-600 text-sm mt-1">{membership.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-pink-600">${membership.price}</p>
                        {membership.isRecurring && (
                          <p className="text-sm text-gray-500">/month</p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-pink-100">
                      <div>
                        <p className="text-sm text-gray-600">Members</p>
                        <p className="text-lg font-semibold text-gray-900">{membership.totalMembers}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Revenue</p>
                        <p className="text-lg font-semibold text-gray-900">
                          ${((membership.price || 0) * (membership.totalMembers || 0)).toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <p className={`text-lg font-semibold ${membership.isActive ? 'text-green-600' : 'text-red-600'}`}>
                          {membership.isActive ? 'Active' : 'Inactive'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

