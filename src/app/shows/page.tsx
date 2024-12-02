"use client"

import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { ShowCollection } from '@/components/collections/ShowCollection'
import { ShowDetail } from '@/components/modals/show-detail'
import { PageHeader } from '@/components/layout/page-header'
import { useAuth } from '@/lib/auth'
import { useState } from 'react'

export default function ShowsPage() {
  const { user } = useAuth()
  const [showModal, setShowModal] = useState(false)

  return (
    <MainLayout>
      <div className="max-w-[1200px] mx-auto px-6">
        <PageHeader
          title="All Shows"
          description="Manage your show presets and templates"
          action={{
            label: "Create New Show",
            onClick: () => setShowModal(true)
          }}
        />

        {/* Filters */}
        <div className="flex gap-2 mb-8">
          <Button variant="outline" size="sm" className="rounded-full">
            All Shows
          </Button>
          <Button variant="ghost" size="sm" className="rounded-full">
            Active
          </Button>
          <Button variant="ghost" size="sm" className="rounded-full">
            Drafts
          </Button>
          <Button variant="ghost" size="sm" className="rounded-full">
            Archived
          </Button>
        </div>

        {/* Shows Collection */}
        <ShowCollection variant="full" />
      </div>

      <ShowDetail
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        userId={user?.id || ""}
        mode="create"
        onSave={() => {
          setShowModal(false)
        }}
      />
    </MainLayout>
  )
}
