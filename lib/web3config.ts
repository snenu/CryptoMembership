import { createConfig, http } from 'wagmi'
import { polygonAmoy } from 'wagmi/chains'
import { walletConnect, injected } from 'wagmi/connectors'
import { createWeb3Modal } from '@web3modal/wagmi/react'

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ''

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
    walletConnect({ 
      projectId, 
      metadata, 
      showQrModal: false,
    }),
    injected({ shimDisconnect: true }),
  ],
  transports: {
    [polygonAmoy.id]: http(process.env.NEXT_PUBLIC_POLYGON_AMOY_RPC || process.env.POLYGON_AMOY_RPC || ''),
  },
  ssr: true, // Enable SSR support
})

// Initialize Web3Modal on client side only
if (typeof window !== 'undefined') {
  createWeb3Modal({
    wagmiConfig,
    projectId,
    themeMode: 'light',
    themeVariables: {
      '--w3m-color-mix': '#ec4899',
      '--w3m-color-mix-strength': 20,
    },
  })
}

