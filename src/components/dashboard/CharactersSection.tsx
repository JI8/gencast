"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { Skeleton } from '@/components/ui/skeleton'
import { useCharacters } from '@/hooks/useCharacters'

export function CharactersSection() {
  const { characters, loading, createCharacter } = useCharacters()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCharacters = characters.filter(char => 
    char.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    char.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-9 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative w-64">
          <Input
            type="text"
            placeholder="Search characters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
          <MagnifyingGlassIcon className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
        </div>
        <Button onClick={() => createCharacter()}>Create Character</Button>
      </div>

      {filteredCharacters.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No characters found</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCharacters.map((character) => (
            <Card key={character.id}>
              <CardHeader>
                <CardTitle>{character.name}</CardTitle>
                <CardDescription>{character.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm">
                    Voice: <span className="font-medium">{character.voice}</span>
                  </div>
                  <div className="text-sm">
                    Personality: <span className="font-medium">{character.personality}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {/* TODO: Edit character */}}
                >
                  Edit Character
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
