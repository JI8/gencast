"use client"

import * as React from "react"
import { Collection } from "@/components/ui/collection"
import { ShowCard } from "@/components/cards/show-card"
import { ShowDetail } from "@/components/modals/show-detail"
import { useAuth } from "@/lib/auth"
import { getShows } from "@/lib/api/shows"
import type { Show } from "@/lib/supabase"

// Move this to a separate types file later
export interface Show {
  id: string
  name: string
  description: string
  characters: Array<{
    name: string
    role: string
    avatar?: string
  }>
  topics: string[]
  episode_count: number
  settings?: {
    duration: string
    tone: string
    format: string
  }
}

interface ShowCollectionProps {
  variant?: "full" | "preview"
}

export function ShowCollection({ variant = "preview" }: ShowCollectionProps) {
  const { user } = useAuth()
  const [shows, setShows] = React.useState<Show[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [showCreateModal, setShowCreateModal] = React.useState(false)

  React.useEffect(() => {
    if (user) {
      getShows(user.id)
        .then(setShows)
        .finally(() => setIsLoading(false))
    }
  }, [user])

  return (
    <>
      <Collection
        title="Your Shows"
        description="Templates to generate new episodes"
        items={shows}
        isLoading={isLoading}
        renderItem={(show, onClick) => (
          <ShowCard
            key={show.id}
            id={show.id}
            title={show.name}
            description={show.description}
            character_ids={show.character_ids}
            topic_ids={show.topic_ids}
            episodeCount={show.episode_count}
            onClick={onClick}
            onCreateEpisode={() => console.log('Create episode', show.id)}
          />
        )}
        renderDetail={(show, isOpen, onClose) => (
          <ShowDetail
            show={show}
            isOpen={isOpen}
            onClose={onClose}
            userId={user?.id || ""}
            onSave={() => {
              // Refresh shows after update
              if (user) {
                getShows(user.id).then(setShows)
              }
            }}
          />
        )}
        onCreateNew={() => setShowCreateModal(true)}
        createNewText="Create new Show"
        viewAllHref={variant === "preview" ? "/shows" : undefined}
      />

      {/* Create Show Modal */}
      <ShowDetail
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        userId={user?.id || ""}
        mode="create"
        onSave={() => {
          setShowCreateModal(false)
          // Refresh shows after creation
          if (user) {
            getShows(user.id).then(setShows)
          }
        }}
      />
    </>
  )
}
