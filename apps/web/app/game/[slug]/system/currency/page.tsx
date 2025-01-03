'use client'

import { ADDRESSES } from '@/constants'
import { thirdwebClient } from '@/lib/thirdweb-client'
import { Button } from '@repo/ui/components/button'
import { useEffect } from 'react'
import { defineChain, getContract, prepareContractCall } from 'thirdweb'
import { useActiveAccount, useReadContract, useSendTransaction } from 'thirdweb/react'

const contract = getContract({
  client: thirdwebClient,
  address: ADDRESSES.CURRENCY_CENTRAL,
  chain: defineChain(28122024),
})

export default function Page(): JSX.Element {
  const account = useActiveAccount()
  const { data, isLoading, refetch } = useReadContract({
    contract,
    method: 'function getUserCurrencies(address user) external view returns (address[] memory)',
    params: [account?.address || ''],
  })
  const { mutate: sendTx, data: transactionResult } = useSendTransaction()

  const testCreateCurrency = async () => {
    if (!account) return

    const transaction = prepareContractCall({
      contract,
      method: 'function createCurrency(string name, string symbol, address defaultAdmin, address pauser, address minter)',
      params: ['Test', 'TEST', account.address, account.address, account.address],
    })
    sendTx(transaction)
  }

  useEffect(() => {
    const handle = async () => {
      if (transactionResult) {
        console.log(transactionResult)
        const res = await refetch()

        console.log(res.data)
      }
    }
    handle()
  }, [transactionResult])

  return (
    <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
      <div className='grid auto-rows-min gap-4 md:grid-cols-3'>
        <div className='aspect-video rounded-xl bg-muted/50'>
          <Button onClick={testCreateCurrency}>Create Currency</Button>
        </div>
        <div className='aspect-video rounded-xl bg-muted/50' />
        <div className='aspect-video rounded-xl bg-muted/50' />
      </div>
      <div className='min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min' />
    </div>
  )
}
