"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { MagnifyingGlassIcon, ArrowUpIcon, ArrowDownIcon } from '@radix-ui/react-icons'
import { Skeleton } from '@/components/ui/skeleton'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { usePodcasts } from '@/hooks/usePodcasts'

type SortField = 'title' | 'updated_at' | 'episode_count'
type SortOrder = 'asc' | 'desc'

export function ShowsSection() {
  const router = useRouter()
  const { podcasts, loading } = usePodcasts()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState<SortField>('updated_at')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  const filteredShows = podcasts.filter(p => 
    !p.is_template && (
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
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
              placeholder="Search shows..."
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
              <DropdownMenuItem onClick={() => toggleSort('updated_at')}>
                Last Updated
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleSort('episode_count')}>
                Episodes
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button onClick={() => router.push('/shows/new')}>Create Show</Button>
      </div>

      {filteredShows.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No shows found</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredShows.map((show) => (
            <Card key={show.id}>
              <CardHeader>
                <CardTitle>{show.title}</CardTitle>
                <CardDescription>{show.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm">
                    Format: <span className="font-medium capitalize">{show.format}</span>
                  </div>
                  <div className="text-sm">
                    Episodes: <span className="font-medium">{show.episode_count}</span>
                  </div>
                  <div className="text-sm">
                    Last Updated: <span className="font-medium">{new Date(show.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => router.push(`/shows/${show.id}`)}
                >
                  View Show
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => router.push(`/shows/${show.id}/episodes/new`)}
                >
                  New Episode
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
