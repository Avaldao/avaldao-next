'use client'

import {  projectId, networks } from '@/config'
import { rootstock } from '@reown/appkit/networks'
import { createAppKit } from '@reown/appkit/react'
import React, { type ReactNode } from 'react'

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// Set up metadata
const metadata = {
  name: 'Avaldao Dapp',
  description: 'Avaldao Dapp - Garantias descentralizadas',
  url: 'https://dapp.avaldao.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// Create the modal
export const modal = createAppKit({
  adapters: [],
  projectId,
  networks: networks,
  defaultNetwork: rootstock,
  metadata,
  themeMode: 'light',
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
    socials: [],
    email: false
  },
  themeVariables: {
    '--w3m-accent': '#000000',
  }
})

function AppkitContextProvider({ children }: { children: ReactNode}) {
  return (
    <>{children}</>
  )
}

export default AppkitContextProvider
