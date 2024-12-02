import { MainLayout } from '@/components/layout/MainLayout'
import { GencastCollection } from '@/components/collections/GencastCollection'
import { ShowCollection } from '@/components/collections/ShowCollection'
import { CharacterCollection } from '@/components/collections/CharacterCollection'
import { TopicCollection } from '@/components/collections/TopicCollection'

export default function Home() {
  return (
    <MainLayout>
      <div className="w-full">
        <div className="space-y-24">
          {/* Gencasts Section */}
          <section>
            <GencastCollection />
          </section>

          {/* Shows Section */}
          <section>
            <ShowCollection />
          </section>

          {/* Characters Section */}
          <section>
            <CharacterCollection />
          </section>

          {/* Topics Section */}
          <section>
            <TopicCollection />
          </section>
        </div>
      </div>
    </MainLayout>
  )
}
