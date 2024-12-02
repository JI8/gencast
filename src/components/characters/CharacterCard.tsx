"use client"

import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'
import { Character } from '@/types/character'

interface CharacterCardProps {
  character: Character
  onEdit?: (character: Character) => void
  onDelete?: (character: Character) => void
  selected?: boolean
  onSelect?: (character: Character) => void
}

export function CharacterCard({
  character,
  onEdit,
  onDelete,
  selected,
  onSelect,
}: CharacterCardProps) {
  return (
    <div
      className={`p-4 border rounded-lg transition-colors cursor-pointer ${
        selected
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/50'
      }`}
      onClick={() => onSelect?.(character)}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium">{character.name}</h3>
          <p className="text-sm text-muted-foreground">{character.role}</p>
        </div>
        {!character.isPreset && (
          <div className="flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onEdit?.(character)
              }}
              className="p-1 hover:bg-accent rounded"
            >
              <Pencil1Icon className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete?.(character)
              }}
              className="p-1 hover:bg-accent rounded text-destructive"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      <p className="mt-2 text-sm line-clamp-2">{character.description}</p>
    </div>
  )
}
