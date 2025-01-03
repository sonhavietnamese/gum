import { LogOutButton } from '@/components/logout-button'
import { thirdwebClient } from '@/lib/thirdweb-client'
import { ChainName, ConnectButton } from 'thirdweb/react'

export default async function Page(): Promise<JSX.Element> {
  return (
    <div>
      <h1>Games</h1>

      <ChainName />
      <ConnectButton
        connectButton={{
          label: 'Sign in to MyApp',
        }}
        client={thirdwebClient}
      />
      <LogOutButton />
    </div>
  )
}
