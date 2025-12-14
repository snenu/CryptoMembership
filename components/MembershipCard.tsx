'use client'

import Link from 'next/link'
import { Membership } from '@/types'

interface MembershipCardProps {
  membership: Membership
}

export default function MembershipCard({ membership }: MembershipCardProps) {
  return (
    <Link
      href={`/membership/${membership.membershipId}`}
      className="block bg-white rounded-2xl shadow-md overflow-hidden card-hover group"
    >
      {membership.coverImage ? (
        <div className="relative h-48 overflow-hidden">
          <img
            src={membership.coverImage}
            alt={membership.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-sm font-semibold text-pink-600">
              {membership.totalMembers || 0} members
            </span>
          </div>
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-br from-pink-100 to-pink-50 flex items-center justify-center">
          <div className="text-6xl">🎫</div>
        </div>
      )}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-pink-600 transition-colors line-clamp-2">
            {membership.name}
          </h3>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[40px]">
          {membership.description}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-pink-100">
          <div>
            <div className="text-2xl font-bold text-pink-600">
              ${membership.price}
              {membership.isRecurring && (
                <span className="text-sm text-gray-500 font-normal">/mo</span>
              )}
            </div>
          </div>
          {membership.category && (
            <span className="px-3 py-1 bg-pink-100 text-pink-700 text-xs font-semibold rounded-full">
              {membership.category}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}


