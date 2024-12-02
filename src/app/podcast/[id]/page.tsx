"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { usePodcastEpisode } from '@/hooks/usePodcastEpisode'
import { StoryboardPanel } from '@/components/storyboard/StoryboardPanel'
import { SettingsPanel } from '@/components/settings/SettingsPanel'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/components/ui/use-toast'
import { Skeleton } from '@/components/ui/skeleton'

export default function PodcastPage() {
  const params = useParams()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('content')
  const { episode, loading, error, saveEpisode } = usePodcastEpisode(params.id as string)

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      })
    }
  }, [error, toast])

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-32 mt-2" />
            </div>
            <Skeleton className="h-10 w-24" />
          </div>
          <Tabs defaultValue="content" className="space-y-6">
            <TabsList>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="content">
              <Skeleton className="h-[600px] w-full" />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    )
  }

  const handleSave = async () => {
    try {
      await saveEpisode()
      toast({
        title: "Success",
        description: "Episode saved successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save episode",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{episode?.title || 'Untitled Episode'}</h1>
            <p className="text-muted-foreground">
              Last updated: {episode?.updated_at ? new Date(episode.updated_at).toLocaleString() : 'Never'}
            </p>
          </div>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>

        <Tabs defaultValue="content" className="space-y-6">
          <TabsList>
            <TabsTrigger 
              value="content" 
              onClick={() => setActiveTab('content')}
            >
              Content
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content">
            <StoryboardPanel />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
