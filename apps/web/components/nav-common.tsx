'use client'

import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@repo/ui/components/sidebar'
import { type LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export function NavCommon({
  title,
  data,
}: {
  title: string
  data: {
    name: string
    url: string
    icon: LucideIcon
  }[]
}): JSX.Element {
  const params = useParams()
  const slug = params.slug as string

  const { isMobile } = useSidebar()

  return (
    <SidebarGroup className='group-data-[collapsible=icon]:hidden'>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {data.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <Link href={`/game/${slug}${item.url}`}>
                <item.icon />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
