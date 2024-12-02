"use client"

import * as React from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, Save } from "lucide-react"
import { cn } from "@/lib/utils"

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  onSave?: () => void
  title: string
  children: React.ReactNode
  className?: string
  isDirty?: boolean
}

export function EditModal({
  isOpen,
  onClose,
  onSave,
  title,
  children,
  className,
  isDirty = true // Default to true to make save button clickable
}: EditModalProps) {
  const [isSaving, setIsSaving] = React.useState(false)

  const handleSave = async () => {
    if (onSave) {
      setIsSaving(true)
      try {
        await onSave()
      } catch (error) {
        console.error('Failed to save:', error)
      } finally {
        setIsSaving(false)
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={cn(
        "max-w-[90vw] w-[1200px] h-[90vh] max-h-[900px] p-0",
        className
      )}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
            <div className="flex items-center gap-2">
              {onSave && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            {children}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
