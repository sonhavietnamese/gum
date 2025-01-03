'use client'

import { thirdwebClient } from '@/lib/thirdweb-client'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@repo/ui/components/sidebar'
import { AudioWaveform, BookOpen, Bot, FileClock, Frame, GalleryVerticalEnd, History, Puzzle, Radio, Settings2, SquareTerminal } from 'lucide-react'
import * as React from 'react'
import { defineChain } from 'thirdweb'
import { ConnectButton } from 'thirdweb/react'
import { NavDesign } from './nav-design'
import { NavSystems } from './nav-systems'
import { NavUser } from './nav-user'
import { ProjectSwitcher } from './project-switcher'

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Playground',
      url: '#',
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: 'History',
          url: '#',
        },
        {
          title: 'Starred',
          url: '#',
        },
        {
          title: 'Settings',
          url: '#',
        },
      ],
    },
    {
      title: 'Models',
      url: '#',
      icon: Bot,
      items: [
        {
          title: 'Genesis',
          url: '#',
        },
        {
          title: 'Explorer',
          url: '#',
        },
        {
          title: 'Quantum',
          url: '#',
        },
      ],
    },
    {
      title: 'Documentation',
      url: '#',
      icon: BookOpen,
      items: [
        {
          title: 'Introduction',
          url: '#',
        },
        {
          title: 'Get Started',
          url: '#',
        },
        {
          title: 'Tutorials',
          url: '#',
        },
        {
          title: 'Changelog',
          url: '#',
        },
      ],
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'General',
          url: '#',
        },
        {
          title: 'Team',
          url: '#',
        },
        {
          title: 'Billing',
          url: '#',
        },
        {
          title: 'Limits',
          url: '#',
        },
      ],
    },
  ],

  designs: [
    {
      name: 'Live',
      url: '/design/live',
      icon: Radio,
    },
    {
      name: 'Requests',
      url: '/design/requests',
      icon: Frame,
      count: 10,
    },
    {
      name: 'Components',
      url: '/design/components',
      icon: Puzzle,
    },
    {
      name: 'History',
      url: '/design/history',
      icon: History,
    },
  ],
  systems: [
    {
      name: 'Logs',
      url: '/system/logs',
      icon: FileClock,
    },
  ],
  projects: [
    {
      name: 'Classic',
      logo: GalleryVerticalEnd,
    },
    {
      name: 'Mavis X',
      logo: AudioWaveform,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <ProjectSwitcher projects={data.projects} />
      </SidebarHeader>
      <SidebarContent>
        <NavDesign designs={data.designs} />
        <NavSystems systems={data.systems} />
      </SidebarContent>
      <SidebarFooter>
        <ConnectButton chains={[defineChain(28122024)]} client={thirdwebClient} />
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
