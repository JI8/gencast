"use client"

import * as React from "react"
import { useToast } from "@/components/ui/use-toast"
import { BaseModal } from "@/components/ui/base-modal"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createCharacter, updateCharacter, deleteCharacter } from "@/lib/api/characters"
import { DetailView, type DetailTab } from "@/components/ui/detail-view"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mic2, Radio, Settings, Plus } from "lucide-react"

export interface Character {
  id: string
  name: string
  description?: string
  role?: string
  avatar?: string
  traits?: string[]
  show_count?: number
  episode_count?: number
  voice_settings?: {
    pitch: number
    speed: number
    style: string
  }
  user_id: string
}

interface CharacterDetailProps {
  isOpen: boolean
  onClose: () => void
  character?: Character
  userId: string
  onSave?: () => void
  onDelete?: () => void
  mode?: 'view' | 'edit' | 'create'
}

export function CharacterDetail({ 
  isOpen, 
  onClose, 
  character,
  userId,
  onSave,
  onDelete,
  mode: initialMode = 'view'
}: CharacterDetailProps) {
  const { toast } = useToast()
  const [mode, setMode] = React.useState(initialMode)
  const [form, setForm] = React.useState({
    name: character?.name || "",
    description: character?.description || "",
    role: character?.role || "",
    traits: character?.traits || [],
    voice_settings: character?.voice_settings || {
      pitch: 1.0,
      speed: 1.0,
      style: "Natural"
    }
  })

  // Reset form when character changes or modal opens
  React.useEffect(() => {
    if (isOpen) {
      setForm({
        name: character?.name || "",
        description: character?.description || "",
        role: character?.role || "",
        traits: character?.traits || [],
        voice_settings: character?.voice_settings || {
          pitch: 1.0,
          speed: 1.0,
          style: "Natural"
        }
      })
      setMode(initialMode)
    }
  }, [isOpen, character, initialMode])

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a character name",
        variant: "destructive",
      })
      return
    }

    try {
      if (mode === 'create') {
        await createCharacter({
          name: form.name,
          description: form.description,
          role: form.role,
          traits: form.traits,
          voice_settings: form.voice_settings,
          user_id: userId
        })
        toast({
          title: "Success",
          description: "Character created successfully",
        })
      } else {
        await updateCharacter(character!.id, {
          name: form.name,
          description: form.description,
          role: form.role,
          traits: form.traits,
          voice_settings: form.voice_settings
        })
        toast({
          title: "Success",
          description: "Character updated successfully",
        })
      }
      onSave?.()
      onClose()
    } catch (error) {
      console.error('Error saving character:', error)
      toast({
        title: "Error",
        description: mode === 'create' ? "Failed to create character" : "Failed to update character",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    if (!character?.id) return
    
    try {
      await deleteCharacter(character.id)
      toast({
        title: "Success",
        description: "Character deleted successfully",
      })
      onDelete?.()
    } catch (error) {
      console.error('Error deleting character:', error)
      toast({
        title: "Error",
        description: "Failed to delete character",
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
          {/* Avatar */}
          <Avatar className="h-32 w-32">
            <AvatarImage src={character?.avatar} />
            <AvatarFallback className="text-3xl">{form.name?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>

          {/* Name and Role */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold">{form.name}</h2>
            <Badge variant="secondary" className="text-sm">
              {form.role}
            </Badge>
          </div>

          {/* Description */}
          <div className="text-center max-w-lg">
            <p className="text-muted-foreground">{form.description}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-8 pt-4">
            <div className="text-center space-y-1">
              <div className="text-2xl font-semibold">{character?.show_count || 0}</div>
              <div className="text-sm text-muted-foreground">Shows</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-2xl font-semibold">{character?.episode_count || 0}</div>
              <div className="text-sm text-muted-foreground">Episodes</div>
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
              placeholder="Enter character name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
              disabled={mode === 'view'}
              placeholder="Enter character description"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              value={form.role}
              onChange={e => setForm(prev => ({ ...prev, role: e.target.value }))}
              disabled={mode === 'view'}
              placeholder="Enter character role"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="traits">Traits</Label>
            <Input
              id="traits"
              value={form.traits.join(', ')}
              onChange={e => setForm(prev => ({ ...prev, traits: e.target.value.split(',').map(t => t.trim()) }))}
              disabled={mode === 'view'}
              placeholder="Enter character traits"
            />
          </div>
        </div>
      )
    },
    {
      id: "voice",
      label: "Voice Settings",
      content: mode === 'view' ? (
        <div className="flex flex-col items-center space-y-8 py-6">
          {/* Voice Type */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-secondary">
              <Mic2 className="h-8 w-8 text-secondary-foreground" />
            </div>
            <div className="space-y-1">
              <h3 className="font-medium">{form.voice_settings.style}</h3>
              <p className="text-sm text-muted-foreground">
                Pitch: {form.voice_settings.pitch}, Speed: {form.voice_settings.speed}
              </p>
            </div>
          </div>

          {/* Preview Button */}
          <Button variant="outline" className="w-full max-w-xs" disabled>
            <Mic2 className="mr-2 h-4 w-4" />
            Preview Voice
            <Badge variant="secondary" className="ml-2">Coming Soon</Badge>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="voice-style">Voice Style</Label>
            <select
              id="voice-style"
              value={form.voice_settings.style}
              onChange={e => setForm(prev => ({ ...prev, voice_settings: { ...prev.voice_settings, style: e.target.value } }))}
              disabled={mode === 'view'}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="Natural">Natural</option>
              <option value="Friendly">Friendly</option>
              <option value="Professional">Professional</option>
              <option value="Casual">Casual</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="voice-pitch">Voice Pitch</Label>
            <Input
              id="voice-pitch"
              type="number"
              value={form.voice_settings.pitch}
              onChange={e => setForm(prev => ({ ...prev, voice_settings: { ...prev.voice_settings, pitch: parseFloat(e.target.value) } }))}
              disabled={mode === 'view'}
              placeholder="Enter voice pitch"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="voice-speed">Voice Speed</Label>
            <Input
              id="voice-speed"
              type="number"
              value={form.voice_settings.speed}
              onChange={e => setForm(prev => ({ ...prev, voice_settings: { ...prev.voice_settings, speed: parseFloat(e.target.value) } }))}
              disabled={mode === 'view'}
              placeholder="Enter voice speed"
            />
          </div>

          {mode !== 'view' && (
            <div className="rounded-md bg-muted p-4">
              <div className="flex items-center gap-2 text-sm">
                <Radio className="h-4 w-4 text-muted-foreground" />
                <span>Voice preview coming soon</span>
              </div>
            </div>
          )}
        </div>
      )
    }
  ]

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? "Create Character" : "Character Details"}
      description={mode === 'create' ? "Create a new character" : undefined}
      mode={mode}
      onEdit={() => setMode('edit')}
      onExitEdit={() => setMode('view')}
      onSave={handleSave}
      onDelete={handleDelete}
      createText="Create Character"
    >
      <DetailView tabs={tabs} />
    </BaseModal>
  )
}
