"use client"

import * as React from "react"
import { DetailView, type DetailTab } from "@/components/ui/detail-view"
import { BaseModal } from "@/components/ui/base-modal"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Settings, Mic2, X, Radio } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createShow, updateShow, deleteShow } from "@/lib/api/shows"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import type { Show as DBShow } from '@/lib/supabase'
import { getCharacters } from "@/lib/api/characters"
import { getTopics } from "@/lib/api/topics"
import type { Character, Topic } from "@/lib/supabase"
import { ScrollArea } from "@/components/ui/scroll-area"

export interface Show {
  id: string
  name: string
  description?: string
  character_ids: string[]
  topic_ids: string[]
  episode_count?: number
  duration: string
  tone: string
  format: string
  user_id: string
  created_at?: string
}

interface ShowDetailProps {
  isOpen: boolean
  onClose: () => void
  show?: Show
  userId: string
  onSave?: () => void
  mode?: 'view' | 'edit' | 'create'
}

export function ShowDetail({ 
  isOpen, 
  onClose, 
  show,
  userId,
  onSave,
  mode: initialMode = 'view'
}: ShowDetailProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [mode, setMode] = React.useState(initialMode)
  const [form, setForm] = React.useState({
    name: show?.name || "",
    description: show?.description || "",
    character_ids: show?.character_ids || [],
    topic_ids: show?.topic_ids || [],
    duration: show?.duration || "30",
    tone: show?.tone || "Casual",
    format: show?.format || "Discussion"
  })

  const [characters, setCharacters] = React.useState<Character[]>([])
  const [topics, setTopics] = React.useState<Topic[]>([])
  const [loading, setLoading] = React.useState(true)

  // Reset form and fetch data when show changes or modal opens
  React.useEffect(() => {
    if (isOpen) {
      setForm({
        name: show?.name || "",
        description: show?.description || "",
        character_ids: show?.character_ids || [],
        topic_ids: show?.topic_ids || [],
        duration: show?.duration || "30",
        tone: show?.tone || "Casual",
        format: show?.format || "Discussion"
      })
      setMode(initialMode)
      
      // Fetch characters and topics
      const fetchData = async () => {
        setLoading(true)
        try {
          const [charactersData, topicsData] = await Promise.all([
            getCharacters(userId),
            getTopics(userId)
          ])
          setCharacters(charactersData)
          setTopics(topicsData)
        } catch (error) {
          console.error('Failed to fetch data:', error)
          toast({
            title: "Error",
            description: "Failed to load characters and topics",
            variant: "destructive",
          })
        } finally {
          setLoading(false)
        }
      }
      fetchData()
    }
  }, [isOpen, show, initialMode, userId])

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a show name",
        variant: "destructive",
      })
      return
    }

    try {
      if (mode === 'create') {
        const newShow = await createShow({
          name: form.name,
          description: form.description,
          character_ids: form.character_ids,
          topic_ids: form.topic_ids,
          duration: form.duration,
          tone: form.tone,
          format: form.format,
          user_id: userId
        })
        toast({
          title: "Success",
          description: "Show created successfully",
        })
        // Redirect to the show detail page
        router.push(`/shows/${newShow.id}`)
      } else {
        await updateShow(show!.id, {
          name: form.name,
          description: form.description,
          character_ids: form.character_ids,
          topic_ids: form.topic_ids,
          duration: form.duration,
          tone: form.tone,
          format: form.format
        })
        toast({
          title: "Success",
          description: "Show updated successfully",
        })
      }
      onSave?.()
      onClose()
    } catch (error) {
      console.error('Error saving show:', error)
      toast({
        title: "Error",
        description: mode === 'create' ? "Failed to create show" : "Failed to update show",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    if (!show?.id) return
    
    try {
      await deleteShow(show.id)
      toast({
        title: "Success",
        description: "Show deleted successfully",
      })
      onSave?.() // Trigger parent update
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete show",
        variant: "destructive",
      })
    }
  }

  const selectedCharacters = characters.filter(c => form.character_ids.includes(c.id))
  const selectedTopics = topics.filter(t => form.topic_ids.includes(t.id))

  const tabs: DetailTab[] = [
    {
      id: 'overview',
      label: 'Overview',
      content: mode === 'view' ? (
        <div className="flex flex-col items-center space-y-8 py-6">
          {/* Show Icon */}
          <div className="inline-flex items-center justify-center h-24 w-24 rounded-xl bg-secondary">
            <Radio className="h-12 w-12 text-secondary-foreground" />
          </div>

          {/* Title and Stats */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold">{form.name}</h2>
            <div className="flex gap-3 text-sm text-muted-foreground">
              <span>{form.episode_count || 0} Episodes</span>
              <span>•</span>
              <span>{selectedCharacters.length} Characters</span>
              <span>•</span>
              <span>{selectedTopics.length} Topics</span>
            </div>
          </div>

          {/* Description */}
          <div className="text-center max-w-lg">
            <p className="text-muted-foreground">{form.description}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 w-full max-w-lg">
            {/* Duration */}
            <div className="text-center p-4 rounded-lg border space-y-2">
              <div className="text-sm text-muted-foreground">Duration</div>
              <div className="font-medium">{form.duration} mins</div>
            </div>

            {/* Tone */}
            <div className="text-center p-4 rounded-lg border space-y-2">
              <div className="text-sm text-muted-foreground">Tone</div>
              <div className="font-medium">{form.tone}</div>
            </div>

            {/* Format */}
            <div className="text-center p-4 rounded-lg border space-y-2">
              <div className="text-sm text-muted-foreground">Format</div>
              <div className="font-medium">{form.format}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8 py-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter show name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter show description"
                className="h-32"
              />
            </div>
          </div>

          {/* Settings Grid */}
          <div className="space-y-4">
            <h3 className="font-medium">Show Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Duration */}
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <select
                  id="duration"
                  value={form.duration}
                  onChange={e => setForm(prev => ({
                    ...prev,
                    duration: e.target.value
                  }))}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                </select>
              </div>

              {/* Tone */}
              <div className="space-y-2">
                <Label htmlFor="tone">Tone</Label>
                <select
                  id="tone"
                  value={form.tone}
                  onChange={e => setForm(prev => ({
                    ...prev,
                    tone: e.target.value
                  }))}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="Casual">Casual</option>
                  <option value="Professional">Professional</option>
                  <option value="Educational">Educational</option>
                  <option value="Entertainment">Entertainment</option>
                </select>
              </div>

              {/* Format */}
              <div className="space-y-2">
                <Label htmlFor="format">Format</Label>
                <select
                  id="format"
                  value={form.format}
                  onChange={e => setForm(prev => ({
                    ...prev,
                    format: e.target.value
                  }))}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="Discussion">Discussion</option>
                  <option value="Interview">Interview</option>
                  <option value="Debate">Debate</option>
                  <option value="Storytelling">Storytelling</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'cast-topics',
      label: 'Cast & Topics',
      content: mode === 'view' ? (
        <div className="flex flex-col items-center space-y-8 py-6">
          {/* Characters Section */}
          <div className="w-full max-w-2xl space-y-4">
            <h3 className="text-lg font-medium text-center">Cast</h3>
            {selectedCharacters.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {selectedCharacters.map(character => (
                  <div
                    key={character.id}
                    className="flex flex-col items-center p-4 rounded-lg border space-y-3 text-center"
                  >
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={character.avatar || ''} alt={character.name} />
                      <AvatarFallback>{character.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{character.name}</p>
                      <p className="text-sm text-muted-foreground">{character.role || 'No role'}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border rounded-lg text-muted-foreground">
                No characters selected
              </div>
            )}
          </div>

          {/* Topics Section */}
          <div className="w-full max-w-2xl space-y-4">
            <h3 className="text-lg font-medium text-center">Topics</h3>
            {selectedTopics.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {selectedTopics.map(topic => (
                  <div
                    key={topic.id}
                    className="flex flex-col p-4 rounded-lg border space-y-2"
                  >
                    <p className="font-medium text-center">{topic.name}</p>
                    {topic.tags && topic.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 justify-center">
                        {topic.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {topic.sources && topic.sources.length > 0 && (
                      <p className="text-xs text-muted-foreground text-center">
                        {topic.sources.length} source{topic.sources.length !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border rounded-lg text-muted-foreground">
                No topics selected
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-8 py-6">
          {/* Characters Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Select Characters</h3>
              <span className="text-sm text-muted-foreground">
                {selectedCharacters.length} selected
              </span>
            </div>
            <ScrollArea className="h-[200px] rounded-md border p-4">
              <div className="grid grid-cols-2 gap-4">
                {characters.map(character => {
                  const isSelected = form.character_ids.includes(character.id)
                  return (
                    <div
                      key={character.id}
                      className={`flex items-center space-x-4 p-3 rounded-lg border cursor-pointer transition-colors ${
                        isSelected ? 'bg-secondary border-primary' : 'hover:bg-secondary/50'
                      }`}
                      onClick={() => {
                        setForm(prev => ({
                          ...prev,
                          character_ids: isSelected
                            ? prev.character_ids.filter(id => id !== character.id)
                            : [...prev.character_ids, character.id]
                        }))
                      }}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={character.avatar || ''} alt={character.name} />
                        <AvatarFallback>{character.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{character.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {character.role || 'No role'}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Topics Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Select Topics</h3>
              <span className="text-sm text-muted-foreground">
                {selectedTopics.length} selected
              </span>
            </div>
            <ScrollArea className="h-[200px] rounded-md border p-4">
              <div className="grid grid-cols-2 gap-4">
                {topics.map(topic => {
                  const isSelected = form.topic_ids.includes(topic.id)
                  return (
                    <div
                      key={topic.id}
                      className={`flex items-center space-x-4 p-3 rounded-lg border cursor-pointer transition-colors ${
                        isSelected ? 'bg-secondary border-primary' : 'hover:bg-secondary/50'
                      }`}
                      onClick={() => {
                        setForm(prev => ({
                          ...prev,
                          topic_ids: isSelected
                            ? prev.topic_ids.filter(id => id !== topic.id)
                            : [...prev.topic_ids, topic.id]
                        }))
                      }}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{topic.name}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {topic.tags?.slice(0, 2).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          </div>
        </div>
      )
    }
  ]

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? "Create Show" : show?.name || "Show Details"}
      description={mode === 'create' ? "Create a new show" : undefined}
      mode={mode}
      onEdit={() => setMode('edit')}
      onExitEdit={() => setMode('view')}
      onSave={handleSave}
      onDelete={handleDelete}
      createText="Create Show"
    >
      <DetailView tabs={tabs} />
    </BaseModal>
  )
}
