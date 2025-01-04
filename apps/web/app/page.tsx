'use client'

import { ABI } from '@/abis/game-central'
import { LoginButton } from '@/components/login-button'
import { LogOutButton } from '@/components/logout-button'
import { ADDRESSES } from '@/constants'
import { thirdwebClient } from '@/lib/thirdweb-client'
import { generateGameSlug } from '@/lib/utils'
import { Button } from '@repo/ui/components/button'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { defineChain, getContract, prepareContractCall, PreparedTransaction, PrepareTransactionOptions } from 'thirdweb'
import { ConnectButton, useActiveAccount, useReadContract, useSendTransaction } from 'thirdweb/react'
import { AbiFunction } from 'thirdweb/utils'

const gameCentralContract = getContract({
  client: thirdwebClient,
  address: ADDRESSES.GAME_CENTRAL,
  chain: defineChain(28122024),
  abi: ABI,
})

export default function Page(): JSX.Element {
  const router = useRouter()
  const wallet = useActiveAccount()

  const { refetch } = useReadContract({
    contract: gameCentralContract,
    method: 'getGameByCreator',
    params: [wallet?.address || ''],
  })
  const { mutate: sendTx, data: transactionResult } = useSendTransaction()

  useEffect(() => {
    const getAddress = async () => {
      const add = wallet?.address

      if (add) {
        const res = await refetch()

        if (res.status === 'success') {
          if (res.data.length > 0) {
            router.push(`/game/${res.data[0]?.slug}/system/currency`)
          } else {
            console.log('Creating game')
            const slug = generateGameSlug('My GUM Game')
            console.log(slug)

            const transaction = prepareContractCall({
              contract: gameCentralContract,
              method: 'createGame',
              params: [slug, 'My GUM Game', [wallet?.address]],
            })

            sendTx(transaction as PreparedTransaction<[], AbiFunction, PrepareTransactionOptions>)
          }
        }
      }
    }

    getAddress()
  }, [wallet, transactionResult])

  const fetchGames = async () => {
    const res = await refetch()
    console.log(res)
  }

  return (
    <div className='w-screen h-screen bg-background text-primary-foreground'>
      <Button>Hey</Button>

      <Button onClick={fetchGames}>Fetch Games</Button>

      <div className='flex flex-col gap-2 text-white'>
        <ConnectButton
          chains={[defineChain(28122024)]}
          connectButton={{
            label: 'Sign in to MyApp',
          }}
          client={thirdwebClient}
          accountAbstraction={{
            chain: defineChain(28122024), // the chain where your smart accounts will be or is deployed
            sponsorGas: true, // enable or disable sponsored transactions
          }}
        />
        <LoginButton />
        <LogOutButton />
      </div>
    </div>
  )
}
