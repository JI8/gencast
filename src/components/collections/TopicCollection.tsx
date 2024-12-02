"use client"

import * as React from "react"
import { Collection } from "@/components/ui/collection"
import { TopicCard } from "@/components/cards/topic-card"
import { TopicDetail } from "@/components/modals/topic-detail"
import { useAuth } from "@/lib/auth"
import { getTopics } from "@/lib/api/topics"
import type { Topic } from "@/lib/supabase"

interface TopicCollectionProps {
  variant?: "full" | "preview"
}

export function TopicCollection({ variant = "preview" }: TopicCollectionProps) {
  const { user } = useAuth()
  const [topics, setTopics] = React.useState<Topic[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [showCreateModal, setShowCreateModal] = React.useState(false)

  React.useEffect(() => {
    if (user) {
      getTopics(user.id)
        .then(setTopics)
        .finally(() => setIsLoading(false))
    }
  }, [user])

  return (
    <>
      <Collection
        title="Your Topics"
        description="Content and discussion topics for your shows"
        items={topics}
        isLoading={isLoading}
        renderItem={(topic, onClick) => (
          <TopicCard
            key={topic.id}
            {...topic}
            onClick={onClick}
          />
        )}
        renderDetail={(topic, isOpen, onClose) => (
          <TopicDetail
            topic={topic}
            isOpen={isOpen}
            onClose={onClose}
            userId={user?.id || ""}
            onSave={() => {
              // Refresh topics after update
              if (user) {
                getTopics(user.id).then(setTopics)
              }
            }}
          />
        )}
        onCreateNew={() => setShowCreateModal(true)}
        createNewText="Create new Topic"
        viewAllHref={variant === "preview" ? "/topics" : undefined}
      />

      {/* Create Topic Modal */}
      <TopicDetail
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        userId={user?.id || ""}
        mode="create"
        onSave={() => {
          setShowCreateModal(false)
          // Refresh topics after creation
          if (user) {
            getTopics(user.id).then(setTopics)
          }
        }}
      />
    </>
  )
}
