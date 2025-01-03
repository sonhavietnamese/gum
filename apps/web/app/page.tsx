'use client'

import { LoginButton } from '@/components/login-button'
import { LogOutButton } from '@/components/logout-button'
import { thirdwebClient } from '@/lib/thirdweb-client'
import { Button } from '@repo/ui/components/button'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { defineChain } from 'thirdweb'
import { ConnectButton, useActiveWallet, useChainMetadata } from 'thirdweb/react'

export default function Page(): JSX.Element {
  const { data: chainMetadata } = useChainMetadata(defineChain(28122024))

  const router = useRouter()
  const wallet = useActiveWallet()

  console.log(wallet)

  useEffect(() => {
    const getAddress = async () => {
      const add = await wallet?.getAccount()

      if (add) {
        router.push(`/game/${add}/system/currency`)
      }
    }

    getAddress()
  }, [wallet])

  return (
    <div className='w-screen h-screen bg-background text-primary-foreground'>
      {/* <div className='w-[200px] h-[200px] bg-primary'></div> */}

      <Button>Hey</Button>

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
