'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { Navigation } from '@/components/Navigation'
import '../styles/global.css'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

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
              <Navigation/>
              {children}
              <ReactQueryDevtools initialIsOpen={false} />
            </div>
          </QueryClientProvider>
        </body>
    </html>
  )
}