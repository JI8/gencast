"use client"

import { useState } from 'react'
import { PlusIcon } from '@radix-ui/react-icons'
import { Character, presetCharacters } from '@/types/character'
import { CharacterCard } from './CharacterCard'
import { CharacterModal } from './CharacterModal'
import { useCharacters } from '@/hooks/useCharacters'
import { TEMP_USER_ID } from '@/lib/temp-user'

export function CharacterPanel() {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCharacter, setEditingCharacter] = useState<Character | undefined>()

  const {
    characters,
    loading,
    error,
    createCharacter,
    updateCharacter,
    deleteCharacter,
  } = useCharacters(TEMP_USER_ID)

  const handleCreateCharacter = async (characterData: Omit<Character, 'id'>) => {
    try {
      await createCharacter(characterData)
      setIsModalOpen(false)
    } catch (err) {
      console.error('Failed to create character:', err)
      // TODO: Add proper error handling UI
    }
  }

  const handleEditCharacter = (character: Character) => {
    setEditingCharacter(character)
    setIsModalOpen(true)
  }

  const handleDeleteCharacter = async (character: Character) => {
    try {
      await deleteCharacter(character.id)
      if (selectedCharacter?.id === character.id) {
        setSelectedCharacter(null)
      }
    } catch (err) {
      console.error('Failed to delete character:', err)
      // TODO: Add proper error handling UI
    }
  }

  const handleUpdateCharacter = async (characterData: Omit<Character, 'id'>) => {
    if (!editingCharacter) return
    try {
      await updateCharacter(editingCharacter.id, characterData)
      setEditingCharacter(undefined)
      setIsModalOpen(false)
    } catch (err) {
      console.error('Failed to update character:', err)
      // TODO: Add proper error handling UI
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Characters</h2>
        <button 
          onClick={() => {
            setEditingCharacter(undefined)
            setIsModalOpen(true)
          }}
          className="p-2 hover:bg-accent rounded-full"
        >
          <PlusIcon className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-4">
          {/* Loading State */}
          {loading && (
            <div className="text-sm text-muted-foreground">
              Loading characters...
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-sm text-destructive">
              Error loading characters: {error}
            </div>
          )}

          {/* Preset Characters */}
          {!loading && !error && (
            <>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Preset Characters
                </h3>
                <div className="space-y-3">
                  {presetCharacters.map((character) => (
                    <CharacterCard
                      key={character.id}
                      character={character}
                      selected={selectedCharacter?.id === character.id}
                      onSelect={setSelectedCharacter}
                    />
                  ))}
                </div>
              </div>

              {/* Custom Characters */}
              {characters.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">
                    Custom Characters
                  </h3>
                  <div className="space-y-3">
                    {characters.map((character) => (
                      <CharacterCard
                        key={character.id}
                        character={character}
                        onEdit={handleEditCharacter}
                        onDelete={handleDeleteCharacter}
                        selected={selectedCharacter?.id === character.id}
                        onSelect={setSelectedCharacter}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {characters.length === 0 && presetCharacters.length === 0 && (
                <div className="text-sm text-muted-foreground">
                  No characters created yet. Click the + button to create one.
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <CharacterModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSave={editingCharacter ? handleUpdateCharacter : handleCreateCharacter}
        initialCharacter={editingCharacter}
      />
    </div>
  )
}
