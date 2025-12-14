'use client'

import Link from 'next/link'

interface MemberCardProps {
  walletAddress: string
  username?: string
  avatar?: string
  bio?: string
  joinedAt?: string
}

export default function MemberCard({ walletAddress, username, avatar, bio, joinedAt }: MemberCardProps) {
  const displayName = username || `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
  
  return (
    <Link
      href={`/profile?address=${walletAddress}`}
      className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-pink-100 hover:border-pink-300 hover:shadow-md transition"
    >
      <div className="flex-shrink-0">
        {avatar ? (
          <img
            src={avatar}
            alt={displayName}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white font-semibold">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-gray-900 truncate">{displayName}</div>
        {bio && (
          <div className="text-sm text-gray-600 truncate">{bio}</div>
        )}
        {joinedAt && (
          <div className="text-xs text-gray-500">Joined {new Date(joinedAt).toLocaleDateString()}</div>
        )}
      </div>
    </Link>
  )
}


