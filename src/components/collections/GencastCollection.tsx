"use client"

import { Button } from "@/components/ui/button"
import { ContentCard } from "@/components/ui/content-card"
import { Pause, Play, Clock, Radio } from "lucide-react"
import { SectionHeader } from "@/components/layout/SectionHeader"
import { GencastCard } from "@/components/cards/gencast-card"

export function GencastCollection() {
  return (
    <div className="space-y-8">
      <SectionHeader
        title="Your Gencasts"
        description="Listen to your AI-generated podcasts"
        link={{
          href: "/gencasts",
          label: "All Gencasts"
        }}
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <ContentCard isNew newText="Create new Gencast" />

        <GencastCard 
          title="Latest Tech Trends"
          description="Exploring the most impactful technologies of 2024"
          duration="15:30"
          show={{
            name: "Tech Roundtable",
            episodeNumber: 12
          }}
          isPlaying={true}
          onPlayPause={() => console.log('Toggle play/pause')}
        />
        
        <GencastCard 
          title="AI in Healthcare"
          description="How artificial intelligence is transforming medical diagnostics"
          duration="25:45"
          show={{
            name: "Future Talk",
            episodeNumber: 8
          }}
          isPlaying={false}
          onPlayPause={() => console.log('Toggle play/pause')}
        />
      </div>
    </div>
  )
}

interface GencastCardProps {
  title: string
  description: string
  duration: string
  show: {
    name: string
    episodeNumber: number
  }
  isPlaying: boolean
  onPlayPause: () => void
}

function GencastCard({ title, description, duration, show, isPlaying, onPlayPause }: GencastCardProps) {
  return (
    <ContentCard>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Radio className="h-6 w-6 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground line-clamp-1">
              {show.name} · Episode {show.episodeNumber}
            </p>
            <h3 className="font-semibold tracking-tight line-clamp-1">{title}</h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
          {description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{duration}</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full hover:bg-primary hover:text-primary-foreground"
            onClick={onPlayPause}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </ContentCard>
  )
}
