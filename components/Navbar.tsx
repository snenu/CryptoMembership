'use client'

import Link from 'next/link'
import { useAccount } from 'wagmi'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  // Always call hooks (React rules), but use values conditionally
  const { address, isConnected } = useAccount()
  const { open } = useWeb3Modal()

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent">
              🎫 CryptoMembership
            </Link>
            <div className="hidden md:flex space-x-8">
              <Link
                href="/explore"
                className={`${
                  pathname === '/explore' 
                    ? 'text-pink-600 font-semibold border-b-2 border-pink-600' 
                    : 'text-gray-700 hover:text-pink-500'
                } transition pb-1`}
              >
                Explore
              </Link>
              {mounted && isConnected && (
                <>
                  <Link
                    href="/dashboard"
                    className={`${
                      pathname === '/dashboard' 
                        ? 'text-pink-600 font-semibold border-b-2 border-pink-600' 
                        : 'text-gray-700 hover:text-pink-500'
                    } transition pb-1`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/create-membership"
                    className={`${
                      pathname === '/create-membership' 
                        ? 'text-pink-600 font-semibold border-b-2 border-pink-600' 
                        : 'text-gray-700 hover:text-pink-500'
                    } transition pb-1`}
                  >
                    Create
                  </Link>
                  <Link
                    href="/analytics"
                    className={`${
                      pathname === '/analytics' 
                        ? 'text-pink-600 font-semibold border-b-2 border-pink-600' 
                        : 'text-gray-700 hover:text-pink-500'
                    } transition pb-1`}
                  >
                    Analytics
                  </Link>
                </>
              )}
              <Link
                href="/help"
                className={`${
                  pathname === '/help' 
                    ? 'text-pink-600 font-semibold border-b-2 border-pink-600' 
                    : 'text-gray-700 hover:text-pink-500'
                } transition pb-1`}
              >
                Help
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {mounted && isConnected ? (
              <div className="flex items-center space-x-3">
                <Link
                  href="/profile"
                  className="hidden sm:block px-4 py-2 text-gray-700 hover:text-pink-600 transition"
                >
                  Profile
                </Link>
                <Link
                  href="/settings"
                  className="hidden sm:block px-4 py-2 text-gray-700 hover:text-pink-600 transition"
                >
                  Settings
                </Link>
                <button
                  onClick={() => open()}
                  className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg hover:from-pink-600 hover:to-pink-700 transition shadow-md font-medium"
                >
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </button>
              </div>
            ) : (
              <button
                onClick={() => open()}
                className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg hover:from-pink-600 hover:to-pink-700 transition shadow-md font-medium"
              >
                Connect Wallet
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-pink-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-pink-100">
            <div className="flex flex-col space-y-3">
              <Link href="/explore" className="text-gray-700 hover:text-pink-600 px-2 py-1">
                Explore
              </Link>
              {mounted && isConnected && (
                <>
                  <Link href="/dashboard" className="text-gray-700 hover:text-pink-600 px-2 py-1">
                    Dashboard
                  </Link>
                  <Link href="/create-membership" className="text-gray-700 hover:text-pink-600 px-2 py-1">
                    Create
                  </Link>
                  <Link href="/analytics" className="text-gray-700 hover:text-pink-600 px-2 py-1">
                    Analytics
                  </Link>
                  <Link href="/profile" className="text-gray-700 hover:text-pink-600 px-2 py-1">
                    Profile
                  </Link>
                  <Link href="/settings" className="text-gray-700 hover:text-pink-600 px-2 py-1">
                    Settings
                  </Link>
                </>
              )}
              <Link href="/help" className="text-gray-700 hover:text-pink-600 px-2 py-1">
                Help
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

