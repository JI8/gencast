"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { usePodcasts } from '@/hooks/usePodcasts'
import { useToast } from "@/components/ui/use-toast"

interface UseTemplateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  template: {
    id: string
    title: string
    description: string
    format: string
  }
}

export function UseTemplateDialog({ open, onOpenChange, template }: UseTemplateDialogProps) {
  const { createPodcast } = usePodcasts()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [podcastData, setPodcastData] = useState({
    title: `${template.title} (Copy)`,
    description: template.description,
  })

  const handleCreateFromTemplate = async () => {
    try {
      setLoading(true)
      const podcast = await createPodcast(
        podcastData.title,
        podcastData.description,
        template.format,
        false
      )

      if (podcast) {
        toast({
          title: "Success",
          description: "Podcast created from template",
        })
        onOpenChange(false)
      } else {
        throw new Error("Failed to create podcast")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create podcast from template",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Use Template</DialogTitle>
          <DialogDescription>
            Create a new podcast using this template as a starting point.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={podcastData.title}
              onChange={(e) =>
                setPodcastData({ ...podcastData, title: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={podcastData.description}
              onChange={(e) =>
                setPodcastData({ ...podcastData, description: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label>Format</Label>
            <div className="text-sm text-muted-foreground capitalize">
              {template.format}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateFromTemplate} disabled={loading}>
            {loading ? "Creating..." : "Create Podcast"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
