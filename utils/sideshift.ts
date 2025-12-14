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
    const response = await axios.post(
      `${SIDESHIFT_API}/orders`,
      {
        type: 'fixed',
        depositCoin,
        settleCoin,
        settleAddress,
        settleAmount,
        affiliateId: SIDESHIFT_AFFILIATE_ID,
      },
      {
        headers: {
          'x-sideshift-secret': SIDESHIFT_SECRET,
          'Content-Type': 'application/json',
        },
      }
    )
    return response.data
  } catch (error: any) {
    console.error('Error creating SideShift order:', error.response?.data || error.message)
    throw new Error(error.response?.data?.message || 'Failed to create SideShift order')
  }
}

export async function getSideShiftOrderStatus(orderId: string): Promise<SideShiftOrder> {
  try {
    const response = await axios.get(`${SIDESHIFT_API}/orders/${orderId}`, {
      headers: {
        'x-sideshift-secret': SIDESHIFT_SECRET,
      },
    })
    return response.data
  } catch (error: any) {
    console.error('Error getting SideShift order status:', error.response?.data || error.message)
    throw new Error(error.response?.data?.message || 'Failed to get order status')
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

