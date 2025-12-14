'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import MembershipCard from '@/components/MembershipCard'
import LoadingSpinner from '@/components/LoadingSpinner'
import { Membership } from '@/types'

export const dynamic = 'force-dynamic'

export default function ExplorePage() {
  const [memberships, setMemberships] = useState<Membership[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    fetchMemberships()
  }, [search, category, sortBy])

  // Refresh data when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchMemberships()
      }
    }
    
    const handleFocus = () => {
      fetchMemberships()
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  async function fetchMemberships() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (category) params.append('category', category)
      // Add cache-busting to ensure fresh data
      params.append('t', Date.now().toString())
      
      const res = await fetch(`/api/memberships?${params}`)
      if (!res.ok) {
        throw new Error('Failed to fetch memberships')
      }
      const data = await res.json()
      
      // Sort memberships
      let sorted = [...data]
      if (sortBy === 'price-low') {
        sorted.sort((a, b) => a.price - b.price)
      } else if (sortBy === 'price-high') {
        sorted.sort((a, b) => b.price - a.price)
      } else if (sortBy === 'members') {
        sorted.sort((a, b) => (b.totalMembers || 0) - (a.totalMembers || 0))
      }
      
      setMemberships(sorted)
    } catch (error) {
      console.error('Error fetching memberships:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold text-gray-900 mb-2">Explore Memberships</h1>
            <p className="text-gray-600 text-lg">Discover amazing communities and exclusive content</p>
          </div>
          <button
            onClick={fetchMemberships}
            disabled={loading}
            className="px-4 py-2 text-pink-600 hover:text-pink-700 font-semibold hover:bg-pink-50 rounded-lg transition disabled:opacity-50 border-2 border-pink-200"
            title="Refresh"
          >
            🔄 Refresh
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-md mb-8 border border-pink-100">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="🔍 Search memberships..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-4 py-3 pl-12 border-2 border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
              </div>
            </div>
            <div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              >
                <option value="">All Categories</option>
                <option value="education">📚 Education</option>
                <option value="gaming">🎮 Gaming</option>
                <option value="art">🎨 Art</option>
                <option value="music">🎵 Music</option>
                <option value="tech">💻 Tech</option>
                <option value="community">👥 Community</option>
              </select>
            </div>
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="members">Most Members</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-20">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Loading memberships...</p>
          </div>
        ) : memberships.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-md">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No memberships found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="mb-6 text-gray-600">
              Found <span className="font-semibold text-pink-600">{memberships.length}</span> membership{memberships.length !== 1 ? 's' : ''}
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {memberships.map((membership) => (
                <MembershipCard key={membership._id} membership={membership} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

