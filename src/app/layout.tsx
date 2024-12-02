import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from "@/components/ui/toaster"
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { AuthProvider } from '@/lib/auth'
import { Header } from '@/components/layout/header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GenCast',
  description: 'AI-powered podcast creation',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const supabase = createServerComponentClient({
    cookies: () => cookieStore
  })
  const { data: { session } } = await supabase.auth.getSession()

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider initialSession={session}>
          <div className="min-h-screen bg-background">
            <Header />
            <main className="px-4 py-6">
              <div className="max-w-[1200px] mx-auto">
                {children}
              </div>
            </main>
            <Toaster />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
