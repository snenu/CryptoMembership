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
    const secret = process.env.SIDESHIFT_SECRET
    const affiliateId = process.env.SIDESHIFT_AFFILIATE_ID
    
    if (!secret || !affiliateId) {
      console.error('SideShift credentials not configured', {
        hasSecret: !!secret,
        hasAffiliateId: !!affiliateId,
        secretLength: secret?.length || 0,
        affiliateIdLength: affiliateId?.length || 0
      })
      return NextResponse.json(
        { 
          error: 'SideShift API credentials not configured. Please check environment variables.',
          debug: {
            hasSecret: !!secret,
            hasAffiliateId: !!affiliateId
          }
        },
        { status: 500 }
      )
    }

    const order = await createSideShiftOrder(depositCoin, settleCoin, settleAddress, settleAmount)
    return NextResponse.json(order)
  } catch (error: any) {
    console.error('SideShift API Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      statusText: error.response?.statusText
    })
    
    const errorMessage = error.response?.data?.message || error.message || 'Failed to create SideShift order'
    const errorDetails = error.response?.data || null
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: errorDetails,
        statusCode: error.response?.status
      },
      { status: 500 }
    )
  }
}

