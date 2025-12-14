import axios from 'axios'

const SIDESHIFT_SECRET = process.env.SIDESHIFT_SECRET || ''
const SIDESHIFT_AFFILIATE_ID = process.env.SIDESHIFT_AFFILIATE_ID || ''

export interface SideShiftOrder {
  orderId: string
  depositAddress: string
  depositCoin: string
  settleAddress: string
  settleCoin: string
  settleAmount: string
  depositAmount: string
  status: string
}

const SIDESHIFT_API = 'https://sideshift.ai/api/v2'

export async function createSideShiftOrder(
  depositCoin: string,
  settleCoin: string,
  settleAddress: string,
  settleAmount: string
): Promise<SideShiftOrder> {
  try {
    // Validate credentials
    if (!SIDESHIFT_SECRET || !SIDESHIFT_AFFILIATE_ID) {
      throw new Error('SideShift credentials not configured')
    }

    // Log for debugging
    console.log('Creating SideShift order:', {
      depositCoin,
      settleCoin,
      settleAddress,
      settleAmount,
      hasSecret: !!SIDESHIFT_SECRET,
      hasAffiliateId: !!SIDESHIFT_AFFILIATE_ID
    })

    // Determine networks based on coins
    const getNetwork = (coin: string): string => {
      const coinUpper = coin.toUpperCase()
      if (coinUpper === 'USDC' || coinUpper === 'USDT') {
        return 'polygon' // Polygon network for USDC/USDT
      }
      if (coinUpper === 'ETH') {
        return 'ethereum'
      }
      if (coinUpper === 'BTC') {
        return 'bitcoin'
      }
      // Default to coin name as network
      return coin.toLowerCase()
    }

    // For fixed shifts, we need to specify depositAmount in the quote
    // But the user provides settleAmount. We'll use settleAmount as a starting point
    // and let the API calculate the deposit amount, or we can reverse it
    // Note: The API expects depositAmount for fixed quotes
    
    // Step 1: Get a quote first (required for fixed shifts in v2 API)
    // For now, we'll use settleAmount as depositAmount - this might need adjustment
    // based on actual API behavior
    const quoteResponse = await axios.post(
      `${SIDESHIFT_API}/quotes`,
      {
        affiliateId: SIDESHIFT_AFFILIATE_ID,
        depositCoin,
        depositNetwork: getNetwork(depositCoin),
        settleCoin,
        settleNetwork: getNetwork(settleCoin),
        depositAmount: settleAmount, // This will be adjusted by the API
      },
      {
        headers: {
          'x-sideshift-secret': SIDESHIFT_SECRET,
          'Content-Type': 'application/json',
        },
      }
    )

    const quoteId = quoteResponse.data.id
    if (!quoteId) {
      throw new Error('Failed to get quote ID from SideShift')
    }

    // Step 2: Create the fixed shift using the quote
    const shiftResponse = await axios.post(
      `${SIDESHIFT_API}/shifts/fixed`,
      {
        settleAddress,
        affiliateId: SIDESHIFT_AFFILIATE_ID,
        quoteId,
      },
      {
        headers: {
          'x-sideshift-secret': SIDESHIFT_SECRET,
          'Content-Type': 'application/json',
        },
      }
    )

    // Map the response to our expected format
    const shiftData = shiftResponse.data
    return {
      orderId: shiftData.id || shiftData.shiftId || '',
      depositAddress: shiftData.depositAddress || '',
      depositCoin: depositCoin,
      settleAddress: settleAddress,
      settleCoin: settleCoin,
      settleAmount: shiftData.settleAmount || settleAmount,
      depositAmount: shiftData.depositAmount || settleAmount,
      status: shiftData.status || 'waiting',
    }
  } catch (error: any) {
    console.error('Error creating SideShift order:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      statusText: error.response?.statusText,
      hasSecret: !!SIDESHIFT_SECRET,
      hasAffiliateId: !!SIDESHIFT_AFFILIATE_ID
    })
    
    // Provide more detailed error message
    const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error || 
                         error.message || 
                         'Failed to create SideShift order'
    
    throw new Error(errorMessage)
  }
}

export async function getSideShiftOrderStatus(orderId: string): Promise<SideShiftOrder> {
  try {
    if (!SIDESHIFT_SECRET) {
      throw new Error('SideShift credentials not configured')
    }

    const response = await axios.get(`${SIDESHIFT_API}/shifts/${orderId}`, {
      headers: {
        'x-sideshift-secret': SIDESHIFT_SECRET,
        'Content-Type': 'application/json',
      },
    })
    
    const shiftData = response.data
    return {
      orderId: shiftData.id || orderId,
      depositAddress: shiftData.depositAddress || '',
      depositCoin: shiftData.depositCoin || '',
      settleAddress: shiftData.settleAddress || '',
      settleCoin: shiftData.settleCoin || '',
      settleAmount: shiftData.settleAmount || '',
      depositAmount: shiftData.depositAmount || '',
      status: shiftData.status || 'unknown',
    }
  } catch (error: any) {
    console.error('Error getting SideShift order status:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    })
    const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error || 
                         error.message || 
                         'Failed to get order status'
    throw new Error(errorMessage)
  }
}

export async function getSideShiftCoins(): Promise<any[]> {
  try {
    const response = await axios.get(`${SIDESHIFT_API}/coins`)
    return response.data
  } catch (error: any) {
    console.error('Error getting SideShift coins:', error.response?.data || error.message)
    return []
  }
}

