'use client'

import { useState, useEffect } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, usePublicClient } from 'wagmi'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import LoadingSpinner from '@/components/LoadingSpinner'
import Toast from '@/components/Toast'
import { MEMBERSHIP_NFT_ABI } from '@/lib/contract'
import { parseMembershipCreatedEvent } from '@/utils/contractEvents'

export const dynamic = 'force-dynamic'

export default function CreateMembershipPage() {
  const { address, isConnected } = useAccount()
  const { open } = useWeb3Modal()
  const router = useRouter()
  const publicClient = usePublicClient()
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess, data: receipt } = useWaitForTransactionReceipt({ hash })

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    isRecurring: false,
    expiryDuration: '2592000', // 30 days in seconds
    category: '',
    coverImage: null as File | null,
  })

  const [coverImagePreview, setCoverImagePreview] = useState<string>('')
  const [uploading, setUploading] = useState(false)
  const [membershipId, setMembershipId] = useState<number | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)

  // Handle successful transaction
  useEffect(() => {
    if (isSuccess && receipt && address) {
      const id = parseMembershipCreatedEvent(receipt)
      if (id) {
        setMembershipId(id)
        setToast({ message: 'Transaction confirmed! Syncing membership...', type: 'info' })
        setTimeout(() => syncMembershipToDB(id), 1500)
      }
    }
  }, [isSuccess, receipt, address])

  async function syncMembershipToDB(id: number) {
    if (!id || !address) return

    try {
      const res = await fetch('/api/memberships/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          membershipId: id,
          creator: address,
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          isRecurring: formData.isRecurring,
          expiryDuration: formData.isRecurring ? parseInt(formData.expiryDuration) : undefined,
          category: formData.category,
          coverImage: coverImagePreview,
        }),
      })

      if (res.ok) {
        setToast({ 
          message: `🎉 Membership "${formData.name}" created successfully! Redirecting to dashboard...`, 
          type: 'success' 
        })
        // Wait a bit longer to show the success message
        setTimeout(() => {
          router.push('/dashboard')
          // Force refresh on dashboard
          router.refresh()
        }, 3000)
      } else {
        const errorData = await res.json().catch(() => ({}))
        setToast({ 
          message: errorData.error || 'Failed to sync membership to database. Please try again.', 
          type: 'error' 
        })
      }
    } catch (error) {
      console.error('Error syncing membership:', error)
      setToast({ message: 'Error syncing membership. Please refresh and check your dashboard.', type: 'error' })
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
        <Navbar />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-12">
            <div className="text-6xl mb-4">🔐</div>
            <h1 className="text-4xl font-bold mb-6 text-gray-900">Create Membership</h1>
            <p className="text-gray-600 mb-8">Please connect your wallet to create a membership</p>
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

  async function handleImageUpload(file: File) {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'image')

      const res = await fetch('/api/pinata/upload', {
        method: 'POST',
        body: formData,
      })
      
      if (!res.ok) {
        throw new Error('Failed to upload image')
      }
      
      const data = await res.json()
      return data.uri
    } catch (error) {
      console.error('Error uploading image:', error)
      setToast({ message: 'Failed to upload image. Please try again.', type: 'error' })
      throw error
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!address) return

    // Validation
    if (!formData.name.trim()) {
      setToast({ message: 'Please enter a membership name', type: 'error' })
      return
    }
    if (!formData.description.trim()) {
      setToast({ message: 'Please enter a description', type: 'error' })
      return
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setToast({ message: 'Please enter a valid price', type: 'error' })
      return
    }

    try {
      setUploading(true)
      
      // Upload cover image if provided
      let coverImageURI = ''
      if (formData.coverImage) {
        coverImageURI = await handleImageUpload(formData.coverImage)
      }

      // Create metadata
      const metadata = {
        name: formData.name,
        description: formData.description,
        image: coverImageURI,
        category: formData.category,
      }

      // Upload metadata to Pinata
      const metadataFormData = new FormData()
      metadataFormData.append('type', 'json')
      metadataFormData.append('data', JSON.stringify(metadata))

      const metadataRes = await fetch('/api/pinata/upload', {
        method: 'POST',
        body: metadataFormData,
      })
      
      if (!metadataRes.ok) {
        throw new Error('Failed to upload metadata')
      }
      
      const metadataData = await metadataRes.json()
      const metadataURI = metadataData.uri

      // Get contract address from env
      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || ''

      if (!contractAddress || contractAddress === '0x0') {
        setToast({ message: 'Contract not deployed. Please deploy the contract first.', type: 'error' })
        setUploading(false)
        return
      }

      // Convert price to USDC (6 decimals)
      const priceInUSDC = BigInt(Math.floor(parseFloat(formData.price) * 1000000))
      const expiryDuration = formData.isRecurring ? BigInt(formData.expiryDuration) : BigInt(0)

      setToast({ message: '⏳ Creating membership on blockchain... Please confirm the transaction in your wallet.', type: 'info' })

      // Create membership on blockchain
      writeContract({
        address: contractAddress as `0x${string}`,
        abi: MEMBERSHIP_NFT_ABI,
        functionName: 'createMembership',
        args: [priceInUSDC, formData.isRecurring, expiryDuration, metadataURI],
      })
      
      setUploading(false)
    } catch (error: any) {
      console.error('Error creating membership:', error)
      setToast({ message: error.message || 'Failed to create membership. Please try again.', type: 'error' })
      setUploading(false)
    }
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
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">Create Membership</h1>
          <p className="text-gray-600 text-lg">Start your own membership community</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 md:p-12 space-y-6 border border-pink-100">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Membership Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              placeholder="e.g., Premium Tech Community"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={5}
              className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              placeholder="Describe what members will get access to..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Price (USDC) *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full pl-8 pr-4 py-3 border-2 border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder="10.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              >
                <option value="">Select category</option>
                <option value="education">📚 Education</option>
                <option value="gaming">🎮 Gaming</option>
                <option value="art">🎨 Art</option>
                <option value="music">🎵 Music</option>
                <option value="tech">💻 Tech</option>
                <option value="community">👥 Community</option>
              </select>
            </div>
          </div>

          <div className="bg-pink-50 p-4 rounded-xl">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isRecurring}
                onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                className="w-5 h-5 text-pink-500 border-pink-300 rounded focus:ring-pink-500"
              />
              <div>
                <span className="text-sm font-semibold text-gray-900">Recurring (Monthly) Membership</span>
                <p className="text-xs text-gray-600">Members will need to renew monthly to maintain access</p>
              </div>
            </label>
          </div>

          {formData.isRecurring && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Expiry Duration (seconds)
              </label>
              <input
                type="number"
                value={formData.expiryDuration}
                onChange={(e) => setFormData({ ...formData, expiryDuration: e.target.value })}
                className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="2592000 (30 days)"
              />
              <p className="text-xs text-gray-500 mt-1">Default: 2592000 seconds (30 days)</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Cover Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  if (file.size > 5 * 1024 * 1024) {
                    setToast({ message: 'Image size must be less than 5MB', type: 'error' })
                    return
                  }
                  setFormData({ ...formData, coverImage: file })
                  const reader = new FileReader()
                  reader.onloadend = () => {
                    setCoverImagePreview(reader.result as string)
                  }
                  reader.readAsDataURL(file)
                }
              }}
              className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
            {coverImagePreview && (
              <div className="mt-4">
                <img
                  src={coverImagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-xl border-2 border-pink-200"
                />
                <button
                  type="button"
                  onClick={() => {
                    setCoverImagePreview('')
                    setFormData({ ...formData, coverImage: null })
                  }}
                  className="mt-2 text-sm text-red-600 hover:text-red-700"
                >
                  Remove image
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending || isConfirming || uploading}
            className="w-full px-6 py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-pink-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {uploading ? (
              <>
                <LoadingSpinner size="sm" />
                <span className="ml-2">Uploading...</span>
              </>
            ) : isPending || isConfirming ? (
              <>
                <LoadingSpinner size="sm" />
                <span className="ml-2">Creating on Blockchain...</span>
              </>
            ) : (
              '✨ Create Membership'
            )}
          </button>
        </form>
      </main>
    </div>
  )
}
