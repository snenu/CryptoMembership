'use client'

import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { wagmiConfig, projectId } from '@/lib/web3config'
import { useState, useEffect } from 'react'

let web3ModalInitialized = false

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Initialize Web3Modal only once on client side
    if (typeof window !== 'undefined' && projectId && !web3ModalInitialized) {
      try {
        createWeb3Modal({
          wagmiConfig,
          projectId,
          themeMode: 'light',
          themeVariables: {
            '--w3m-color-mix': '#ec4899',
            '--w3m-color-mix-strength': 20,
          },
          enableAnalytics: false,
          enableOnramp: false,
        })
        web3ModalInitialized = true
      } catch (error) {
        console.error('Error initializing Web3Modal:', error)
      }
    } else if (!projectId) {
      console.warn('WalletConnect Project ID is not configured. Wallet connections may not work properly.')
    }
  }, [])

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {mounted && children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}

