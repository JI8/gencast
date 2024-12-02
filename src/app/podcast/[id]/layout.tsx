"use client"

import { ReactNode } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronLeftIcon } from '@radix-ui/react-icons'

interface PodcastLayoutProps {
  children: ReactNode
}

export default function PodcastLayout({ children }: PodcastLayoutProps) {
  const router = useRouter()
  const params = useParams()

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-6">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={() => router.push('/dashboard')}
          >
            <ChevronLeftIcon className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
      <main>{children}</main>
    </div>
  )
}
