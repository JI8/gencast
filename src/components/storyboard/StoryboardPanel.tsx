"use client"

import { useState, useEffect } from 'react'
import { PlusIcon, Cross2Icon, DragHandleDots2Icon } from '@radix-ui/react-icons'
import { usePodcastEpisode } from '@/hooks/usePodcastEpisode'
import { getTempUserId } from '@/lib/temp-user'

interface ContentBlock {
  id: string
  type: 'intro' | 'segment' | 'discussion' | 'outro'
  content: string
  duration?: number
}

interface AudioSettings {
  backgroundMusic: string
  musicVolume: number
  soundEffects: boolean
  effectsVolume: number
  masterVolume: number
  audioQuality: '128' | '256' | '320'
}

interface Props {
  episodeId?: string
  podcastId?: string
}

export function StoryboardPanel({ episodeId, podcastId }: Props) {
  const {
    episode,
    loading: episodeLoading,
    error: episodeError,
    createEpisode,
    updateContent
  } = usePodcastEpisode(episodeId)

  const [blocks, setBlocks] = useState<ContentBlock[]>([])
  const [audioSettings, setAudioSettings] = useState<AudioSettings>({
    backgroundMusic: 'none',
    musicVolume: 50,
    soundEffects: true,
    effectsVolume: 70,
    masterVolume: 100,
    audioQuality: '256'
  })
  const [generatedContent, setGeneratedContent] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    if (episode?.content) {
      const content = episode.content as { blocks: ContentBlock[], audioSettings: AudioSettings }
      setBlocks(content.blocks || [])
      setAudioSettings(content.audioSettings)
    }
  }, [episode])

  const addBlock = (type: ContentBlock['type']) => {
    const newBlock: ContentBlock = {
      id: crypto.randomUUID(),
      type,
      content: '',
      duration: 0,
    }
    const newBlocks = [...blocks, newBlock]
    setBlocks(newBlocks)
    updateContent(newBlocks, audioSettings)
  }

  const removeBlock = (id: string) => {
    const newBlocks = blocks.filter(block => block.id !== id)
    setBlocks(newBlocks)
    updateContent(newBlocks, audioSettings)
  }

  const updateBlockContent = (id: string, content: string) => {
    const newBlocks = blocks.map(block => 
      block.id === id ? { ...block, content } : block
    )
    setBlocks(newBlocks)
    updateContent(newBlocks, audioSettings)
  }

  const generateContent = async () => {
    setIsGenerating(true)
    // TODO: Implement AI content generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    const newContent = "Sample generated content for the podcast..."
    setGeneratedContent(newContent)
    setIsGenerating(false)
  }

  if (episodeLoading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>
  }

  if (episodeError) {
    return <div className="flex items-center justify-center h-full text-destructive">Error: {episodeError}</div>
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Content & Storyboard</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => generateContent()}
            disabled={isGenerating}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            {isGenerating ? 'Generating...' : 'Generate Content'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-2 h-full divide-x divide-border">
          {/* Left side: Storyboard */}
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Episode Structure</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => addBlock('intro')}
                  className="p-2 hover:bg-accent rounded-md text-sm"
                >
                  Add Block
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {blocks.map((block, index) => (
                <div
                  key={block.id}
                  className="group relative flex items-start space-x-2 p-3 border border-border rounded-lg hover:border-primary/50"
                >
                  <div className="mt-1 cursor-move">
                    <DragHandleDots2Icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <select
                        className="text-sm bg-transparent border-none focus:ring-0"
                        value={block.type}
                        onChange={(e) => updateBlockContent(block.id, e.target.value)}
                      >
                        <option value="intro">Intro</option>
                        <option value="segment">Segment</option>
                        <option value="discussion">Discussion</option>
                        <option value="outro">Outro</option>
                      </select>
                      <button
                        onClick={() => removeBlock(block.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-accent rounded"
                      >
                        <Cross2Icon className="w-4 h-4" />
                      </button>
                    </div>
                    <textarea
                      value={block.content}
                      onChange={(e) => updateBlockContent(block.id, e.target.value)}
                      placeholder="Add content or talking points..."
                      className="w-full h-24 text-sm bg-background border border-input rounded-md p-2 resize-none"
                    />
                  </div>
                </div>
              ))}

              {blocks.length === 0 && (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  Click "Add Block" to start building your episode structure
                </div>
              )}
            </div>
          </div>

          {/* Right side: Generated Content */}
          <div className="p-4 space-y-4">
            <h3 className="text-sm font-medium">Generated Content</h3>
            {generatedContent ? (
              <div className="prose prose-sm max-w-none">
                <textarea
                  value={generatedContent}
                  onChange={(e) => setGeneratedContent(e.target.value)}
                  className="w-full h-[calc(100vh-12rem)] bg-background border border-input rounded-md p-4 resize-none"
                />
              </div>
            ) : (
              <div className="text-center py-8 text-sm text-muted-foreground">
                Generated content will appear here after you click "Generate Content"
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
