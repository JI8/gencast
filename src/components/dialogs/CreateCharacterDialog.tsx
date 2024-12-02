"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CreateCharacterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateCharacterDialog({ open, onOpenChange }: CreateCharacterDialogProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [character, setCharacter] = useState({
    name: '',
    description: '',
    voice: 'natural',
    personality: 'friendly'
  })

  const handleCreate = async () => {
    if (!character.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a character name",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // TODO: Implement character creation with Supabase
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulated API call
      
      toast({
        title: "Success",
        description: "Character created successfully",
      })
      onOpenChange(false)
      setCharacter({
        name: '',
        description: '',
        voice: 'natural',
        personality: 'friendly'
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create character",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Character</DialogTitle>
          <DialogDescription>
            Create a new AI character for your podcasts. Define their personality and voice characteristics.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={character.name}
              onChange={(e) => setCharacter({ ...character, name: e.target.value })}
              placeholder="Character name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={character.description}
              onChange={(e) => setCharacter({ ...character, description: e.target.value })}
              placeholder="Describe your character's background and traits"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="voice">Voice Style</Label>
            <Select
              value={character.voice}
              onValueChange={(value) => setCharacter({ ...character, voice: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a voice style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="natural">Natural</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="energetic">Energetic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="personality">Personality</Label>
            <Select
              value={character.personality}
              onValueChange={(value) => setCharacter({ ...character, personality: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a personality type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="humorous">Humorous</SelectItem>
                <SelectItem value="serious">Serious</SelectItem>
                <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleCreate} disabled={loading}>
            {loading ? 'Creating...' : 'Create Character'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
