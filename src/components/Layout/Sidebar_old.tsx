'use client'

import { Button } from '@/components/ui/button'
import { useAppSelector } from '@/hooks/useAppSelector'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { setSidebarOpen } from '@/store/slices/uiSlice'
import { Home, Settings, FileText, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

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

export function Sidebar() {
  const sidebarOpen = useAppSelector(state => state.ui.sidebarOpen)
  const dispatch = useAppDispatch()
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        'bg-background text-foreground border-r border-border flex flex-col shadow-lg transition-all duration-300 ease-in-out flex-shrink-0 h-screen',
        sidebarOpen ? 'w-64' : 'w-20'
      )}
    >
      {/* Platform owner / Header */}
      <div className="flex items-center justify-between h-16 mb-4 px-4 border-b border-border">
        {sidebarOpen ? (
          <div className="flex items-center space-x-3">
            <div className="relative flex shrink-0 overflow-hidden rounded-full size-8">
              <span className="flex size-full items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                P
              </span>
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Platform owner</span>
            </div>
          </div>
        ) : (
          <div className="relative flex shrink-0 overflow-hidden rounded-full size-8 mx-auto">
            <span className="flex size-full items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
              P
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-col space-y-1 flex-grow px-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start text-base h-11',
                  !sidebarOpen && 'px-2'
                )}
              >
                <item.icon className={cn('h-5 w-5 flex-shrink-0', sidebarOpen && 'mr-3')} />
                {sidebarOpen && <span>{item.name}</span>}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Collapse/Expand Button */}
      <div className="p-2 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => dispatch(setSidebarOpen(!sidebarOpen))}
          className="w-full"
        >
          {sidebarOpen ? (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Collapse
            </>
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>
    </aside>
  )
}