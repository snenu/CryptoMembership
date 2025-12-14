import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Membership from '@/models/Membership'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const byId = searchParams.get('byId') === 'true'
    
    let membership
    if (byId) {
      membership = await Membership.findOne({ membershipId: parseInt(params.id) })
    } else {
      membership = await Membership.findById(params.id)
    }
    
    if (!membership) {
      return NextResponse.json({ error: 'Membership not found' }, { status: 404 })
    }

    return NextResponse.json(membership)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const body = await request.json()
    const membership = await Membership.findOneAndUpdate(
      { membershipId: parseInt(params.id) },
      body,
      { new: true }
    )

    if (!membership) {
      return NextResponse.json({ error: 'Membership not found' }, { status: 404 })
    }

    return NextResponse.json(membership)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

