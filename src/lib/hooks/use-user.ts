"use client"

import { useAuth } from '@/lib/auth'

export function useUser() {
  const { user } = useAuth()
  return { user }
}
