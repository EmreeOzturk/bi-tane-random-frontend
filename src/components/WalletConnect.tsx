import { useEffect } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { useAppStore } from '@/stores/useAppStore'
import { Wallet, LogOut, AlertCircle } from 'lucide-react'

export function WalletConnect() {
  const { connectors, connect, status, error } = useConnect()
  const { disconnect } = useDisconnect()
  const { address, isConnected } = useAccount()
  const { setWalletConnection, setError, clearError } = useAppStore()

  useEffect(() => {
    setWalletConnection(isConnected, address || null, null)
    if (error) {
      setError(error.message)
    } else {
      clearError()
    }
  }, [isConnected, address, error, setWalletConnection, setError, clearError])

  const handleConnect = (connectorId: string) => {
    const connector = connectors.find(c => c.id === connectorId)
    if (connector) {
      connect({ connector })
    }
  }

  const handleDisconnect = () => {
    disconnect()
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (isConnected && address) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet Connected
          </CardTitle>
          <CardDescription>
            Sepolia Testnet
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm font-mono bg-muted p-2 rounded">
            {formatAddress(address)}
          </div>
          <Button
            onClick={handleDisconnect}
            variant="outline"
            className="w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Disconnect
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Connect Wallet
        </CardTitle>
        <CardDescription>
          Connect your wallet to interact with the contracts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {connectors.map((connector) => (
          <Button
            key={connector.id}
            onClick={() => handleConnect(connector.id)}
            className="w-full"
            variant="outline"
          >
            {connector.name}
          </Button>
        ))}

        {status === 'pending' && (
          <div className="text-sm text-muted-foreground text-center">
            Connecting...
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            {error.message}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
