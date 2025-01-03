'use client'

import { ChevronsUpDown, LucideIcon, Plus } from 'lucide-react'

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
import { useState } from 'react'

export function ProjectSwitcher({
  games,
}: {
  games: {
    name: string
    logo: LucideIcon
  }[]
}): JSX.Element {
  const { isMobile } = useSidebar()
  const [activeProject, setActiveProject] = useState(games[0])

  if (!activeProject) return <></>

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size='lg' className='data-[state=open]:bg-sidebar-accent gap-2.5 data-[state=open]:text-sidebar-accent-foreground'>
              <div className='flex aspect-square size-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                <figure className='size-full rounded-lg overflow-hidden'>{generateAvatar(activeProject.name)}</figure>
              </div>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>{activeProject.name}</span>
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
              <DropdownMenuItem key={game.name} onClick={() => setActiveProject(game)} className='gap-2 p-2'>
                <div className='w-6 h-6 rounded-sm border overflow-hidden flex items-center justify-center'>
                  <figure className='w-full h-full shrink-0 scale-[2] flex items-center justify-center'>{generateAvatar(game.name)}</figure>
                </div>
                {game.name}
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
