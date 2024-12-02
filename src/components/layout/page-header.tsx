"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"

interface PageHeaderProps {
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between pb-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {action && (
        <Button onClick={action.onClick}>{action.label}</Button>
      )}
    </div>
  )
}
