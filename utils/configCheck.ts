/**
 * Utility to check API key configuration
 * This helps identify missing or misconfigured environment variables
 */

export interface ConfigStatus {
  key: string
  configured: boolean
  message: string
}

export function checkApiKeys(): ConfigStatus[] {
  const checks: ConfigStatus[] = []

  // WalletConnect
  const walletConnectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || process.env.NEXT_PUBLIC_WC_PROJECT_ID
  checks.push({
    key: 'WalletConnect Project ID',
    configured: !!walletConnectId,
    message: walletConnectId ? 'Configured' : 'Missing NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID'
  })

  // Polygon RPC
  const polygonRpc = process.env.NEXT_PUBLIC_POLYGON_AMOY_RPC || process.env.POLYGON_AMOY_RPC
  checks.push({
    key: 'Polygon RPC URL',
    configured: !!polygonRpc,
    message: polygonRpc ? 'Configured' : 'Missing NEXT_PUBLIC_POLYGON_AMOY_RPC'
  })

  // Contract Address
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
  checks.push({
    key: 'Contract Address',
    configured: !!contractAddress && contractAddress !== '0x0',
    message: contractAddress && contractAddress !== '0x0' ? 'Configured' : 'Missing NEXT_PUBLIC_CONTRACT_ADDRESS'
  })

  // MongoDB
  const mongodbUri = process.env.MONGODB_URI
  checks.push({
    key: 'MongoDB URI',
    configured: !!mongodbUri,
    message: mongodbUri ? 'Configured' : 'Missing MONGODB_URI'
  })

  // Pinata
  const pinataKey = process.env.PINATA_API_KEY
  const pinataSecret = process.env.PINATA_SECRET_KEY
  checks.push({
    key: 'Pinata API Keys',
    configured: !!pinataKey && !!pinataSecret,
    message: pinataKey && pinataSecret ? 'Configured' : 'Missing PINATA_API_KEY or PINATA_SECRET_KEY'
  })

  // SideShift
  const sideshiftSecret = process.env.SIDESHIFT_SECRET
  const sideshiftAffiliate = process.env.SIDESHIFT_AFFILIATE_ID
  checks.push({
    key: 'SideShift API Keys',
    configured: !!sideshiftSecret && !!sideshiftAffiliate,
    message: sideshiftSecret && sideshiftAffiliate ? 'Configured' : 'Missing SIDESHIFT_SECRET or SIDESHIFT_AFFILIATE_ID'
  })

  return checks
}

export function getMissingKeys(): string[] {
  const checks = checkApiKeys()
  return checks
    .filter(check => !check.configured)
    .map(check => check.key)
}
