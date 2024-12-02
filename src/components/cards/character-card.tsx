"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreVertical, MessageSquare, Mic2, Play } from "lucide-react"
import { ContentCard } from "@/components/ui/content-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Character } from "@/components/modals/character-detail"

interface CharacterCardProps extends Character {
  onClick?: () => void
  onPreviewVoice?: () => void
}

export function CharacterCard({ 
  name, 
  description, 
  avatar, 
  role,
  traits, 
  showCount, 
  episodeCount, 
  onClick,
  onPreviewVoice 
}: CharacterCardProps) {
  return (
    <ContentCard onClick={onClick}>
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback>{name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold tracking-tight line-clamp-1">{name}</h3>
              <p className="text-sm text-muted-foreground">{role}</p>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation()
              console.log('More options')
            }}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mt-3">
          {description}
        </p>

        <div className="flex items-center gap-2 mt-4">
          {traits?.map((trait) => (
            <Badge key={trait} variant="secondary" className="text-xs">
              {trait}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-4 mt-auto pt-4">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MessageSquare className="h-4 w-4" />
            <span>{showCount}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Mic2 className="h-4 w-4" />
            <span>{episodeCount}</span>
          </div>
          {onPreviewVoice && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 ml-auto"
              onClick={(e) => {
                e.stopPropagation()
                onPreviewVoice()
              }}
            >
              <Play className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </ContentCard>
  )
}
