"use client"

import * as React from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { 
  X, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2,
  MessageSquare
} from "lucide-react"
import { cn } from "@/lib/utils"

interface GencastPlayerProps {
  isOpen: boolean
  onClose: () => void
  gencast: {
    title: string
    description: string
    duration: string
    currentTime?: number
    show: {
      name: string
      episodeNumber: number
    }
    transcript?: Array<{
      time: number
      speaker: string
      text: string
    }>
  }
}

export function GencastPlayer({ isOpen, onClose, gencast }: GencastPlayerProps) {
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [showTranscript, setShowTranscript] = React.useState(false)
  const [currentTime, setCurrentTime] = React.useState(gencast.currentTime || 0)

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[90vw] w-[1200px] h-[90vh] max-h-[900px] p-0">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">{gencast.title}</h2>
              <p className="text-sm text-muted-foreground">
                {gencast.show.name} - Episode {gencast.show.episodeNumber}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowTranscript(!showTranscript)}
                className={cn(
                  "h-8 w-8",
                  showTranscript && "bg-accent"
                )}
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex">
            {/* Main Player */}
            <div className="flex-1 flex flex-col p-6">
              {/* Waveform */}
              <div className="flex-1 bg-muted rounded-lg mb-6" />

              {/* Player Controls */}
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-4">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button
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
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Slider
                    value={[currentTime]}
                    max={100}
                    step={1}
                    onValueChange={([value]) => setCurrentTime(value)}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>0:00</span>
                    <span>{gencast.duration}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                  <Slider
                    defaultValue={[75]}
                    max={100}
                    step={1}
                    className="w-24"
                  />
                </div>
              </div>
            </div>

            {/* Transcript Panel */}
            {showTranscript && (
              <div className="w-[400px] border-l p-6 overflow-auto">
                <div className="space-y-6">
                  {gencast.transcript?.map((entry, i) => (
                    <div
                      key={i}
                      className={cn(
                        "space-y-1",
                        Math.abs(entry.time - currentTime) < 5 && "opacity-100",
                        "opacity-60"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{entry.speaker}</span>
                        <span className="text-sm text-muted-foreground">
                          {Math.floor(entry.time / 60)}:{String(Math.floor(entry.time % 60)).padStart(2, '0')}
                        </span>
                      </div>
                      <p className="text-sm">{entry.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
