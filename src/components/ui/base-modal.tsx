"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { 
  Pencil, 
  Save, 
  X, 
  Trash2,
  AlertTriangle,
  Plus
} from "lucide-react"
import { cn } from "@/lib/utils"
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

type ModalMode = 'view' | 'edit' | 'create'

interface BaseModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  className?: string
  // Mode props
  mode?: ModalMode
  onEdit?: () => void
  onExitEdit?: () => void
  onSave?: () => Promise<void>
  onDelete?: () => Promise<void>
  // Optional props
  saveText?: string
  deleteText?: string
  createText?: string
  confirmDeleteText?: string
}

export function BaseModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  mode = 'view',
  onEdit,
  onExitEdit,
  onSave,
  onDelete,
  saveText = "Save changes",
  deleteText = "Delete",
  createText = "Create",
  confirmDeleteText = "Are you sure you want to delete this item? This action cannot be undone."
}: BaseModalProps) {
  const [isSaving, setIsSaving] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [showDeleteAlert, setShowDeleteAlert] = React.useState(false)

  // Reset states when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setIsSaving(false)
      setIsDeleting(false)
      setShowDeleteAlert(false)
    }
  }, [isOpen])

  const handleSave = async () => {
    if (onSave) {
      setIsSaving(true)
      try {
        await onSave()
        if (onExitEdit && mode === 'edit') {
          onExitEdit() // Only exit edit mode after successful save in edit mode
        }
      } catch (error) {
        console.error('Failed to save:', error)
      } finally {
        setIsSaving(false)
      }
    }
  }

  const handleCancel = () => {
    if (mode === 'create') {
      onClose() // Close modal in create mode
    } else if (onExitEdit) {
      onExitEdit() // Exit to view mode in edit mode
    }
  }

  const handleDelete = async () => {
    if (onDelete) {
      setIsDeleting(true)
      try {
        await onDelete()
        onClose()
      } catch (error) {
        console.error('Failed to delete:', error)
      } finally {
        setIsDeleting(false)
        setShowDeleteAlert(false)
      }
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent 
          className={cn(
            "max-w-[90vw] w-[1200px] h-[90vh] max-h-[900px] p-0 flex flex-col",
            className
          )}
        >
          {/* Header */}
          <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-semibold tracking-tight">
                {title}
              </DialogTitle>
              {description && (
                <DialogDescription>
                  {description}
                </DialogDescription>
              )}
            </div>
          </DialogHeader>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {children}
          </div>

          {/* Footer - Always at bottom */}
          <div className="px-6 py-4 border-t flex-shrink-0 bg-background">
            <div className="flex items-center justify-between w-full">
              {/* Left side - Delete button (only in view/edit mode) */}
              <div>
                {mode !== 'create' && onDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDeleteAlert(true)}
                    disabled={isDeleting}
                    className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                    {isDeleting ? 'Deleting...' : deleteText}
                  </Button>
                )}
              </div>

              {/* Right side - Action buttons */}
              <div className="flex items-center gap-2">
                {mode === 'view' && onEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onEdit}
                    className="gap-2"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                )}
                {(mode === 'edit' || mode === 'create') && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                      className="gap-2"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                    {onSave && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="gap-2"
                      >
                        {mode === 'create' ? (
                          <Plus className="h-4 w-4" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        {isSaving ? 'Saving...' : mode === 'create' ? createText : saveText}
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Confirm Delete
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDeleteText}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90 gap-2"
            >
              <Trash2 className="h-4 w-4" />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
