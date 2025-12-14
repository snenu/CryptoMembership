import { NextRequest, NextResponse } from 'next/server'
import { createSideShiftOrder } from '@/utils/sideshift'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { depositCoin, settleCoin, settleAddress, settleAmount } = body

    if (!depositCoin || !settleCoin || !settleAddress || !settleAmount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate SideShift credentials
    if (!process.env.SIDESHIFT_SECRET || !process.env.SIDESHIFT_AFFILIATE_ID) {
      console.error('SideShift credentials not configured')
      return NextResponse.json(
        { error: 'SideShift API credentials not configured. Please check environment variables.' },
        { status: 500 }
      )
    }

    const order = await createSideShiftOrder(depositCoin, settleCoin, settleAddress, settleAmount)
    return NextResponse.json(order)
  } catch (error: any) {
    console.error('SideShift API Error:', error)
    const errorMessage = error.response?.data?.message || error.message || 'Failed to create SideShift order'
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error.response?.data || null
      },
      { status: 500 }
    )
  }
}

