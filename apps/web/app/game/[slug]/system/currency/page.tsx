'use client'

import { ADDRESSES } from '@/constants'
import { thirdwebClient } from '@/lib/thirdweb-client'
import { generateAvatar } from '@/lib/utils'
import { Button } from '@repo/ui/components/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@repo/ui/components/dialog'
import { Input } from '@repo/ui/components/input'
import { Label } from '@repo/ui/components/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/tabs'
import { Container, Copy, LoaderCircle, Plus, UserRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import { defineChain, getContract, prepareContractCall } from 'thirdweb'
import { TokenName, TokenProvider, TokenSymbol, useActiveAccount, useReadContract, useSendTransaction } from 'thirdweb/react'

const contract = getContract({
  client: thirdwebClient,
  address: ADDRESSES.CURRENCY_CENTRAL_PROXY,
  chain: defineChain(28122024),
})

const MOCK_CURRENCIES = [
  {
    name: 'Star Shards',
    symbol: 'SSD',
    address: '0x13f26C1dc0C983cC6AceaAF753f98aD58155A99B',
    holders: 2832,
    supply: 1000000,
    status: 'development',
  },
  {
    name: 'Harmony Stones',
    symbol: 'STONE',
    address: '0x5e987FD483a418aA1cc3Ae78eB3C0EE661Bd32e3',
    holders: 1770,
    supply: 1000000,
    status: 'development',
  },
]

export default function Page(): JSX.Element {
  const account = useActiveAccount()
  const { refetch: fetchUserCurrencies } = useReadContract({
    contract,
    method: 'function getUserCurrencies(address user) external view returns (address[] memory)',
    params: [account?.address || ''],
  })

  const { refetch: fetchGameCurrencies } = useReadContract({
    contract,
    method: 'function getGameCurrencies(string gameSlug) external view returns (address[] memory)',
    params: ['test-game'],
  })

  const [currencyName, setCurrencyName] = useState('')
  const [currencySymbol, setCurrencySymbol] = useState('$')
  const [isCreatingCurrency, setIsCreatingCurrency] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)

  const [currencies, setCurrencies] = useState<string[]>([])

  const onCurrencyNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrencyName(e.target.value)

    const recommendedSymbol = e.target.value.split(' ')[0]
    setCurrencySymbol(`$${recommendedSymbol?.toUpperCase() || ''}`)
  }

  const onCurrencySymbolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrencySymbol(`$${e.target.value.toUpperCase() || ''}`)
  }

  const { mutate: sendTx, data: transactionResult } = useSendTransaction()

  const testCreateCurrency = async () => {
    if (!account) return
    if (!currencyName || !currencySymbol) return

    setIsCreatingCurrency(true)
    const transaction = prepareContractCall({
      contract,
      method: 'function createCurrency(string name, string symbol, address defaultAdmin, address pauser, address minter, string gameSlug)',
      params: [currencyName, currencySymbol.slice(1), account.address, account.address, account.address, 'test-game'],
    })
    sendTx(transaction)
  }

  const testGetGameCurrenciesByGameSlug = async () => {
    if (!account) return

    const res = await fetchGameCurrencies()
    console.log(res)
  }

  useEffect(() => {
    const handle = async () => {
      if (transactionResult) {
        setIsCreatingCurrency(false)
        setOpenDialog(false)
        const res = await fetchUserCurrencies()
        setCurrencies((res.data as string[]) || [])
      }
    }
    handle()
  }, [transactionResult])

  useEffect(() => {
    const handle = async () => {
      const res = await fetchUserCurrencies()
      setCurrencies((res.data as string[]) || [])
    }
    handle()
  }, [account])

  return (
    <div className='flex flex-1 flex-col gap-4 p-4'>
      <div className='grid auto-rows-min gap-4 grid-cols-2 md:grid-cols-3'>
        <Dialog open={openDialog}>
          <DialogTrigger asChild>
            <button onClick={() => setOpenDialog(true)} className='text-left rounded-xl p-4 border bg-muted/5 hover:bg-muted/20 transition-colors'>
              <div className='flex gap-3 items-center'>
                <div className='flex items-center rounded-lg overflow-hidden size-12 justify-center bg-muted-foreground/50'>
                  <Plus className='size-5' />
                </div>

                <div className='flex flex-col gap-0.5 mt-1 leading-none'>
                  <span className='text-sm font-bold'>New Currency</span>
                  <span className='text-sm text-muted-foreground'>
                    Create a <strong>soft</strong> or <strong>hard</strong> currency used in the game
                  </span>
                </div>
              </div>
            </button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-md'>
            <DialogHeader>
              <DialogTitle>Create Currency</DialogTitle>
              <DialogDescription>Define the currency metadata.</DialogDescription>
            </DialogHeader>
            <div className='flex items-center  w-full gap-4'>
              <div className='grid flex-1 gap-2 w-full'>
                <Label htmlFor='name' className='text-xs'>
                  Name
                </Label>
                <Input id='name' placeholder='ex: Mystic Gems' value={currencyName} onChange={onCurrencyNameChange} />
              </div>
              <div className='grid flex-1 gap-2 w-full'>
                <Label htmlFor='symbol' className='text-xs'>
                  Symbol
                </Label>
                <Input id='symbol' placeholder='ex: GEM' value={currencySymbol} onChange={onCurrencySymbolChange} />
              </div>
            </div>

            <DialogFooter className='flex'>
              <Button type='button' variant='secondary' onClick={() => setOpenDialog(false)} disabled={isCreatingCurrency}>
                Later
              </Button>

              <Button type='button' variant='default' onClick={testCreateCurrency} disabled={isCreatingCurrency}>
                {isCreatingCurrency ? (
                  <>
                    <LoaderCircle className='size-4 animate-spin' />
                    Creating
                  </>
                ) : (
                  <>Create</>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue='recent' className='mt-5'>
        <TabsList>
          <TabsTrigger value='recent'>Recently Added</TabsTrigger>
          <TabsTrigger value='live' disabled className='flex items-center gap-2'>
            Live Minted <div className='flex items-center gap-1 size-2.5 rounded-full mt-0.5 animate-pulse bg-destructive'></div>
          </TabsTrigger>
        </TabsList>
        <TabsContent value='recent' className='grid auto-rows-min gap-4 grid-cols-2 md:grid-cols-3 mt-4'>
          {currencies.map((currency) => (
            <div
              key={currency}
              className='rounded-xl p-4 flex relative justify-between flex-col bg-muted/40 hover:bg-muted/50 transition-colors overflow-hidden'>
              <TokenProvider client={thirdwebClient} chain={defineChain(28122024)} address={currency}>
                <div className='flex gap-3 items-center outline-dashed outline-muted/90 rounded-lg p-3 relative'>
                  <div className='flex items-center rounded-lg overflow-hidden size-12 justify-center'>
                    <figure className='size-full bg-muted/50'>{generateAvatar(currency)}</figure>
                  </div>

                  <div className='flex flex-col gap-1 mt-1 leading-none'>
                    <span className='text-sm text-muted-foreground leading-none'>
                      <TokenName loadingComponent={<LoaderCircle className='size-4 animate-spin' />} />
                    </span>
                    <span className='text-base font-bold'>
                      $<TokenSymbol loadingComponent={<LoaderCircle className='size-4 animate-spin' />} />
                    </span>
                  </div>

                  <button className='absolute right-3 top-3 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors'>
                    <Copy className='size-3' />
                  </button>
                </div>

                <div className='flex gap-2 select-none justify-between mt-5'>
                  <CurrencyStatus status='development' />

                  <div className='flex gap-2'>
                    <div className='flex items-center text-muted-foreground gap-1 bg-muted/50 rounded-lg px-3 py-2 hover:bg-muted/90 transition-colors'>
                      <UserRound className='size-4' />
                      <span className='text-sm text-muted-foreground'>{Number(0).toLocaleString()}</span>
                    </div>

                    <div className='flex items-center text-muted-foreground gap-1 bg-muted/50 rounded-lg px-3 py-2 hover:bg-muted/90 transition-colors'>
                      <Container className='size-4' />
                      <span className='text-sm text-muted-foreground'>{Number(0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </TokenProvider>
            </div>
          ))}

          {MOCK_CURRENCIES.map((currency) => (
            <div className='rounded-xl p-4 flex relative justify-between flex-col bg-muted/40 hover:bg-muted/50 transition-colors overflow-hidden'>
              <div className='flex gap-3 items-center outline-dashed outline-muted/90 rounded-lg p-3 relative'>
                <div className='flex items-center rounded-lg overflow-hidden size-12 justify-center'>
                  <figure className='size-full bg-muted/50'>{generateAvatar(currency.address)}</figure>
                </div>

                <div className='flex flex-col gap-1 mt-1 leading-none'>
                  <span className='text-sm text-muted-foreground leading-none'>{currency.name}</span>
                  <span className='text-base font-bold'>${currency.symbol}</span>
                </div>

                <button className='absolute right-3 top-3 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors'>
                  <Copy className='size-3' />
                </button>
              </div>

              <div className='flex gap-2 select-none justify-between mt-5'>
                <CurrencyStatus status={currency.status} />

                <div className='flex gap-2'>
                  <div className='flex items-center text-muted-foreground gap-1 bg-muted/50 rounded-lg px-3 py-2 hover:bg-muted/90 transition-colors'>
                    <UserRound className='size-4' />
                    <span className='text-sm text-muted-foreground'>{Number(currency.holders).toLocaleString()}</span>
                  </div>

                  <div className='flex items-center text-muted-foreground gap-1 bg-muted/50 rounded-lg px-3 py-2 hover:bg-muted/90 transition-colors'>
                    <Container className='size-4' />
                    <span className='text-sm text-muted-foreground'>{Number(currency.supply).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className='w-[20px] h-[20px] absolute bottom-[-10px] right-[-10px] bg-[#E7AE3B]/50 rotate-45'></div>
            </div>
          ))}
        </TabsContent>
        <TabsContent value='live'></TabsContent>
      </Tabs>
    </div>
  )
}

function CurrencyStatus({ status }: { status: string }) {
  switch (status) {
    case 'development':
      return (
        <div className='flex items-center text-muted-foreground gap-1 text-[#7bb4f5] bg-[#016FEE]/40  rounded-lg px-3 py-2'>
          <span className='truncate text-xs rounded-full w-fit capitalize'>Development</span>
        </div>
      )
    case 'production':
      return (
        <div className='flex items-center text-muted-foreground gap-1 bg-[#D8FF76] rounded-lg px-3 py-2'>
          <span className='truncate text-xs text-[#000] rounded-full w-fit capitalize'>Production</span>
        </div>
      )
    default:
      return (
        <div className='flex items-center text-muted-foreground gap-1 bg-[#C4701C]/40 rounded-lg px-3 py-2'>
          <span className='truncate text-xs text-[#E7AE3B] rounded-full w-fit capitalize'>{status}</span>
        </div>
      )
  }
}
