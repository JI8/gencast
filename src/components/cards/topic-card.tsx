"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Hash, Newspaper, MoreVertical } from "lucide-react"
import { ContentCard } from "@/components/ui/content-card"
import type { Topic } from "@/components/modals/topic-detail"

interface TopicCardProps extends Topic {
  onClick?: () => void
}

export function TopicCard({ 
  name,
  description,
  tags,
  sources,
  showCount,
  episodeCount,
  onClick 
}: TopicCardProps) {
  return (
    <ContentCard onClick={onClick}>
      <div className="flex items-start gap-3">
        <div className="flex-1 space-y-1.5">
          <div className="font-semibold">{name}</div>
          <div className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </div>
        </div>

        <Button 
          variant="ghost" 
          size="icon"
          className="shrink-0 -mt-1 -mr-2"
          onClick={(e) => {
            e.stopPropagation()
            console.log('More options')
          }}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex-1">
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Hash className="h-4 w-4" />
            <span>{showCount} shows</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Newspaper className="h-4 w-4" />
            <span>{sources.length} sources</span>
          </div>
        </div>
      </div>
    </ContentCard>
  )
}
