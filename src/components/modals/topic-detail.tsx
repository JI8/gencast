"use client"

import * as React from "react"
import { BaseModal } from "@/components/ui/base-modal"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { createTopic, updateTopic, deleteTopic } from "@/lib/api/topics"
import { useToast } from "@/components/ui/use-toast"
import type { Topic as DBTopic } from '@/lib/supabase'
import { MessageSquare, Link2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DetailView } from "@/components/ui/detail-view"

export interface Topic {
  id: string
  name: string
  description: string
  tags: string[]
  sources: string[]
  show_count: number
  episode_count: number
  user_id?: string
}

interface TopicDetailProps {
  isOpen: boolean
  onClose: () => void
  topic?: Topic
  userId: string
  onSave?: () => void
  onDelete?: () => void
  mode?: 'view' | 'edit' | 'create'
}

interface DetailTab {
  id: string
  label: string
  content: JSX.Element
}

export function TopicDetail({ 
  isOpen, 
  onClose, 
  topic,
  userId,
  onSave,
  onDelete,
  mode: initialMode = 'view'
}: TopicDetailProps) {
  const { toast } = useToast()
  const [mode, setMode] = React.useState(initialMode)
  const [form, setForm] = React.useState({
    name: topic?.name || "",
    description: topic?.description || "",
    tags: topic?.tags || [],
    sources: topic?.sources || []
  })

  // Reset form when topic changes or modal opens
  React.useEffect(() => {
    if (isOpen) {
      setForm({
        name: topic?.name || "",
        description: topic?.description || "",
        tags: topic?.tags || [],
        sources: topic?.sources || []
      })
      setMode(initialMode)
    }
  }, [isOpen, topic, initialMode])

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a topic name",
        variant: "destructive",
      })
      return
    }

    try {
      if (mode === 'create') {
        await createTopic({
          name: form.name,
          description: form.description,
          tags: form.tags,
          sources: form.sources,
          user_id: userId
        })
        toast({
          title: "Success",
          description: "Topic created successfully",
        })
      } else {
        await updateTopic(topic!.id, {
          name: form.name,
          description: form.description,
          tags: form.tags,
          sources: form.sources,
        })
        toast({
          title: "Success",
          description: "Topic updated successfully",
        })
      }
      onSave?.()
    } catch (error) {
      toast({
        title: "Error",
        description: mode === 'create' ? "Failed to create topic" : "Failed to update topic",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    if (!topic?.id) return
    
    try {
      await deleteTopic(topic.id)
      toast({
        title: "Success",
        description: "Topic deleted successfully",
      })
      onDelete?.()
    } catch (error) {
      console.error('Error deleting topic:', error)
      toast({
        title: "Error",
        description: "Failed to delete topic",
        variant: "destructive",
      })
    }
  }

  const tabs: DetailTab[] = [
    {
      id: "overview",
      label: "Overview",
      content: mode === 'view' ? (
        <div className="flex flex-col items-center space-y-8 py-6">
          {/* Topic Icon */}
          <div className="inline-flex items-center justify-center h-24 w-24 rounded-xl bg-secondary">
            <MessageSquare className="h-12 w-12 text-secondary-foreground" />
          </div>

          {/* Title and Stats */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold">{form.name}</h2>
            <div className="flex gap-3 text-sm text-muted-foreground">
              <span>{form.tags?.length || 0} Tags</span>
              <span>•</span>
              <span>{form.sources?.length || 0} Sources</span>
            </div>
          </div>

          {/* Description */}
          <div className="text-center max-w-lg">
            <p className="text-muted-foreground">{form.description}</p>
          </div>

          {/* Tags */}
          <div className="w-full max-w-lg space-y-4">
            <h3 className="text-center font-medium">Tags</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {form.tags?.map((tag, index) => (
                <Badge key={index} variant="secondary">{tag}</Badge>
              ))}
              {(!form.tags || form.tags.length === 0) && (
                <div className="w-full text-center py-8 border rounded-lg text-muted-foreground">
                  No tags added yet
                </div>
              )}
            </div>
          </div>

          {/* Sources */}
          <div className="w-full max-w-lg space-y-4">
            <h3 className="text-center font-medium">Sources</h3>
            <div className="grid gap-3">
              {form.sources?.map((source, index) => (
                <div key={index} className="p-4 rounded-lg border">
                  <div className="flex items-start gap-3">
                    <Link2 className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div className="space-y-1 min-w-0">
                      <div className="font-medium truncate">{source.title || 'Untitled Source'}</div>
                      <div className="text-sm text-muted-foreground break-all">{source.url}</div>
                    </div>
                  </div>
                </div>
              ))}
              {(!form.sources || form.sources.length === 0) && (
                <div className="text-center py-8 border rounded-lg text-muted-foreground">
                  No sources added yet
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
              disabled={mode === 'view'}
              placeholder="Enter topic name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
              disabled={mode === 'view'}
              placeholder="Enter topic description"
            />
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2">
              {form.tags?.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                  {mode !== 'view' && (
                    <button
                      onClick={() => {
                        setForm(prev => ({
                          ...prev,
                          tags: prev.tags?.filter((_, i) => i !== index)
                        }))
                      }}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  )}
                </Badge>
              ))}
              {mode !== 'view' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const tag = window.prompt('Enter tag name')
                    if (tag) {
                      setForm(prev => ({
                        ...prev,
                        tags: [...(prev.tags || []), tag]
                      }))
                    }
                  }}
                >
                  Add Tag
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Sources</Label>
            <div className="space-y-3">
              {form.sources?.map((source, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                  <Link2 className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
                  <div className="space-y-2 flex-grow min-w-0">
                    <Input
                      value={source.title}
                      onChange={e => {
                        const newSources = [...(form.sources || [])]
                        newSources[index] = { ...source, title: e.target.value }
                        setForm(prev => ({ ...prev, sources: newSources }))
                      }}
                      disabled={mode === 'view'}
                      placeholder="Source title"
                    />
                    <Input
                      value={source.url}
                      onChange={e => {
                        const newSources = [...(form.sources || [])]
                        newSources[index] = { ...source, url: e.target.value }
                        setForm(prev => ({ ...prev, sources: newSources }))
                      }}
                      disabled={mode === 'view'}
                      placeholder="Source URL"
                    />
                  </div>
                  {mode !== 'view' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setForm(prev => ({
                          ...prev,
                          sources: prev.sources?.filter((_, i) => i !== index)
                        }))
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              {mode !== 'view' && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setForm(prev => ({
                      ...prev,
                      sources: [...(prev.sources || []), { title: '', url: '' }]
                    }))
                  }}
                >
                  Add Source
                </Button>
              )}
            </div>
          </div>
        </div>
      )
    }
  ]

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? "Create Topic" : "Topic Details"}
      description={mode === 'create' ? "Create a new topic" : undefined}
      mode={mode}
      onEdit={() => setMode('edit')}
      onExitEdit={() => setMode('view')}
      onSave={handleSave}
      onDelete={handleDelete}
      createText="Create Topic"
    >
      <DetailView tabs={tabs} />
    </BaseModal>
  )
}
