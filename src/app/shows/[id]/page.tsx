"use client"

import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getShow, getShows, updateShow, deleteShow, createShow } from '@/lib/api/shows'
import type { Show } from '@/lib/supabase'
import { ArrowLeft, ChevronDown, Save, Trash2, MoreVertical, Copy } from 'lucide-react'
import Link from 'next/link'
import { ShowInterface } from '@/components/shows/show-interface'
import { EpisodeGenerator } from '@/components/shows/episode-generator'
import { useUser } from '@/lib/hooks/use-user'
import { useToast } from '@/components/ui/use-toast'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { supabase } from '@/lib/supabase'

export default function ShowDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useUser()
  const { toast } = useToast()
  const [show, setShow] = useState<Show | null>(null)
  const [shows, setShows] = useState<Show[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showData, setShowData] = useState<Partial<Show>>({})
  const [hasChanges, setHasChanges] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return

      try {
        const [currentShow, allShows] = await Promise.all([
          getShow(params.id as string),
          getShows(user.id)
        ])
        setShow(currentShow)
        setShows(allShows)
        const initialData = {
          name: currentShow.name,
          description: currentShow.description,
          character_ids: currentShow.character_ids || [],
          topic_ids: currentShow.topic_ids || [],
          format: currentShow.format || 'Discussion',
          duration: currentShow.duration || '30',
          tone: currentShow.tone || 'Casual'
        }
        setShowData(initialData)
        setHasChanges(false)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id && user?.id) {
      fetchData()
    }
  }, [params.id, user?.id])

  const handleGenerateEpisode = async (title: string, description: string) => {
    // TODO: Implement episode generation
    console.log('Generating episode:', { title, description, show })
  }

  const handleShowSelect = (showId: string) => {
    router.push(`/shows/${showId}`)
  }

  const handleShowDataChange = (newData: Partial<Show>) => {
    setShowData(newData)
    // Compare with original show data to determine if there are changes
    const hasAnyChanges = Object.entries(newData).some(([key, value]) => {
      if (key === 'character_ids' || key === 'topic_ids') {
        const originalArray = show?.[key] || []
        const newArray = value || []
        return JSON.stringify(originalArray.sort()) !== JSON.stringify(newArray.sort())
      }
      return show?.[key] !== value
    })
    setHasChanges(hasAnyChanges)
  }

  const handleSaveChanges = async () => {
    if (!show || !user || !hasChanges) return
    setIsSaving(true)
    try {
      // Only send fields that have actually changed
      const changedFields = Object.entries(showData).reduce((acc, [key, value]) => {
        if (show[key] !== value) {
          acc[key] = value
        }
        return acc
      }, {} as Partial<Show>)

      await updateShow(show.id, changedFields)
      toast({
        title: "Success",
        description: "Show updated successfully"
      })
      // Update the local show state
      setShow({ ...show, ...changedFields })
      setHasChanges(false)
    } catch (error) {
      console.error('Error saving show:', error)
      toast({
        title: "Error",
        description: "Failed to save show changes",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveAsNew = async () => {
    if (!user?.id) return

    try {
      // Remove id and created_at to create a new record
      const newShow = {
        name: `${showData.name} (Copy)`,
        description: showData.description,
        character_ids: showData.character_ids || [],
        topic_ids: showData.topic_ids || [],
        format: showData.format || 'Discussion',
        duration: showData.duration || '30',
        tone: showData.tone || 'Casual',
        user_id: user.id
      }

      const show = await createShow(newShow)

      toast({
        title: "Success",
        description: "Show copied successfully",
      })
      router.push(`/shows/${show.id}`)
    } catch (error) {
      console.error('Error copying show:', error)
      toast({
        title: "Error",
        description: "Failed to copy show. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    try {
      await deleteShow(params.id as string)
      
      toast({
        title: "Success",
        description: "Show deleted successfully",
      })
      
      // Force a refresh of the data before redirecting
      router.refresh()
      router.push('/shows')
    } catch (error: any) {
      console.error('Error deleting show:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete show. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <div className="text-center text-muted-foreground">Please sign in to view shows</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="pl-6 pt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/shows">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>

          {!isLoading && show && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-2 text-base font-medium"
                >
                  {show.name}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[200px]">
                {shows
                  .filter(s => s.id !== show.id)
                  .map((s) => (
                    <DropdownMenuItem
                      key={s.id}
                      onClick={() => handleShowSelect(s.id)}
                    >
                      {s.name}
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="pr-6">
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={handleSaveAsNew}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Save as New Show
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Show
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              onClick={handleSaveChanges}
              disabled={isSaving || isLoading || !hasChanges}
              className="gap-2"
            >
              {isSaving ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container max-w-[1200px] pt-2">
        {isLoading ? (
          <div className="text-center text-muted-foreground py-6">Loading...</div>
        ) : show ? (
          <>
            <ShowInterface 
              show={show} 
              onChange={handleShowDataChange} 
              data={showData}
            />
            <EpisodeGenerator show={show} onGenerate={handleGenerateEpisode} />
          </>
        ) : (
          <div className="text-center text-muted-foreground py-6">Show not found</div>
        )}
      </main>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the show
              and all its associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
