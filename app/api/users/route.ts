import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get('walletAddress')

    if (walletAddress) {
      const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() })
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }
      return NextResponse.json(user)
    }

    const users = await User.find({})
    return NextResponse.json(users)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    const { walletAddress, username, bio, avatar } = body

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 })
    }

    let user = await User.findOne({ walletAddress: walletAddress.toLowerCase() })
    
    if (user) {
      // Update existing user
      if (username) user.username = username
      if (bio !== undefined) user.bio = bio
      if (avatar) user.avatar = avatar
      await user.save()
    } else {
      // Create new user
      user = await User.create({
        walletAddress: walletAddress.toLowerCase(),
        username,
        bio,
        avatar,
        isCreator: false,
      })
    }

    return NextResponse.json(user)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}


