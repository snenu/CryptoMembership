import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Member from '@/models/Member'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    const { membershipId, walletAddress, tokenId, expiresAt } = body

    if (!membershipId || !walletAddress) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if member already exists
    let member = await Member.findOne({
      membershipId,
      walletAddress: walletAddress.toLowerCase(),
    })

    if (member) {
      // Update existing member
      member.isActive = true
      if (tokenId) member.tokenId = tokenId
      if (expiresAt) member.expiresAt = expiresAt
      await member.save()
    } else {
      // Create new member
      member = await Member.create({
        membershipId,
        walletAddress: walletAddress.toLowerCase(),
        tokenId,
        expiresAt,
        isActive: true,
      })
    }

    return NextResponse.json(member)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}


