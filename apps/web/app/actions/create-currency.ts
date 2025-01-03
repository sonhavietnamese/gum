'use server'

import { ABI } from '@/abis/currency-central'
import { ADDRESSES } from '@/constants'
import { ADMIN_ACCOUNT, viemWalletClient } from '@/lib/viem-client'

export async function createCurrency(name: string, symbol: string, defaultAdmin: string, pauser: string, minter: string) {
  const hash = await viemWalletClient.writeContract({
    address: ADDRESSES.CURRENCY_CENTRAL,
    abi: ABI,
    functionName: 'createCurrency',
    args: [name, symbol, defaultAdmin, pauser, minter],
    account: ADMIN_ACCOUNT,
  })

  return hash
}
