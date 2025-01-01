'use client'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@repo/ui/components/sidebar'
import { type LucideIcon } from 'lucide-react'
import Link from 'next/link'

export function NavComponents({
  projects,
}: {
  projects: {
    name: string
    url: string
    icon: LucideIcon
    count?: number
  }[]
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarGroup className='group-data-[collapsible=icon]:hidden'>
      <SidebarGroupLabel>UI Components</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <Link href={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>

            {item.count && <SidebarMenuBadge className='bg-destructive leading-none pb-0.5 pr-[5px]'>{item.count}</SidebarMenuBadge>}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
