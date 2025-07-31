// import './globals.css'
// import type { Metadata } from 'next'
// import { Inter } from 'next/font/google'
// import { StoreProvider } from '@/providers/StoreProvider'
// import { ThemeProvider } from '@/providers/ThemeProvider'
// import { Sidebar } from '@/components/Layout/Sidebar'
// import { Header } from '@/components/Layout/Header'
// import { Footer } from '@/components/Layout/Footer'
// import { Toaster } from '@/components/Layout/Toaster'

// const inter = Inter({ subsets: ['latin'] })

// export const metadata: Metadata = {
//   title: 'Metadata Management System',
//   description: 'Comprehensive metadata management and schema configuration system',
// }

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         <StoreProvider>
//           <ThemeProvider>
//             <div className="min-h-screen bg-background font-inter flex">
//               <Sidebar />
//               <div className="flex flex-col flex-grow h-screen">
//                 <Header />
//                 <main className="flex-grow bg-background text-foreground shadow-2xl overflow-y-auto">
//                   <div className="mx-auto h-full">
//                     {children}
//                   </div>
//                 </main>
//                 <Footer />
//               </div>
//               <Toaster />
//             </div>
//           </ThemeProvider>
//         </StoreProvider>
//       </body>
//     </html>
//   )
// }

import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { StoreProvider } from '@/providers/StoreProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { AppSidebar } from '@/components/Layout/AppSidebar'
import { Header } from '@/components/Layout/Header'
import { Footer } from '@/components/Layout/Footer'
import { Toaster } from '@/components/Layout/Toaster'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Metadata Management System',
  description: 'Comprehensive metadata management and schema configuration system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider>
          <ThemeProvider>
            <SidebarProvider>
              
                <AppSidebar />
                <SidebarInset>
                <div className="flex flex-col flex-grow h-screen">
                  <Header />
                  <main className="flex-grow bg-background text-foreground shadow-2xl overflow-y-auto">
                    <div className="mx-auto h-full">
                      {children}
                    </div>
                  </main>
                  <Footer />
                </div>
                <Toaster />
                </SidebarInset>
             
            </SidebarProvider>
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  )
}