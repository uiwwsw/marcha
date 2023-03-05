import React from 'react'
import '@/styles/globals.css'
import { Inter } from '@next/font/google'
import { AppProps } from 'next/app'
import {
  useQuery,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import Toast from '@ui/common/toast'
const inter = Inter({ subsets: ['latin'] })

const queryClient = new QueryClient()

const App: React.FC<AppProps> = ({ Component, pageProps }) => (
  <QueryClientProvider client={queryClient}>
    <ReactQueryDevtools initialIsOpen />

    <main className={inter.className}>
      <Component {...pageProps} />
      <Toast />
    </main>
  </QueryClientProvider>
)

export default App
