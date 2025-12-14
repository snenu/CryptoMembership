import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Membership from '@/models/Membership'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    const {
      membershipId,
      creator,
      name,
      description,
      price,
      isRecurring,
      expiryDuration,
      coverImage,
      metadataURI,
      category,
      totalMembers,
    } = body

    if (!membershipId || !creator) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Find or create membership
    let membership = await Membership.findOne({ membershipId })
    
    if (membership) {
      // Update existing
      membership.name = name || membership.name
      membership.description = description || membership.description
      membership.price = price || membership.price
      membership.isRecurring = isRecurring !== undefined ? isRecurring : membership.isRecurring
      membership.expiryDuration = expiryDuration || membership.expiryDuration
      membership.coverImage = coverImage || membership.coverImage
      membership.metadataURI = metadataURI || membership.metadataURI
      membership.category = category || membership.category
      if (totalMembers !== undefined) membership.totalMembers = totalMembers
      await membership.save()
    } else {
      // Create new
      membership = await Membership.create({
        membershipId,
        creator: creator.toLowerCase(),
        name: name || `Membership #${membershipId}`,
        description: description || '',
        price: price || 0,
        isRecurring: isRecurring || false,
        expiryDuration,
        coverImage,
        metadataURI,
        category,
        isActive: true,
        totalMembers: totalMembers || 0,
      })
    }

    return NextResponse.json(membership)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}


