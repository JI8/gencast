"use client"

import { useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { CharacterCollection } from '@/components/collections/CharacterCollection'
import { CharacterDetail } from '@/components/modals/character-detail'
import { PageHeader } from '@/components/layout/page-header'
import { useAuth } from '@/lib/auth'

export default function CharactersPage() {
  const { user } = useAuth()
  const [showModal, setShowModal] = useState(false)

  return (
    <MainLayout>
      <div className="max-w-[1200px] mx-auto px-6">
        <PageHeader
          title="All Characters"
          description="Manage your character presets and templates"
          action={{
            label: "Create New Character",
            onClick: () => setShowModal(true)
          }}
        />

        {/* Filters */}
        <div className="flex gap-2 mb-8">
          <Button variant="outline" size="sm" className="rounded-full">
            All Characters
          </Button>
          <Button variant="ghost" size="sm" className="rounded-full">
            Hosts
          </Button>
          <Button variant="ghost" size="sm" className="rounded-full">
            Experts
          </Button>
          <Button variant="ghost" size="sm" className="rounded-full">
            Guests
          </Button>
        </div>

        {/* Characters Collection */}
        <CharacterCollection variant="full" />
      </div>

      <CharacterDetail
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
