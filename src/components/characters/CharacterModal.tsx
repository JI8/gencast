"use client"

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/Dialog'
import { Character } from '@/types/character'

interface CharacterModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (character: Omit<Character, 'id'>) => void
  initialCharacter?: Character
}

export function CharacterModal({
  open,
  onOpenChange,
  onSave,
  initialCharacter,
}: CharacterModalProps) {
  const [character, setCharacter] = useState<Partial<Character>>(
    initialCharacter || {
      name: '',
      description: '',
      role: '',
      background: '',
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (character.name && character.description && character.role && character.background) {
      onSave(character as Omit<Character, 'id'>)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialCharacter ? 'Edit Character' : 'Create Character'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Name
              <input
                type="text"
                value={character.name}
                onChange={(e) =>
                  setCharacter({ ...character, name: e.target.value })
                }
                className="w-full mt-1 p-2 border border-input rounded-md"
                placeholder="Character name"
              />
            </label>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Role
              <input
                type="text"
                value={character.role}
                onChange={(e) =>
                  setCharacter({ ...character, role: e.target.value })
                }
                className="w-full mt-1 p-2 border border-input rounded-md"
                placeholder="e.g., Host, Expert, Interviewer"
              />
            </label>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Description
              <textarea
                value={character.description}
                onChange={(e) =>
                  setCharacter({ ...character, description: e.target.value })
                }
                className="w-full mt-1 p-2 border border-input rounded-md h-20"
                placeholder="Brief description of the character"
              />
            </label>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Background
              <textarea
                value={character.background}
                onChange={(e) =>
                  setCharacter({ ...character, background: e.target.value })
                }
                className="w-full mt-1 p-2 border border-input rounded-md h-20"
                placeholder="Character's background and expertise"
              />
            </label>
          </div>
          <DialogFooter>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 text-sm border border-input rounded-md hover:bg-accent"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Save
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
