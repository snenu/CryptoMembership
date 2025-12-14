'use client'

import { useEffect, useState } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import LoadingSpinner from '@/components/LoadingSpinner'
import Toast from '@/components/Toast'
import MemberCard from '@/components/MemberCard'
import { Membership } from '@/types'
import { MEMBERSHIP_NFT_ABI } from '@/lib/contract'

export const dynamic = 'force-dynamic'

interface Member {
  walletAddress: string
  username?: string
  avatar?: string
  bio?: string
  joinedAt?: string
  tokenId?: number
}

export default function MembershipDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const { open } = useWeb3Modal()
  const membershipId = parseInt(params.id as string)

  const [membership, setMembership] = useState<Membership | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [hasAccess, setHasAccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const [membersLoading, setMembersLoading] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedCrypto, setSelectedCrypto] = useState('ETH')
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)

  const contractAddress = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0') as `0x${string}`

  // Check access
  const { data: access, refetch: refetchAccess } = useReadContract({
    address: contractAddress,
    abi: MEMBERSHIP_NFT_ABI,
    functionName: 'checkAccess',
    args: [address || '0x0', BigInt(membershipId)],
    query: { enabled: isConnected && !!address && contractAddress !== '0x0' },
  })

  const { writeContract: purchaseMembership, data: purchaseHash, isPending: isPurchasing } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: purchaseSuccess } = useWaitForTransactionReceipt({ hash: purchaseHash })

  useEffect(() => {
    if (access !== undefined) {
      setHasAccess(access as boolean)
    }
  }, [access])

  useEffect(() => {
    fetchMembership()
    fetchMembers()
  }, [membershipId])

  useEffect(() => {
    if (purchaseSuccess) {
      setToast({ message: 'Successfully joined membership!', type: 'success' })
      // Register member in database
      if (address) {
        registerMember()
      }
      refetchAccess()
      fetchMembers() // Refresh members list
      setTimeout(() => {
        router.push(`/membership/${membershipId}/content`)
      }, 2000)
    }
  }, [purchaseSuccess, membershipId, router, refetchAccess, address])

  async function fetchMembership() {
    setLoading(true)
    try {
      const res = await fetch(`/api/memberships/${membershipId}?byId=true`)
      if (res.ok) {
        const data = await res.json()
        setMembership(data)
      } else {
        setToast({ message: 'Membership not found', type: 'error' })
      }
    } catch (error) {
      console.error('Error fetching membership:', error)
      setToast({ message: 'Failed to load membership', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  async function fetchMembers() {
    setMembersLoading(true)
    try {
      const res = await fetch(`/api/members/${membershipId}`)
      if (res.ok) {
        const data = await res.json()
        setMembers(data)
      }
    } catch (error) {
      console.error('Error fetching members:', error)
    } finally {
      setMembersLoading(false)
    }
  }

  async function registerMember() {
    if (!address || !membershipId) return
    try {
      await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          membershipId,
          walletAddress: address,
        }),
      })
    } catch (error) {
      console.error('Error registering member:', error)
    }
  }

  async function handleJoin() {
    if (!isConnected) {
      open()
      return
    }

    if (!membership) return

    if (contractAddress === '0x0') {
      setToast({ message: 'Contract not deployed. Please contact support.', type: 'error' })
      return
    }

    setShowPaymentModal(true)
  }

  async function handleSideShiftPayment() {
    if (!address || !membership) return

    setPaymentProcessing(true)
    try {
      const res = await fetch('/api/sideshift/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          depositCoin: selectedCrypto,
          settleCoin: 'USDC',
          settleAddress: contractAddress,
          settleAmount: (membership.price * 1000000).toString(), // USDC has 6 decimals
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to create payment order')
      }

      const order = await res.json()
      setOrderId(order.orderId)
      setToast({ message: 'Payment order created! Redirecting to SideShift...', type: 'info' })
      
      // Open SideShift in new window
      window.open(`https://sideshift.ai/orders/${order.orderId}`, '_blank')
      
      // Poll for order completion
      pollOrderStatus(order.orderId)
    } catch (error: any) {
      console.error('Error creating SideShift order:', error)
      setToast({ 
        message: error.message || 'Failed to create payment order. Please check your SideShift credentials.', 
        type: 'error' 
      })
      setPaymentProcessing(false)
    }
  }

  async function pollOrderStatus(orderId: string) {
    const maxAttempts = 120 // 10 minutes
    let attempts = 0

    const interval = setInterval(async () => {
      attempts++
      try {
        const res = await fetch(`/api/sideshift/status?orderId=${orderId}`)
        if (!res.ok) {
          if (attempts >= maxAttempts) {
            clearInterval(interval)
            setPaymentProcessing(false)
            setToast({ message: 'Payment check timed out. Please verify manually.', type: 'error' })
          }
          return
        }

        const order = await res.json()

        if (order.status === 'complete' || order.status === 'settled') {
          clearInterval(interval)
          setPaymentProcessing(false)
          setShowPaymentModal(false)
          setToast({ message: 'Payment confirmed! Processing membership...', type: 'success' })
          
          // Purchase membership on blockchain
          purchaseMembership({
            address: contractAddress,
            abi: MEMBERSHIP_NFT_ABI,
            functionName: 'purchaseMembership',
            args: [BigInt(membershipId)],
          })
        } else if (order.status === 'failed' || order.status === 'refunded') {
          clearInterval(interval)
          setPaymentProcessing(false)
          setToast({ message: 'Payment failed or was refunded', type: 'error' })
        } else if (attempts >= maxAttempts) {
          clearInterval(interval)
          setPaymentProcessing(false)
          setToast({ message: 'Payment check timed out. Please verify manually.', type: 'error' })
        }
      } catch (error) {
        console.error('Error checking order status:', error)
        if (attempts >= maxAttempts) {
          clearInterval(interval)
          setPaymentProcessing(false)
        }
      }
    }, 5000) // Check every 5 seconds
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading membership...</p>
        </main>
      </div>
    )
  }

  if (!membership) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-3xl font-bold mb-4 text-gray-900">Membership Not Found</h1>
            <p className="text-gray-600 mb-6">The membership you're looking for doesn't exist.</p>
            <Link
              href="/explore"
              className="inline-block px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl hover:from-pink-600 hover:to-pink-700 transition font-semibold"
            >
              Browse Memberships →
            </Link>
          </div>
        </main>
      </div>
    )
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/explore"
          className="inline-flex items-center text-pink-600 hover:text-pink-700 mb-6 font-medium"
        >
          ← Back to Explore
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Left Column - Image */}
          <div>
            {membership.coverImage ? (
              <img
                src={membership.coverImage}
                alt={membership.name}
                className="w-full h-[500px] object-cover rounded-2xl shadow-xl"
              />
            ) : (
              <div className="w-full h-[500px] bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl shadow-xl flex items-center justify-center">
                <div className="text-8xl">🎫</div>
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-pink-100">
            <div className="mb-6">
              {membership.category && (
                <span className="inline-block px-4 py-1 bg-pink-100 text-pink-700 text-sm font-semibold rounded-full mb-4">
                  {membership.category}
                </span>
              )}
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{membership.name}</h1>
              <p className="text-lg text-gray-600 leading-relaxed">{membership.description}</p>
            </div>
            
            <div className="border-t border-b border-pink-100 py-6 my-6">
              <div className="flex items-baseline mb-2">
                <span className="text-5xl font-bold text-pink-600">${membership.price}</span>
                {membership.isRecurring && (
                  <span className="text-xl text-gray-500 ml-2">/month</span>
                )}
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>👥 {membership.totalMembers || 0} members</span>
                {membership.isRecurring && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold">
                    Recurring
                  </span>
                )}
              </div>
            </div>

            {hasAccess ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                  <p className="text-green-800 font-semibold flex items-center">
                    <span className="text-2xl mr-2">✓</span>
                    You have access to this membership
                  </p>
                </div>
                <Link
                  href={`/membership/${membershipId}/content`}
                  className="block w-full text-center px-6 py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-pink-700 transition shadow-lg"
                >
                  🎉 View Exclusive Content
                </Link>
              </div>
            ) : (
              <button
                onClick={handleJoin}
                disabled={isPurchasing || isConfirming || paymentProcessing}
                className="w-full px-6 py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-pink-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {paymentProcessing ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Processing Payment...</span>
                  </>
                ) : isPurchasing || isConfirming ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Confirming Membership...</span>
                  </>
                ) : (
                  '💳 Join Membership'
                )}
              </button>
            )}
          </div>
        </div>

        {/* Members Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-pink-100">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            Members ({members.length})
          </h2>
          {membersLoading ? (
            <div className="text-center py-12">
              <LoadingSpinner size="md" />
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">👥</div>
              <p className="text-gray-600">No members yet. Be the first to join!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {members.map((member, index) => (
                <MemberCard key={index} {...member} />
              ))}
            </div>
          )}
        </div>

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 border border-pink-100">
              <h2 className="text-3xl font-bold mb-2 text-gray-900">Select Payment Method</h2>
              <p className="text-gray-600 mb-6">Pay with any cryptocurrency via SideShift</p>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cryptocurrency
                </label>
                <select
                  value={selectedCrypto}
                  onChange={(e) => setSelectedCrypto(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-lg"
                >
                  <option value="ETH">Ethereum (ETH)</option>
                  <option value="BTC">Bitcoin (BTC)</option>
                  <option value="SOL">Solana (SOL)</option>
                  <option value="MATIC">Polygon (MATIC)</option>
                  <option value="USDC">USDC</option>
                  <option value="USDT">USDT</option>
                  <option value="DAI">DAI</option>
                </select>
              </div>

              <div className="bg-pink-50 p-4 rounded-xl mb-6">
                <div className="text-sm text-gray-600 mb-1">Amount to Pay</div>
                <div className="text-2xl font-bold text-pink-600">
                  ${membership.price} USDC
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  SideShift will convert your {selectedCrypto} to USDC automatically
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowPaymentModal(false)
                    setPaymentProcessing(false)
                  }}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSideShiftPayment}
                  disabled={paymentProcessing}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl hover:from-pink-600 hover:to-pink-700 transition font-semibold disabled:opacity-50"
                >
                  {paymentProcessing ? 'Creating Order...' : 'Continue to Payment'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
