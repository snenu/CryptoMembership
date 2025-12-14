import { createConfig, http } from 'wagmi'
import { polygonAmoy } from 'wagmi/chains'
import { walletConnect, injected } from 'wagmi/connectors'

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || process.env.NEXT_PUBLIC_WC_PROJECT_ID || ''

const metadata = {
  name: 'CryptoMembership',
  description: 'Decentralized Membership Platform',
  url: 'https://cryptomembership.xyz',
  icons: ['https://cryptomembership.xyz/logo.png']
}

const chains = [polygonAmoy] as const

export const wagmiConfig = createConfig({
  chains,
  connectors: [
    injected({ shimDisconnect: true }),
    ...(projectId ? [walletConnect({ 
      projectId, 
      metadata, 
      showQrModal: false,
    })] : []),
  ],
  transports: {
    [polygonAmoy.id]: http(process.env.NEXT_PUBLIC_POLYGON_AMOY_RPC || process.env.POLYGON_AMOY_RPC || 'https://rpc-amoy.polygon.technology'),
  },
  ssr: true, // Enable SSR support
})

// Export projectId for Web3Modal initialization
export { projectId }

