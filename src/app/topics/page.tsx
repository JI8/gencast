"use client"

import * as React from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { TopicCollection } from '@/components/collections/TopicCollection'
import { TopicDetail } from '@/components/modals/topic-detail'
import { useAuth } from '@/lib/auth'

export default function TopicsPage() {
  const { user } = useAuth()
  const [showCreateModal, setShowCreateModal] = React.useState(false)

  return (
    <MainLayout>
      {/* Header */}
      <div className="border-b">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight">All Topics</h1>
              <p className="text-sm text-muted-foreground">Browse and manage your content sources</p>
            </div>
            <Button onClick={() => setShowCreateModal(true)}>Create New Topic</Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {/* Filters */}
        <div className="flex gap-2 mb-8">
          <Button variant="outline" size="sm" className="rounded-full">
            All Topics
          </Button>
          <Button variant="ghost" size="sm" className="rounded-full">
            Technology
          </Button>
          <Button variant="ghost" size="sm" className="rounded-full">
            Business
          </Button>
          <Button variant="ghost" size="sm" className="rounded-full">
            Science
          </Button>
        </div>

        {/* Topics Collection */}
        <TopicCollection variant="full" />

      </div>

      {/* Create Topic Modal */}
      <TopicDetail
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        userId={user?.id || ""}
        mode="create"
        onSave={() => setShowCreateModal(false)}
      />
    </MainLayout>
  )
}
