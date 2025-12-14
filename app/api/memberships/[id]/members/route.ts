import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { useReadContract } from 'wagmi'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const membershipId = parseInt(params.id)
    
    // Get membership from blockchain to get all token holders
    // For now, we'll return users who have this membership
    // In production, you'd query the blockchain for NFT holders
    
    // Get all users (in production, filter by membership NFT ownership)
    const users = await User.find({}).limit(50)
    
    // Return users with basic info
    const members = users.map(user => ({
      walletAddress: user.walletAddress,
      username: user.username || `User ${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}`,
      avatar: user.avatar,
      bio: user.bio,
    }))
    
    return NextResponse.json(members)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

