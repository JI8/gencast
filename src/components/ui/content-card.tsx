"use client"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreVertical, Plus } from "lucide-react"

interface ContentCardProps {
  className?: string
  children?: React.ReactNode
  isNew?: boolean
  onClick?: () => void
  newText?: string
}

export function ContentCard({
  className,
  children,
  isNew,
  onClick,
  newText = "Create new"
}: ContentCardProps) {
  if (isNew) {
    return (
      <Card 
        className={cn(
          "group relative flex flex-col h-full overflow-hidden cursor-pointer",
          "hover:bg-accent/50 transition-colors",
          className
        )}
        onClick={onClick}
      >
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <Plus className="w-8 h-8 mb-2 text-muted-foreground group-hover:text-foreground transition-colors" />
          <span className="text-sm text-center text-muted-foreground group-hover:text-foreground transition-colors">
            {newText}
          </span>
        </div>
      </Card>
    )
  }

  return (
    <Card 
      className={cn(
        "group relative flex flex-col h-full overflow-hidden cursor-pointer",
        "hover:bg-accent/50 transition-colors",
        className
      )}
      onClick={onClick}
    >
      <div className="flex-1 p-6">
        {children}
      </div>
    </Card>
  )
}
