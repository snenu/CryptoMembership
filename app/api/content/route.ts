import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Content from '@/models/Content'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const membershipId = searchParams.get('membershipId')

    let query: any = {}
    if (membershipId) {
      query.membershipId = parseInt(membershipId)
    }

    const content = await Content.find(query).sort({ createdAt: -1 })
    return NextResponse.json(content)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    const { membershipId, title, description, contentURI, contentType } = body

    if (!membershipId || !title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const content = await Content.create({
      membershipId: parseInt(membershipId),
      title,
      description,
      contentURI,
      contentType: contentType || 'text',
    })

    return NextResponse.json(content)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}


