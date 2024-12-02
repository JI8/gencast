"use client"

import { DetailModal } from "@/components/ui/detail-modal"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, Clock, Radio } from "lucide-react"

interface GencastDetailProps {
  isOpen: boolean
  onClose: () => void
  gencast: {
    title: string
    description: string
    duration: string
    show: {
      name: string
      episodeNumber: number
    }
    isPlaying?: boolean
  }
}

export function GencastDetail({ isOpen, onClose, gencast }: GencastDetailProps) {
  const [isPlaying, setIsPlaying] = React.useState(gencast.isPlaying || false)

  return (
    <DetailModal
      isOpen={isOpen}
      onClose={onClose}
      onEdit={() => console.log("Edit gencast")}
      title={gencast.title}
    >
      <div className="space-y-8">
        {/* Main Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {gencast.duration}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Radio className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {gencast.show.name} - Episode {gencast.show.episodeNumber}
                </span>
              </div>
            </div>
          </div>
          <p className="text-muted-foreground">{gencast.description}</p>
        </div>

        {/* Audio Waveform Placeholder */}
        <div className="h-32 bg-muted rounded-lg" />

        {/* Additional Content */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Characters</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Sarah Chen (Host)</Badge>
              <Badge variant="secondary">David Kumar (Tech Expert)</Badge>
              <Badge variant="secondary">Maria Garcia (Analyst)</Badge>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Topics</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">AI</Badge>
              <Badge variant="secondary">Startups</Badge>
              <Badge variant="secondary">Innovation</Badge>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Sources</h3>
            <div className="space-y-2">
              <div className="p-3 bg-muted rounded-lg">
                <div className="font-medium">Latest AI Developments</div>
                <div className="text-sm text-muted-foreground">TechCrunch - 2 days ago</div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="font-medium">Startup Funding Report</div>
                <div className="text-sm text-muted-foreground">VentureBeat - 1 week ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DetailModal>
  )
}
