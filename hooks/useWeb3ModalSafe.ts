'use client'

import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useCallback } from 'react'

/**
 * Safe wrapper for useWeb3Modal that handles errors gracefully
 */
export function useWeb3ModalSafe() {
  const { open } = useWeb3Modal()

  const openModal = useCallback(async () => {
    try {
      await open()
    } catch (error) {
      console.error('Error opening wallet modal:', error)
      // You could show a toast notification here if needed
    }
  }, [open])

  return { open: openModal }
}
