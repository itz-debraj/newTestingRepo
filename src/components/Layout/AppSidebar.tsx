'use client'

import { Button } from '@/components/ui/button'
import { useAppSelector } from '@/hooks/useAppSelector'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { setSidebarOpen } from '@/store/slices/uiSlice'
import { Home, Settings, FileText, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar'

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/',
    icon: Home,
  },
  {
    name: 'Schema Config',
    href: '/schema-config',
    icon: Settings,
  },
  {
    name: 'Project Metadata Config',
    href: '/project-config',
    icon: FileText,
  },
]

function AppSidebarContent() {
  const pathname = usePathname()
  const { state } = useSidebar()

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center space-x-3 px-2 py-2">
          <div className="relative flex shrink-0 overflow-hidden rounded-full size-8">
            <span className="flex size-full items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
              P
            </span>
          </div>
          {state === 'expanded' && (
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Platform owner</span>
            </div>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="p-2">
          <SidebarTrigger className="w-full">
            {state === 'expanded' ? (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Collapse
              </>
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </SidebarTrigger>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

export function AppSidebar() {
  return <AppSidebarContent />
}