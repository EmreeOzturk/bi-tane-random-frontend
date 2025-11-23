import { useState } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { formatEther } from 'viem'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { useAppStore } from '@/stores/useAppStore'
import { FALCONS_CONTRACT_ADDRESS, FALCONS_ABI } from '@/lib/contracts'
import { Loader2, Coins, Users, Crown, Info } from 'lucide-react'

export function FalconsClub() {
  const { address } = useAccount()
  const { setLoading, setError, clearError } = useAppStore()
  const [mintAmount, setMintAmount] = useState(1)

  // Contract reads
  const { data: totalSupply } = useReadContract({
    address: FALCONS_CONTRACT_ADDRESS,
    abi: FALCONS_ABI,
    functionName: 'totalSupply',
  })

  const { data: maxSupply } = useReadContract({
    address: FALCONS_CONTRACT_ADDRESS,
    abi: FALCONS_ABI,
    functionName: 'MAX_SUPPLY',
  })


  const { data: isPresaleActive } = useReadContract({
    address: FALCONS_CONTRACT_ADDRESS,
    abi: FALCONS_ABI,
    functionName: 'IS_PRESALE_ACTIVE',
  })

  const { data: isWhitelistActive } = useReadContract({
    address: FALCONS_CONTRACT_ADDRESS,
    abi: FALCONS_ABI,
    functionName: 'IS_WHITELIST_ACTIVE',
  })

  const { data: whitelistAmount } = useReadContract({
    address: FALCONS_CONTRACT_ADDRESS,
    abi: FALCONS_ABI,
    functionName: 'whitelist',
    args: address ? [address] : undefined,
  })

  const { data: userBalance } = useReadContract({
    address: FALCONS_CONTRACT_ADDRESS,
    abi: FALCONS_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  })

  const { data: totalCost } = useReadContract({
    address: FALCONS_CONTRACT_ADDRESS,
    abi: FALCONS_ABI,
    functionName: 'getTotalCost',
    args: totalSupply && mintAmount ? [totalSupply, BigInt(mintAmount)] : undefined,
  })

  // Contract writes
  const { writeContract: writePresaleMint, data: presaleMintHash } = useWriteContract()
  const { writeContract: writeWhitelistMint, data: whitelistMintHash } = useWriteContract()

  // Transaction receipts
  const { isLoading: isPresaleMinting } = useWaitForTransactionReceipt({
    hash: presaleMintHash,
  })

  const { isLoading: isWhitelistMinting } = useWaitForTransactionReceipt({
    hash: whitelistMintHash,
  })

  const handlePresaleMint = async () => {

    console.log("address",address)
    console.log("ttcost",totalCost)
    if (!address ) return


    console.log("asdad")
    try {
      setLoading(true)
      clearError()

      writePresaleMint({
        address: FALCONS_CONTRACT_ADDRESS,
        abi: FALCONS_ABI,
        functionName: 'presaleMint',
        args: [BigInt(mintAmount)],
        value: 0n,
      })
    } catch (error) {
      console.error('Presale mint error:', error)
      setError(error instanceof Error ? error.message : 'Failed to mint')
    } finally {
      setLoading(false)
    }
  }

  const handleWhitelistMint = async () => {
    if (!address) return

    try {
      setLoading(true)
      clearError()

      writeWhitelistMint({
        address: FALCONS_CONTRACT_ADDRESS,
        abi: FALCONS_ABI,
        functionName: 'whitelistMint',
        args: [BigInt(mintAmount)],
      })
    } catch (error) {
      console.error('Whitelist mint error:', error)
      setError(error instanceof Error ? error.message : 'Failed to mint')
    } finally {
      setLoading(false)
    }
  }

  const isMinting = isPresaleMinting || isWhitelistMinting
  const canPresaleMint = isPresaleActive && totalSupply !== undefined && maxSupply !== undefined && totalSupply < maxSupply
  const canWhitelistMint = isWhitelistActive && whitelistAmount && whitelistAmount >= BigInt(mintAmount)
  const remainingSupply = maxSupply && totalSupply ? Number(maxSupply) - Number(totalSupply) : 0

  return (
    <div className="space-y-6">
      {/* Contract Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Cryptocator Falcons Club
          </CardTitle>
          <CardDescription>
            Exclusive NFT collection on Sepolia Testnet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold">{totalSupply?.toString() || '0'}</div>
              <div className="text-muted-foreground">Minted</div>
            </div>
            <div className="text-center">
              <div className="font-semibold">{maxSupply?.toString() || '0'}</div>
              <div className="text-muted-foreground">Max Supply</div>
            </div>
            <div className="text-center">
              <div className="font-semibold">{remainingSupply}</div>
              <div className="text-muted-foreground">Remaining</div>
            </div>
            <div className="text-center">
              <div className="font-semibold">{userBalance?.toString() || '0'}</div>
              <div className="text-muted-foreground">Your NFTs</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Minting Section */}
      {address && (
        <Card>
          <CardHeader>
            <CardTitle>Mint Falcons</CardTitle>
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
                  <Coins className="h-4 w-4" />
                  <span>Presale Mint</span>
                  {totalCost && (
                    <span className="font-mono">
                      {formatEther(totalCost)} ETH
                    </span>
                  )}
                </div>
                <Button
                  onClick={handlePresaleMint}
                  disabled={isMinting || mintAmount < 1}
                  className="w-full bg-red-950 cursor-pointer"
                >
                  {isMinting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Minting...
                    </>
                  ) : (
                    `Mint ${mintAmount} Falcon${mintAmount > 1 ? 's' : ''}`
                  )}
                </Button>
              </div>
            )}

            {/* Whitelist Mint */}
            {canWhitelistMint && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4" />
                  <span>Whitelist Mint</span>
                  <span className="text-muted-foreground">
                    ({whitelistAmount?.toString()} remaining)
                  </span>
                </div>
                <Button
                  onClick={handleWhitelistMint}
                  disabled={isMinting || mintAmount < 1}
                  variant="outline"
                  className="w-full"
                >
                  {isMinting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Minting...
                    </>
                  ) : (
                    `Mint ${mintAmount} Falcon${mintAmount > 1 ? 's' : ''}`
                  )}
                </Button>
              </div>
            )}

            {!canPresaleMint && !canWhitelistMint && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Info className="h-4 w-4" />
                No minting options available at the moment
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
