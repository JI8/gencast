"use client"

import * as React from "react"
import { ContentCard } from "@/components/ui/content-card"
import { SectionHeader } from "@/components/layout/SectionHeader"

interface CollectionProps<T> {
  title: string
  description: string
  items: T[]
  renderItem: (item: T, onClick: () => void) => React.ReactNode
  renderDetail: (item: T, isOpen: boolean, onClose: () => void) => React.ReactNode
  onCreateNew?: () => void
  createNewText?: string
  viewAllHref?: string
  viewAllLabel?: string
}

export function Collection<T>({
  title,
  description,
  items,
  renderItem,
  renderDetail,
  onCreateNew,
  createNewText = "Create new",
  viewAllHref,
  viewAllLabel = "View all"
}: CollectionProps<T>) {
  const [selectedItem, setSelectedItem] = React.useState<T | null>(null)

  return (
    <div className="space-y-8">
      <SectionHeader
        title={title}
        description={description}
        link={viewAllHref ? {
          href: viewAllHref,
          label: viewAllLabel
        } : undefined}
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {onCreateNew && (
          <ContentCard 
            isNew 
            newText={createNewText}
            onClick={onCreateNew}
            className="h-full"
          />
        )}

        {items.map((item, index) => (
          <div key={index} className="h-full">
            {renderItem(item, () => setSelectedItem(item))}
          </div>
        ))}
      </div>

      {selectedItem && renderDetail(
        selectedItem,
        true,
        () => setSelectedItem(null)
      )}
    </div>
  )
}
