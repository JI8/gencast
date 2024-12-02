"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, MoreVertical, MessageSquare, Mic2 } from "lucide-react"
import { SectionHeader } from "@/components/layout/SectionHeader"
import { ContentCard } from "@/components/ui/content-card"
import { CharacterCard } from "@/components/cards/character-card"
import { Collection } from "@/components/ui/collection"
import { CharacterDetail } from "@/components/modals/character-detail"
import { getCharacters } from "@/lib/api/characters"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth"
import type { Character } from "@/lib/supabase"

interface CharacterCollectionProps {
  variant?: "full" | "preview"
}

export function CharacterCollection({ 
  variant = "preview",
}: CharacterCollectionProps) {
  const [characters, setCharacters] = React.useState<Character[]>([])
  const [loading, setLoading] = React.useState(true)
  const [isCreating, setIsCreating] = React.useState(false)
  const { toast } = useToast()
  const { user } = useAuth()

  const loadCharacters = React.useCallback(async () => {
    if (!user?.id) {
      setCharacters([])
      setLoading(false)
      return
    }

    try {
      const data = await getCharacters(user.id)
      setCharacters(data)
    } catch (error) {
      console.error('Error loading characters:', error)
      if (user?.id) {
        toast({
          title: "Error loading characters",
          description: "Please try again later",
          variant: "destructive"
        })
      }
    } finally {
      setLoading(false)
    }
  }, [user?.id, toast])

  React.useEffect(() => {
    loadCharacters()
  }, [loadCharacters])

  const handleCreateNew = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to create characters",
        variant: "destructive"
      })
      return
    }
    setIsCreating(true)
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <Collection
          title="Your Characters"
          description="Voices that bring your shows to life"
          items={[]}
          renderItem={() => null}
          renderDetail={() => null}
        />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Collection
        title="Your Characters"
        description="Voices that bring your shows to life"
        items={characters}
        renderItem={(character, onClick) => (
          <CharacterCard
            {...character}
            onClick={onClick}
            onPreviewVoice={() => console.log('Preview voice')}
          />
        )}
        renderDetail={(character, isOpen, onClose) => (
          <CharacterDetail
            character={character}
            isOpen={isOpen}
            onClose={onClose}
            userId={user?.id || ""}
            onSave={loadCharacters}
          />
        )}
        onCreateNew={handleCreateNew}
        createNewText="Create new Character"
        viewAllHref={variant === "preview" ? "/characters" : undefined}
      />

      {/* Create Modal - Only render when isCreating is true and we have a userId */}
      {isCreating && user?.id && (
        <CharacterDetail
          isOpen={true}
          onClose={() => setIsCreating(false)}
          userId={user.id}
          mode="create"
          onSave={() => {
            loadCharacters()
            setIsCreating(false)
          }}
        />
      )}
    </div>
  )
}
