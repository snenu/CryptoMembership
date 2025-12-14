import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Member from '@/models/Member'
import User from '@/models/User'

export async function GET(
  request: NextRequest,
  { params }: { params: { membershipId: string } }
) {
  try {
    await connectDB()
    const membershipId = parseInt(params.membershipId)

    // Get all members for this membership
    const members = await Member.find({ membershipId, isActive: true })
      .sort({ joinedAt: -1 })
      .limit(50)

    // Get user details for each member
    const membersWithDetails = await Promise.all(
      members.map(async (member) => {
        const user = await User.findOne({ walletAddress: member.walletAddress })
        return {
          walletAddress: member.walletAddress,
          username: user?.username || null,
          avatar: user?.avatar || null,
          bio: user?.bio || null,
          joinedAt: member.joinedAt,
          tokenId: member.tokenId,
        }
      })
    )

    return NextResponse.json(membersWithDetails)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}


