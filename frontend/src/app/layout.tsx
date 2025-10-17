'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { Navigation } from '@/components/Navigation'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// @ts-expect-error: Import global.css
import '../styles/global.css'

export default function IndexLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <html lang="en">
        <body>
          <QueryClientProvider client={queryClient}>
            <div className='flex flex-row h-full w-full'>
              {/* Navigation Component*/}
              <Navigation/>
              
              {/* Page Content */}
              <main className="w-full h-full">{children}</main>

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