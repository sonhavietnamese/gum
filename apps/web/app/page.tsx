'use client'

import { thirdwebClient } from '@/lib/thirdweb-client'
import { Button } from '@repo/ui/components/button'
import { defineChain } from 'thirdweb'
import { ChainName, ConnectButton, useChainMetadata } from 'thirdweb/react'
import { generatePayload, isLoggedIn, login, logout } from './actions/auth'

export default function Page(): JSX.Element {
  const { data: chainMetadata } = useChainMetadata(defineChain(28122024))

  return (
    <div className='w-screen h-screen bg-background text-primary-foreground'>
      {/* <div className='w-[200px] h-[200px] bg-primary'></div> */}

      <Button>Hey</Button>

      <ConnectButton
        client={thirdwebClient}
        auth={{
          isLoggedIn: async (address) => {
            console.log('checking if logged in!', { address })
            return await isLoggedIn()
          },
          doLogin: async (params) => {
            console.log('logging in!')
            await login(params)
          },
          getLoginPayload: async ({ address }) => generatePayload({ address }),
          doLogout: async () => {
            console.log('logging out!')
            await logout()
          },
        }}
      />
    </div>
  )
}
