"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { createClientComponentClient, type Session } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: any
  signIn: (email: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ 
  children,
  initialSession
}: { 
  children: React.ReactNode
  initialSession: Session | null
}) {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [user, setUser] = useState<any>(initialSession?.user || null)

  useEffect(() => {
    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        // Refresh data on auth state change
        router.refresh()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  const signIn = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) throw error
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
    router.push('/')
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
