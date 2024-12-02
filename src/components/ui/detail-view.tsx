"use client"

import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface DetailTab {
  id: string
  label: string
  content: React.ReactNode
}

interface DetailViewProps {
  tabs: DetailTab[]
}

export function DetailView({ tabs }: DetailViewProps) {
  return (
    <Tabs defaultValue={tabs[0].id} className="w-full">
      <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}
