'use client'

import { thirdwebClient } from '@/lib/thirdweb-client'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@repo/ui/components/sidebar'
import {
  Anvil,
  AudioWaveform,
  BarChart,
  Bot,
  Box,
  Code,
  Coins,
  DicesIcon,
  GalleryVerticalEnd,
  LayoutDashboard,
  Medal,
  PackageOpen,
  ScrollText,
  Sword,
  Trophy,
  User,
} from 'lucide-react'
import * as React from 'react'
import { defineChain } from 'thirdweb'
import { ConnectButton } from 'thirdweb/react'
import { NavCommon } from './nav-common'
import { NavMain } from './nav-main'
import { NavUser } from './nav-user'
import { ProjectSwitcher } from './project-switcher'

const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '#',
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: 'Overview',
          url: '#',
        },
        {
          title: 'Analytics',
          url: '#',
        },
      ],
    },
    {
      title: 'Development',
      url: '#',
      icon: Code,
      items: [
        {
          title: 'API Keys',
          url: '#',
        },
        {
          title: 'Usage',
          url: '#',
        },
      ],
    },
  ],

  systems: [
    {
      name: 'Currency',
      url: '/system/currency',
      icon: Coins,
    },
    {
      name: 'Items',
      url: '/system/items',
      icon: Sword,
    },
    {
      name: 'Quest',
      url: '/system/quest',
      icon: ScrollText,
    },
    {
      name: 'Inventory',
      url: '/system/inventory',
      icon: Box,
    },
    {
      name: 'Crafting',
      url: '/system/crafting',
      icon: Anvil,
    },
    {
      name: 'Gacha',
      url: '/system/gacha',
      icon: DicesIcon,
    },
  ],
  entities: [
    {
      name: 'Character',
      url: '#',
      icon: User,
    },
    {
      name: 'NPC',
      url: '#',
      icon: Bot,
    },
    {
      name: 'Loot Box',
      url: '#',
      icon: PackageOpen,
    },
  ],
  progression: [
    {
      name: 'Stats',
      url: '#',
      icon: BarChart,
    },
    {
      name: 'Leaderboard',
      url: '#',
      icon: Medal,
    },
    {
      name: 'Achievements',
      url: '#',
      icon: Trophy,
    },
  ],
  games: [
    {
      name: 'Project: Bloom',
      logo: GalleryVerticalEnd,
    },
    {
      name: 'Albion',
      logo: AudioWaveform,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <ProjectSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavCommon title='Entities' data={data.entities} />
        <NavCommon title='Systems' data={data.systems} />
        <NavCommon title='Progression' data={data.progression} />
      </SidebarContent>
      <SidebarFooter>
        <div className='hidden'>
          <ConnectButton
            chains={[defineChain(28122024)]}
            client={thirdwebClient}
            accountAbstraction={{
              chain: defineChain(28122024), // the chain where your smart accounts will be or is deployed
              sponsorGas: true, // enable or disable sponsored transactions
            }}
          />
        </div>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
