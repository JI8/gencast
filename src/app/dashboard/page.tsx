"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MagnifyingGlassIcon } from "@radix-ui/react-icons"
import { usePodcasts } from '@/hooks/usePodcasts'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

export default function DashboardPage() {
  const router = useRouter()
  const { podcasts, loading, createPodcast } = usePodcasts()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newPodcast, setNewPodcast] = useState({
    title: '',
    description: '',
    coverImage: '' // We'll add image upload later
  })

  const filteredPodcasts = podcasts.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreatePodcast = async () => {
    if (!newPodcast.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a podcast title",
        variant: "destructive",
      })
      return
    }

    try {
      const podcast = await createPodcast(newPodcast)
      setShowCreateDialog(false)
      setNewPodcast({ title: '', description: '', coverImage: '' })
      toast({
        title: "Success",
        description: "Podcast created successfully",
      })
      router.push(`/podcast/${podcast.id}/setup`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create podcast",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Your Podcasts</h1>
            <p className="text-muted-foreground mt-2">
              Create and manage your podcast concepts
            </p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>Create New Podcast</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Podcast</DialogTitle>
                <DialogDescription>
                  Set up your podcast concept. You can add characters and episodes later.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newPodcast.title}
                    onChange={(e) => setNewPodcast({ ...newPodcast, title: e.target.value })}
                    placeholder="My Amazing Podcast"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newPodcast.description}
                    onChange={(e) => setNewPodcast({ ...newPodcast, description: e.target.value })}
                    placeholder="What's your podcast about?"
                  />
                </div>
                {/* We'll add image upload here later */}
              </div>
              <DialogFooter>
                <Button onClick={handleCreatePodcast}>Create Podcast</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative w-full max-w-sm">
          <Input
            type="text"
            placeholder="Search podcasts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
          <MagnifyingGlassIcon className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPodcasts.map((podcast) => (
            <Card key={podcast.id} className="overflow-hidden">
              <div className="aspect-video relative bg-muted">
                {podcast.coverImage ? (
                  <img 
                    src={podcast.coverImage} 
                    alt={podcast.title}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                    No cover image
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle>{podcast.title}</CardTitle>
                <CardDescription className="line-clamp-2">{podcast.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>{podcast.episodes?.length || 0} episodes</span>
                  <span className="mx-2">•</span>
                  <span>Last updated {new Date(podcast.updated_at).toLocaleDateString()}</span>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => router.push(`/podcast/${podcast.id}/setup`)}
                >
                  Settings
                </Button>
                <Button 
                  className="flex-1"
                  onClick={() => router.push(`/podcast/${podcast.id}/episodes`)}
                >
                  Episodes
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
