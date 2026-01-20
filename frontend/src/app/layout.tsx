'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Navigation } from '@/components/Navigation'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Snackbar from '@/shared/Snackbar'

import '../styles/global.css'
import { Theme, useThemeStore } from '@/store/theme-store'
import { useAuth } from '@/hooks/useAuth'

function LayoutContent({ children }: { children: React.ReactNode }) {
  const themeStore = useThemeStore();
  
  useEffect(() => {
    const currentTheme = themeStore.getTheme();
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [themeStore]);

  const user = useAuth();

  return (
    <div className='flex flex-row w-screen h-screen'>
      {/* Navigation Component*/}
      <Navigation/>
      
      {/* Page Content */}
      <main className="bg-background w-full h-full">
        {children}
      </main>

      {/* Snackbar for notifications */}
      <Snackbar />

      {/* Portal Div for Modals */}
      <div id="modal-root"></div>

      {/* React Query Dev Tools only for Development */}
    </div>
  );
}

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
            <LayoutContent>
              {children}
            </LayoutContent>
            <ReactQueryDevtools initialIsOpen={false} />
            
          </QueryClientProvider>
        </body>
    </html>
  )
}