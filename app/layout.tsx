import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ThemeProvider } from '@/components/ThemeProvider'
import { LayoutWrapper } from '@/components/LayoutWrapper'
import { AuthListener } from '@/components/AuthListener'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Weav — Where ideas intertwine',
  description: 'A 3D conversation platform where users explore threads visually',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <LayoutWrapper>
            <AuthListener />
            <Header />
            <main className="flex-1 overflow-hidden w-full m-0 p-0" style={{ backgroundColor: 'transparent', margin: 0, padding: 0, marginTop: '4rem', marginBottom: 0, paddingBottom: 0, minHeight: 0, height: 'calc(100vh - 4rem - 4rem)' }}>{children}</main>
            <Footer />
          </LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}

