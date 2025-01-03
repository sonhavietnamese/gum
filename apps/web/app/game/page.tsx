'use client'

import { LoginButton } from '@/components/login-button'
import { LogOutButton } from '@/components/logout-button'
import { thirdwebClient } from '@/lib/thirdweb-client'
import Link from 'next/link'
import { defineChain } from 'thirdweb'
import { ConnectButton, useActiveWallet, useProfiles } from 'thirdweb/react'

export default function Page(): JSX.Element {
  const wallets = useActiveWallet()
  const profiles = useProfiles({
    client: thirdwebClient,
  })

  const getAddress = async () => {
    const add = wallets?.getAccount()
    console.log(add)
  }

  return (
    <div>
      <h1>Games</h1>

      <button onClick={getAddress}>Get Address</button>

      <Link href='/game/asdsad/system/currency'>Game 123</Link>

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
  )
}
