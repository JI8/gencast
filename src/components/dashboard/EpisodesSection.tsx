"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { MagnifyingGlassIcon, ArrowUpIcon, ArrowDownIcon } from '@radix-ui/react-icons'
import { Skeleton } from '@/components/ui/skeleton'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useEpisodes } from '@/hooks/useEpisodes'

type SortField = 'title' | 'created_at' | 'status'
type SortOrder = 'asc' | 'desc'

export function EpisodesSection() {
  const router = useRouter()
  const { episodes, loading } = useEpisodes()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState<SortField>('created_at')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  const filteredEpisodes = episodes.filter(episode => 
    episode.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    episode.description.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }
    
    return sortOrder === 'asc' 
      ? (aValue > bValue ? 1 : -1)
      : (bValue > aValue ? 1 : -1)
  })

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

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
        <div className="flex items-center space-x-4">
          <div className="relative w-64">
            <Input
              type="text"
              placeholder="Search episodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
            <MagnifyingGlassIcon className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                Sort by
                {sortOrder === 'asc' ? (
                  <ArrowUpIcon className="h-4 w-4" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => toggleSort('title')}>
                Title
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleSort('created_at')}>
                Created Date
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleSort('status')}>
                Status
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {filteredEpisodes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No episodes found</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEpisodes.map((episode) => (
            <Card key={episode.id}>
              <CardHeader>
                <CardTitle>{episode.title}</CardTitle>
                <CardDescription>{episode.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm">
                    Show: <span className="font-medium">{episode.show_title}</span>
                  </div>
                  <div className="text-sm">
                    Status: <span className="font-medium capitalize">{episode.status}</span>
                  </div>
                  <div className="text-sm">
                    Created: <span className="font-medium">{new Date(episode.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.push(`/shows/${episode.show_id}/episodes/${episode.id}`)}
                >
                  Edit Episode
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
