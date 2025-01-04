'use client'

import { ABI } from '@/abis/game-central'
import { ADDRESSES } from '@/constants'
import { thirdwebClient } from '@/lib/thirdweb-client'
import { generateAvatar } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@repo/ui/components/sidebar'
import { ChevronsUpDown, Plus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { defineChain, getContract } from 'thirdweb'
import { useActiveAccount, useReadContract, useSendTransaction } from 'thirdweb/react'

const gameCentralContract = getContract({
  client: thirdwebClient,
  address: ADDRESSES.GAME_CENTRAL,
  chain: defineChain(28122024),
  abi: ABI,
})

type Game = {
  slug: string
  title: string
  creator: string
  team: string[]
}

export function ProjectSwitcher(): JSX.Element {
  const { slug } = useParams()
  const { isMobile } = useSidebar()
  const [activeProject, setActiveProject] = useState<Game | null>(null)
  const wallet = useActiveAccount()
  const { refetch } = useReadContract({
    contract: gameCentralContract,
    method: 'getGameByCreator',
    params: [wallet?.address || ''],
  })
  const { mutate: sendTx, data: transactionResult } = useSendTransaction()
  const router = useRouter()
  const [games, setGames] = useState<Game[]>([])

  useEffect(() => {
    const getAddress = async () => {
      const add = wallet?.address

      if (add) {
        const res = await refetch()

        if (res.status === 'success') {
          setGames(res.data as Game[])

          const game = res.data.find((game) => game.slug === slug)
          setActiveProject(game as Game | null)
        }
      }
    }

    getAddress()
  }, [wallet, transactionResult, slug])

  const handleSwitchProject = (game: Game) => {
    setActiveProject(game)
    router.push(`/game/${game.slug}/system/currency`)
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size='lg' className='data-[state=open]:bg-sidebar-accent gap-2.5 data-[state=open]:text-sidebar-accent-foreground'>
              <div className='flex aspect-square size-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                <figure className='size-full rounded-lg overflow-hidden'>{generateAvatar(activeProject?.slug || '')}</figure>
              </div>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>{activeProject?.title || ''}</span>
                <span className='truncate text-[10px] -ml-1 text-[#7bb4f5] bg-[#016FEE]/40 py-0.5 px-1.5 rounded-full w-fit'>Development</span>
              </div>
              <ChevronsUpDown className='ml-auto' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
            align='start'
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}>
            <DropdownMenuLabel className='text-xs text-muted-foreground'>Games</DropdownMenuLabel>
            {games.map((game, index) => (
              <DropdownMenuItem key={game.slug} onClick={() => handleSwitchProject(game)} className='gap-2 p-2'>
                <div className='w-6 h-6 rounded-sm border overflow-hidden flex items-center justify-center'>
                  <figure className='w-full h-full shrink-0 scale-[2] flex items-center justify-center'>{generateAvatar(game.slug)}</figure>
                </div>
                {game.title}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className='gap-2 p-2'>
              <div className='flex size-6 items-center justify-center rounded-md border bg-background'>
                <Plus className='size-4' />
              </div>
              <div className='font-medium text-muted-foreground'>Add project</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
