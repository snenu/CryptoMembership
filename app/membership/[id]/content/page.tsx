'use client'

import { useEffect, useState } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { Content } from '@/types'
import { MEMBERSHIP_NFT_ABI } from '@/lib/contract'

export const dynamic = 'force-dynamic'

export default function MembershipContentPage() {
  const params = useParams()
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const membershipId = parseInt(params.id as string)

  const [hasAccess, setHasAccess] = useState(false)
  const [content, setContent] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)
  const [checkingAccess, setCheckingAccess] = useState(true)

  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}` || '0x0'

  const { data: access } = useReadContract({
    address: contractAddress,
    abi: MEMBERSHIP_NFT_ABI,
    functionName: 'checkAccess',
    args: [address || '0x0', BigInt(membershipId)],
    query: { enabled: isConnected && !!address },
  })

  useEffect(() => {
    if (!isConnected) {
      router.push(`/membership/${membershipId}`)
      return
    }

    if (access !== undefined) {
      setHasAccess(access as boolean)
      setCheckingAccess(false)
      
      if (access) {
        fetchContent()
      } else {
        setLoading(false)
      }
    }
  }, [access, isConnected, membershipId, router])

  async function fetchContent() {
    try {
      const res = await fetch(`/api/content?membershipId=${membershipId}`)
      const data = await res.json()
      setContent(data)
    } catch (error) {
      console.error('Error fetching content:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isConnected || checkingAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        </main>
      </div>
    )
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white p-12 rounded-xl shadow-md text-center">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Access Denied</h2>
            <p className="text-gray-600 mb-8">
              You need to be a member to access this content. Please join the membership first.
            </p>
            <Link
              href={`/membership/${membershipId}`}
              className="inline-block px-6 py-3 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 transition"
            >
              Join Membership
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link
            href={`/membership/${membershipId}`}
            className="text-pink-600 hover:text-pink-700 mb-4 inline-block"
          >
            ← Back to Membership
          </Link>
          <h1 className="text-4xl font-bold text-gray-900">Membership Content</h1>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
          </div>
        ) : content.length === 0 ? (
          <div className="bg-white p-12 rounded-xl shadow-md text-center">
            <p className="text-gray-600">No content available yet. Check back later!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {content.map((item) => (
              <div key={item._id} className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-2xl font-semibold mb-3 text-gray-900">{item.title}</h2>
                {item.description && (
                  <p className="text-gray-600 mb-4">{item.description}</p>
                )}
                {item.contentURI && (
                  <div className="mt-4">
                    {item.contentType === 'image' && (
                      <img
                        src={item.contentURI}
                        alt={item.title}
                        className="max-w-full h-auto rounded-lg"
                      />
                    )}
                    {item.contentType === 'video' && (
                      <video controls className="max-w-full rounded-lg">
                        <source src={item.contentURI} />
                      </video>
                    )}
                    {item.contentType === 'file' && (
                      <a
                        href={item.contentURI}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-600 hover:text-pink-700 underline"
                      >
                        Download File
                      </a>
                    )}
                    {item.contentType === 'text' && (
                      <div className="prose max-w-none">
                        <p className="whitespace-pre-wrap">{item.contentURI}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

