import { http, createConfig } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { metaMask, walletConnect } from 'wagmi/connectors'

const projectId = 'cryptocator-whales-frontend'

export const config = createConfig({
  chains: [sepolia],
  connectors: [
    metaMask(),
    walletConnect({ projectId }),
  ],
  transports: {
    [sepolia.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
