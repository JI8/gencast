"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import { cn } from "@/lib/utils"

interface DetailModalProps {
  isOpen: boolean
  onClose: () => void
  onEdit?: () => void
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function DetailModal({
  isOpen,
  onClose,
  onEdit,
  title,
  description,
  children,
  className
}: DetailModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className={cn(
          "max-w-[90vw] w-[1200px] h-[90vh] max-h-[900px] p-0",
          className
        )}
        closeButton={true}
      >
        <div className="h-full flex flex-col">
          <DialogHeader className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
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
              {onEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onEdit}
                  className="h-8 w-8"
                >
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
              )}
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6">
            {children}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
