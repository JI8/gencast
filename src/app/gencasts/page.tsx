import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { GencastCollection } from '@/components/collections/GencastCollection'

export default function GemcastsPage() {
  return (
    <MainLayout>
      {/* Header */}
      <div className="border-b">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight">All Gencasts</h1>
              <p className="text-sm text-muted-foreground">Browse and manage your generated episodes</p>
            </div>
            <Button>Create New Gencast</Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {/* Filters */}
        <div className="flex gap-2 mb-8">
          <Button variant="outline" size="sm" className="rounded-full">
            All
          </Button>
          <Button variant="secondary" size="sm" className="rounded-full">
            Recent
          </Button>
          <Button variant="ghost" size="sm" className="rounded-full">
            Favorites
          </Button>
          <Button variant="ghost" size="sm" className="rounded-full">
            Archived
          </Button>
        </div>

        {/* Grid of Gencasts */}
        <div className="grid grid-cols-4 gap-6">
          <GencastCollection />
        </div>
      </div>
    </MainLayout>
  )
}
