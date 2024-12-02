"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Wand2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Show } from '@/lib/supabase'

interface EpisodeGeneratorProps {
  show: Show
  onGenerate?: (title: string, description: string) => void
}

export function EpisodeGenerator({ show, onGenerate }: EpisodeGeneratorProps) {
  const { toast } = useToast()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!title.trim()) {
      toast({
        title: "Missing Title",
        description: "Please enter a title for your episode",
        variant: "destructive"
      })
      return
    }

    setIsGenerating(true)
    try {
      onGenerate?.(title, description)
    } catch (error) {
      console.error('Error generating episode:', error)
      toast({
        title: "Error",
        description: "Failed to generate episode",
        variant: "destructive"
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="bg-muted/50 rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Generate Episode</h2>
          <p className="text-sm text-muted-foreground">
            Create a new episode with current show settings
          </p>
        </div>
        <Button
          onClick={handleGenerate}
          size="lg"
          disabled={!title.trim() || isGenerating}
        >
          <Wand2 className="h-5 w-5 mr-2" />
          Generate Episode
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Episode Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a catchy title"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's this episode about?"
            className="h-[38px] resize-none"
          />
        </div>
      </div>
    </div>
  )
}
