// 'use client'

// import { Button } from '@/components/ui/button'
// import { useAppSelector } from '@/hooks/useAppSelector'
// import { useAppDispatch } from '@/hooks/useAppDispatch'
// import { toggleSidebar } from '@/store/slices/uiSlice'
// import { Menu, Grid3X3, Sun, Moon, Monitor } from 'lucide-react'
// import { ThemeSwitcher } from './ThemeSwitcher'

// export function Header() {
//   const dispatch = useAppDispatch()

//   return (
//     <header className="flex items-center p-2 border-b border-border bg-card shadow-sm flex-shrink-0 h-16">
//       {/* Left section: Sidebar toggle */}
//       <Button
//         variant="ghost"
//         size="icon"
//         onClick={() => dispatch(toggleSidebar())}
//         title="Toggle Sidebar"
//         className="text-primary"
//       >
//         <Menu className="h-6 w-6" />
//       </Button>

//       {/* Center section: Spacer */}
//       <div className="flex-grow" />

//       {/* Right section: Icons */}
//       <div className="flex items-center space-x-2 ml-auto">
//         <Button className="text-primary" variant="ghost" size="icon" title="Apps">
//           <Grid3X3 className="h-5 w-5" />
//         </Button>
//         <ThemeSwitcher />
//         <Button variant="secondary" size="icon" className="rounded-full">
//           R
//         </Button>
//       </div>
//     </header>
//   )
// }


// 'use client'

// import { Button } from '@/components/ui/button'
// import { Grid3X3 } from 'lucide-react'
// import { ThemeSwitcher } from './ThemeSwitcher'
// import { SidebarTrigger } from '@/components/ui/sidebar'

// export function Header() {

//   return (
//     <header className="flex items-center p-2 border-b border-border bg-card shadow-sm flex-shrink-0 h-16">
//       {/* Left section: Sidebar toggle */}
//       <SidebarTrigger className="text-primary" />

//       {/* Center section: Spacer */}
//       <div className="flex-grow" />

//       {/* Right section: Icons */}
//       <div className="flex items-center space-x-2 ml-auto">
//         <Button className="text-primary" variant="ghost" size="icon" title="Apps">
//           <Grid3X3 className="h-5 w-5" />
//         </Button>
//         <ThemeSwitcher />
//         <Button variant="secondary" size="icon" className="rounded-full">
//           R
//         </Button>
//       </div>
//     </header>
//   )
// }


'use client'

import { Button } from '@/components/ui/button'
import { Grid3X3 } from 'lucide-react'
import { ThemeSwitcher } from './ThemeSwitcher'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@radix-ui/react-separator'

export function Header() {

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b">
      {/* Left section: Sidebar toggle */}
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
      </div>

      {/* Center section: Spacer */}
      <div className="flex-grow" />

      {/* Right section: Icons */}
      
      <div className="grow flex justify-end items-center gap-2 px-4">
        <Button
          className="text-primary"
          variant="ghost"
          size="icon"
          title="Apps"
        >
          <Grid3X3 className="h-5 w-5" />
        </Button>
        <ThemeSwitcher />
        <Button variant="secondary" size="icon" className="rounded-full">
          D
        </Button>
      </div>
    </header>
  );
}