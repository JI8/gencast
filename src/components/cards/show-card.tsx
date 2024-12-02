"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { ContentCard } from "@/components/ui/content-card"
import { Users, Hash } from "lucide-react"
import { useRouter } from "next/navigation"

interface ShowCardProps {
  id: string
  title: string
  description: string
  character_ids?: string[]
  topic_ids?: string[]
  episodeCount: number
  onClick?: () => void
}

export function ShowCard({
  id,
  title,
  description,
  character_ids = [],
  topic_ids = [],
  episodeCount,
  onClick
}: ShowCardProps) {
  const router = useRouter()

  return (
    <ContentCard onClick={() => router.push(`/shows/${id}`)}>
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <h3 className="font-semibold tracking-tight line-clamp-1">{title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-4 mt-1">
            {description}
          </p>
        </div>
          
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{character_ids.length} Characters</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Hash className="h-4 w-4" />
            <span>{topic_ids.length} Topics</span>
          </div>
        </div>
      </div>
    </ContentCard>
  )
}
