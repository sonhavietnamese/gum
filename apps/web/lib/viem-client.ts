import { createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { ancient8Sepolia } from 'viem/chains'

export const ADMIN_ACCOUNT = privateKeyToAccount(process.env.PRIVATE_KEY)

export const viemWalletClient = createWalletClient({
  chain: ancient8Sepolia,
  transport: http(),
})
