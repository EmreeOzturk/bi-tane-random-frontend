import { useState } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { formatEther } from 'viem'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { useAppStore } from '@/stores/useAppStore'
import { WHALES_CONTRACT_ADDRESS, WHALES_ABI, FALCONS_CONTRACT_ADDRESS, FALCONS_ABI } from '@/lib/contracts'
import { Loader2, Fish, Crown, Info, AlertCircle } from 'lucide-react'

export function WhalesClub() {
  const { address } = useAccount()
  const { setLoading, setError, clearError } = useAppStore()
  const [mintAmount, setMintAmount] = useState(1)

  // Whales contract reads
  const { data: whalesTotalSupply } = useReadContract({
    address: WHALES_CONTRACT_ADDRESS,
    abi: WHALES_ABI,
    functionName: 'totalSupply',
  })

  const { data: whalesMaxSupply } = useReadContract({
    address: WHALES_CONTRACT_ADDRESS,
    abi: WHALES_ABI,
    functionName: 'MAX_SUPPLY',
  })

  const { data: whalesMintPrice } = useReadContract({
    address: WHALES_CONTRACT_ADDRESS,
    abi: WHALES_ABI,
    functionName: 'MINT_PRICE',
  })

  const { data: isWhalesPresaleActive } = useReadContract({
    address: WHALES_CONTRACT_ADDRESS,
    abi: WHALES_ABI,
    functionName: 'IS_PRESALE_ACTIVE',
  })

  const { data: userWhalesBalance } = useReadContract({
    address: WHALES_CONTRACT_ADDRESS,
    abi: WHALES_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  })

  const { data: boughtAmount } = useReadContract({
    address: WHALES_CONTRACT_ADDRESS,
    abi: WHALES_ABI,
    functionName: 'boughtAmount',
    args: address ? [address] : undefined,
  })

  // Falcons contract reads (to check if user owns falcons)
  const { data: userFalconsBalance } = useReadContract({
    address: FALCONS_CONTRACT_ADDRESS,
    abi: FALCONS_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  })

  // Contract writes
  const { writeContract: writePresaleMint, data: presaleMintHash } = useWriteContract()
  const { writeContract: writeFalconsMint, data: falconsMintHash } = useWriteContract()

  // Transaction receipts
  const { isLoading: isPresaleMinting } = useWaitForTransactionReceipt({
    hash: presaleMintHash,
  })

  const { isLoading: isFalconsMinting } = useWaitForTransactionReceipt({
    hash: falconsMintHash,
  })

  const handlePresaleMint = async () => {
    if (!address || !whalesMintPrice) return

    try {
      setLoading(true)
      clearError()

      const totalCost = BigInt(mintAmount) * whalesMintPrice

      writePresaleMint({
        address: WHALES_CONTRACT_ADDRESS,
        abi: WHALES_ABI,
        functionName: 'presaleMint',
        args: [BigInt(mintAmount)],
        value: totalCost,
      })
    } catch (error) {
      console.error('Presale mint error:', error)
      setError(error instanceof Error ? error.message : 'Failed to mint')
    } finally {
      setLoading(false)
    }
  }

  const handleFalconsMint = async () => {
    if (!address) return

    try {
      setLoading(true)
      clearError()

      writeFalconsMint({
        address: WHALES_CONTRACT_ADDRESS,
        abi: WHALES_ABI,
        functionName: 'falconsMint',
      })
    } catch (error) {
      console.error('Falcons mint error:', error)
      setError(error instanceof Error ? error.message : 'Failed to mint')
    } finally {
      setLoading(false)
    }
  }

  const isMinting = isPresaleMinting || isFalconsMinting
  const canPresaleMint = isWhalesPresaleActive && whalesTotalSupply !== undefined && whalesMaxSupply !== undefined && whalesTotalSupply < whalesMaxSupply
  const canFalconsMint = userFalconsBalance && userFalconsBalance > 0 && boughtAmount !== undefined && boughtAmount < userFalconsBalance
  const remainingWhalesSupply = whalesMaxSupply && whalesTotalSupply ? Number(whalesMaxSupply) - Number(whalesTotalSupply) : 0

  return (
    <div className="space-y-6">
      {/* Contract Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fish className="h-5 w-5" />
            Cryptocator Whales
          </CardTitle>
          <CardDescription>
            Exclusive NFT collection for Falcon holders on Sepolia Testnet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold">{whalesTotalSupply?.toString() || '0'}</div>
              <div className="text-muted-foreground">Minted</div>
            </div>
            <div className="text-center">
              <div className="font-semibold">{whalesMaxSupply?.toString() || '0'}</div>
              <div className="text-muted-foreground">Max Supply</div>
            </div>
            <div className="text-center">
              <div className="font-semibold">{remainingWhalesSupply}</div>
              <div className="text-muted-foreground">Remaining</div>
            </div>
            <div className="text-center">
              <div className="font-semibold">{userWhalesBalance?.toString() || '0'}</div>
              <div className="text-muted-foreground">Your NFTs</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Falcons Info */}
      {address && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5" />
              Your Falcons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <span className="font-semibold">{userFalconsBalance?.toString() || '0'}</span> Falcons owned
              {boughtAmount !== undefined && (
                <span className="ml-2 text-muted-foreground">
                  ({boughtAmount.toString()} Whales claimed)
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Minting Section */}
      {address && (
        <Card>
          <CardHeader>
            <CardTitle>Mint Whales</CardTitle>
            <CardDescription>
              Choose your minting method
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Amount:</label>
              <Input
                type="number"
                min="1"
                max="10"
                value={mintAmount}
                onChange={(e) => setMintAmount(Number(e.target.value))}
                className="w-20"
              />
            </div>

            {/* Presale Mint */}
            {canPresaleMint && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Fish className="h-4 w-4" />
                  <span>Presale Mint</span>
                  {whalesMintPrice && (
                    <span className="font-mono">
                      {formatEther(BigInt(mintAmount) * whalesMintPrice)} ETH
                    </span>
                  )}
                </div>
                <Button
                  onClick={handlePresaleMint}
                  disabled={isMinting || mintAmount < 1}
                  className="w-full"
                >
                  {isMinting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Minting...
                    </>
                  ) : (
                    `Mint ${mintAmount} Whale${mintAmount > 1 ? 's' : ''}`
                  )}
                </Button>
              </div>
            )}

            {/* Falcons Mint */}
            {canFalconsMint && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Crown className="h-4 w-4" />
                  <span>Falcons Holder Mint</span>
                  <span className="text-muted-foreground">
                    (Free for Falcon owners)
                  </span>
                </div>
                <Button
                  onClick={handleFalconsMint}
                  disabled={isMinting}
                  variant="outline"
                  className="w-full"
                >
                  {isMinting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Minting...
                    </>
                  ) : (
                    'Claim 1 Whale (Free)'
                  )}
                </Button>
              </div>
            )}

            {!canPresaleMint && !canFalconsMint && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Info className="h-4 w-4" />
                No minting options available at the moment
              </div>
            )}

            {!canFalconsMint && userFalconsBalance === 0n && (
              <div className="flex items-center gap-2 text-sm text-orange-600">
                <AlertCircle className="h-4 w-4" />
                You need to own at least 1 Falcon NFT to claim free Whales
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
