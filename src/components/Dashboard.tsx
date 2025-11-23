import { useAccount } from 'wagmi'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { WalletConnect } from './WalletConnect'
import { FalconsClub } from './FalconsClub'
import { WhalesClub } from './WhalesClub'
import { useAppStore } from '@/stores/useAppStore'
import { Crown, Fish, ArrowLeft, Sparkles } from 'lucide-react'

export function Dashboard() {
  const { isConnected } = useAccount()
  const { selectedContract, setSelectedContract, error } = useAppStore()

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-green-900 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-12 w-12 text-green-400 mr-3" />
              <h1 className="text-3xl font-bold text-white">Cryptocator</h1>
            </div>
            <p className="text-slate-300 text-lg">
              Connect your wallet to explore our NFT collections
            </p>
          </div>
          <WalletConnect />
        </div>
      </div>
    )
  }

  if (selectedContract === 'falcons') {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-green-900 to-slate-900 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button
              onClick={() => setSelectedContract(null)}
              variant="ghost"
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Collections
            </Button>
          </div>
          <FalconsClub />
        </div>
      </div>
    )
  }

  if (selectedContract === 'whales') {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-cyan-900 to-slate-900 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button
              onClick={() => setSelectedContract(null)}
              variant="ghost"
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Collections
            </Button>
          </div>
          <WhalesClub />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-green-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-16 w-16 text-green-400 mr-4" />
            <h1 className="text-5xl font-bold text-white">Cryptocator</h1>
          </div>
          <p className="text-slate-300 text-xl max-w-2xl mx-auto">
            Discover our exclusive NFT collections on the Ethereum Sepolia testnet
          </p>
        </div>

        {/* Wallet Status */}
        <div className="flex justify-center mb-8">
          <WalletConnect />
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-8 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Collections Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Falcons Club */}
          <Card className="bg-linear-to-br from-green-900/50 to-green-800/50 border-green-500/20 hover:border-green-400/40 transition-all duration-300 cursor-pointer group"
                onClick={() => setSelectedContract('falcons')}>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Crown className="h-16 w-16 text-green-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <CardTitle className="text-2xl text-white group-hover:text-green-200 transition-colors">
                Falcons Club
              </CardTitle>
              <CardDescription className="text-green-200">
                Exclusive NFT collection with presale and whitelist minting
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-2 text-sm text-slate-300">
                <div>7777 Max Supply</div>
                <div>Tiered Pricing System</div>
                <div>Royalty Support</div>
              </div>
              <Button className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white">
                Explore Falcons
              </Button>
            </CardContent>
          </Card>

          {/* Whales Club */}
          <Card className="bg-linear-to-br from-cyan-900/50 to-cyan-800/50 border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 cursor-pointer group"
                onClick={() => setSelectedContract('whales')}>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Fish className="h-16 w-16 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <CardTitle className="text-2xl text-white group-hover:text-cyan-200 transition-colors">
                Whales Club
              </CardTitle>
              <CardDescription className="text-cyan-200">
                Premium NFT collection for Falcon holders with exclusive benefits
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-2 text-sm text-slate-300">
                <div>1520 Max Supply</div>
                <div>Free Claims for Falcons</div>
                <div>Presale Access</div>
              </div>
              <Button className="mt-6 w-full bg-cyan-600 hover:bg-cyan-700 text-white">
                Explore Whales
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-slate-400 text-sm">
          <p>Built on Ethereum Sepolia Testnet • Modern Web3 Interface</p>
        </div>
      </div>
    </div>
  )
}
