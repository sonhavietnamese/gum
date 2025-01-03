'use client'

import { logout } from '@/app/actions/auth'
import { thirdwebClient } from '@/lib/thirdweb-client'
import { generateGradient } from '@/lib/utils'
import { Avatar } from '@repo/ui/components/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@repo/ui/components/sidebar'
import { BadgeCheck, Bell, ChevronsUpDown, CreditCard, LogOut, Sparkles } from 'lucide-react'
import { useMemo } from 'react'
import { useActiveAccount, useProfiles } from 'thirdweb/react'

const formatAddress = (address: string, length: number = 6) => {
  if (!address) return '0x'

  return `${address.slice(0, length)}...${address.slice(-length)}`.toLowerCase()
}

export function NavUser(): JSX.Element {
  const { isMobile } = useSidebar()

  const { data: profiles } = useProfiles({ client: thirdwebClient })
  const account = useActiveAccount()

  console.log(account)
  console.log(profiles)

  const address = useMemo(() => {
    return formatAddress(account?.address ?? '')
  }, [account?.address])

  const email = useMemo(() => {
    return profiles?.[0]?.details.email ?? ''
  }, [profiles])

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size='lg' className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'>
              <Avatar className='h-8 w-8 rounded-lg'>
                <svg className='w-8 h-8' xmlns='http://www.w3.org/2000/svg' version='1.1' viewBox='0 0 700 700' width='700' height='700'>
                  <defs>
                    <linearGradient gradientTransform='rotate(150, 0.5, 0.5)' x1='50%' y1='0%' x2='50%' y2='100%' id='ffflux-gradient'>
                      <stop stopColor={generateGradient(address)} stopOpacity='1' offset='0%' />
                      <stop stopColor={generateGradient(email)} stopOpacity='1' offset='100%' />
                    </linearGradient>
                    <filter
                      id='ffflux-filter'
                      x='-20%'
                      y='-20%'
                      width='140%'
                      height='140%'
                      filterUnits='objectBoundingBox'
                      primitiveUnits='userSpaceOnUse'
                      colorInterpolationFilters='sRGB'>
                      <feTurbulence
                        type='fractalNoise'
                        baseFrequency='0.005 0.003'
                        numOctaves='2'
                        seed='221'
                        stitchTiles='stitch'
                        x='0%'
                        y='0%'
                        width='100%'
                        height='100%'
                        result='turbulence'
                      />
                      <feGaussianBlur
                        stdDeviation='20 0'
                        x='0%'
                        y='0%'
                        width='100%'
                        height='100%'
                        in='turbulence'
                        edgeMode='duplicate'
                        result='blur'
                      />
                      <feBlend mode='color-dodge' x='0%' y='0%' width='100%' height='100%' in='SourceGraphic' in2='blur' result='blend' />
                    </filter>
                  </defs>
                  <rect width='700' height='700' fill='url(#ffflux-gradient)' filter='url(#ffflux-filter)' />
                </svg>
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>{address}</span>
                <span className='truncate text-xs'>{email}</span>
              </div>
              <ChevronsUpDown className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}>
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                <Avatar className='h-8 w-8 rounded-lg'>
                  <svg
                    className='w-8 h-8'
                    xmlns='http://www.w3.org/2000/svg'
                    version='1.1'
                    viewBox='0 0 700 700'
                    width='700'
                    height='700'
                    opacity='1'>
                    <defs>
                      <linearGradient gradientTransform='rotate(150, 0.5, 0.5)' x1='50%' y1='0%' x2='50%' y2='100%' id='ffflux-gradient'>
                        <stop stopColor='#000' stopOpacity='1' offset='0%' />
                        <stop stopColor='#000' stopOpacity='1' offset='100%' />
                      </linearGradient>
                      <filter
                        id='ffflux-filter'
                        x='-20%'
                        y='-20%'
                        width='140%'
                        height='140%'
                        filterUnits='objectBoundingBox'
                        primitiveUnits='userSpaceOnUse'
                        colorInterpolationFilters='sRGB'>
                        <feTurbulence
                          type='fractalNoise'
                          baseFrequency='0.001 0.003'
                          numOctaves='2'
                          seed='221'
                          stitchTiles='stitch'
                          x='0%'
                          y='0%'
                          width='100%'
                          height='100%'
                          result='turbulence'
                        />
                        <feGaussianBlur
                          stdDeviation='0 100'
                          x='0%'
                          y='0%'
                          width='100%'
                          height='100%'
                          in='turbulence'
                          edgeMode='duplicate'
                          result='blur'
                        />
                        <feBlend mode='color-dodge' x='0%' y='0%' width='100%' height='100%' in='SourceGraphic' in2='blur' result='blend' />
                      </filter>
                    </defs>
                    <rect width='700' height='700' fill='url(#ffflux-gradient)' filter='url(#ffflux-filter)' />
                  </svg>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>{address}</span>
                  <span className='truncate text-xs'>{email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
