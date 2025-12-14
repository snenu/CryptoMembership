import { NextRequest, NextResponse } from 'next/server'
import { getSideShiftOrderStatus } from '@/utils/sideshift'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
    }

    // Validate SideShift credentials
    if (!process.env.SIDESHIFT_SECRET || !process.env.SIDESHIFT_AFFILIATE_ID) {
      console.error('SideShift credentials not configured')
      return NextResponse.json(
        { error: 'SideShift API credentials not configured. Please check environment variables.' },
        { status: 500 }
      )
    }

    const order = await getSideShiftOrderStatus(orderId)
    return NextResponse.json(order)
  } catch (error: any) {
    console.error('SideShift status API Error:', error)
    const errorMessage = error.response?.data?.message || error.message || 'Failed to get order status'
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error.response?.data || null
      },
      { status: 500 }
    )
  }
}


