'use client'

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@repo/ui/components/breadcrumb'
import { Separator } from '@repo/ui/components/separator'
import { SidebarTrigger } from '@repo/ui/components/sidebar'
import { usePathname } from 'next/navigation'

export function PageBreadcrumb(): JSX.Element {
  const path = usePathname()

  const breadcrumb = path
    .slice(1)
    .split('/')
    .map((item) => {
      return {
        name: item,
        href: `/${item}`,
      }
    })
    .slice(2)

  const [first, ...rest] = breadcrumb

  const formatPath = (path: string) => {
    return path.replace(/-/g, ' ')
  }

  return (
    <header className='flex h-16 shrink-0 items-center gap-2'>
      <div className='flex items-center gap-2 px-4'>
        <SidebarTrigger className='-ml-1' />
        <Separator orientation='vertical' className='mr-2 h-4' />
        <Breadcrumb>
          <BreadcrumbList>
            {first && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink href={first.href} className='capitalize'>
                    {formatPath(first.name)}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className='hidden md:block' />
              </>
            )}

            {rest.map((item) => (
              <BreadcrumbItem key={item.name}>
                <BreadcrumbPage className='capitalize'>{formatPath(item.name)}</BreadcrumbPage>
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  )
}
