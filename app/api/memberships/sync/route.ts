import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Membership from '@/models/Membership'

export const dynamic = 'force-dynamic'

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

    console.log('[SYNC] Syncing membership:', { membershipId, creator, name })

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
      membership.isActive = true // Ensure it's active
      if (totalMembers !== undefined) membership.totalMembers = totalMembers
      await membership.save()
      console.log('[SYNC] Updated existing membership:', membership._id)
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
      console.log('[SYNC] Created new membership:', membership._id, membership.membershipId)
    }

    // Verify it was saved
    const verify = await Membership.findOne({ membershipId })
    if (!verify) {
      console.error('[SYNC] Failed to verify membership was saved')
      return NextResponse.json({ error: 'Failed to save membership' }, { status: 500 })
    }

    console.log('[SYNC] Membership synced successfully:', {
      id: verify._id,
      membershipId: verify.membershipId,
      name: verify.name,
      isActive: verify.isActive
    })

    return NextResponse.json(membership)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}


