import { AppSidebar } from '@/components/app-sidebar'
import { PageBreadcrumb } from '@/components/page-breadcrumb'
import { SidebarInset, SidebarProvider } from '@repo/ui/components/sidebar'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <PageBreadcrumb />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
