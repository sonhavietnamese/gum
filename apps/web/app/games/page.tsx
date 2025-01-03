'use client'

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

  console.log(profiles)

  const getAddress = async () => {
    const add = wallets?.getAccount()
    console.log(add)
  }

  return (
    <div>
      <h1>Games</h1>

      <button onClick={getAddress}>Get Address</button>

      <Link href='/games/asdsad/design/live'>Game 123</Link>

      <ConnectButton
        chains={[defineChain(28122024)]}
        connectButton={{
          label: 'Sign in to MyApp',
        }}
        client={thirdwebClient}
      />
      <LogOutButton />
    </div>
  )
}
