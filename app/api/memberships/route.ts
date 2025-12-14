import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Membership from '@/models/Membership'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const creator = searchParams.get('creator')
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    let query: any = { isActive: true }

    if (creator) {
      query.creator = creator.toLowerCase()
    }

    if (category) {
      query.category = category
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ]
    }

    const memberships = await Membership.find(query).sort({ createdAt: -1 })
    
    // Log for debugging
    console.log(`[API] Returning ${memberships.length} memberships`, {
      creator,
      category,
      search,
      ids: memberships.map(m => m.membershipId)
    })
    
    return NextResponse.json(memberships, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })
  } catch (error: any) {
    console.error('[API] Error fetching memberships:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

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
    } = body

    if (!membershipId || !creator || !name || !description || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const membership = await Membership.create({
      membershipId,
      creator: creator.toLowerCase(),
      name,
      description,
      price,
      isRecurring: isRecurring || false,
      expiryDuration,
      coverImage,
      metadataURI,
      category,
      isActive: true,
      totalMembers: 0,
    })

    return NextResponse.json(membership)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}


