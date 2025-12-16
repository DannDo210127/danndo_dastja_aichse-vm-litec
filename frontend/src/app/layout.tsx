'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Navigation } from '@/components/Navigation'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import '../styles/global.css'
import { Theme, useThemeStore } from '@/store/theme-store'

export default function IndexLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [queryClient] = useState(() => new QueryClient())

  const themeStore = useThemeStore();

  useEffect(() => {
    
    const currentTheme = themeStore.getTheme();
    document.documentElement.setAttribute('data-theme', currentTheme);
    
  }, [themeStore]);

  return (
    <html lang="en">
        <body>
          <QueryClientProvider client={queryClient}>
            <div className='flex flex-row h-screen w-screen'>
              {/* Navigation Component*/}
              <Navigation/>
              
              {/* Page Content */}
              <main className="w-full h-full bg-background">{children}</main>

              {/* Portal Div for Modals */}
              <div id="modal-root"></div>

              {/* React Query Dev Tools only for Development */}
              <ReactQueryDevtools initialIsOpen={false} />
            </div>
          </QueryClientProvider>
        </body>
    </html>
  )
}