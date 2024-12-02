"use client"

import { useState, useEffect } from 'react'
import { PlayIcon, StopIcon, ReloadIcon } from '@radix-ui/react-icons'
import { usePodcastEpisode } from '@/hooks/usePodcastEpisode'

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
}

export function SettingsPanel({ episodeId }: Props) {
  const {
    episode,
    loading: episodeLoading,
    error: episodeError,
    updateContent
  } = usePodcastEpisode(episodeId)

  const [settings, setSettings] = useState<AudioSettings>({
    backgroundMusic: 'none',
    musicVolume: 50,
    soundEffects: true,
    effectsVolume: 70,
    masterVolume: 100,
    audioQuality: '256'
  })
  const [isPlaying, setIsPlaying] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (episode?.content) {
      const content = episode.content as { blocks: any[], audioSettings: AudioSettings }
      setSettings(content.audioSettings)
    }
  }, [episode])

  const updateSetting = <K extends keyof AudioSettings>(
    key: K,
    value: AudioSettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    if (episode?.content) {
      const content = episode.content as { blocks: any[], audioSettings: AudioSettings }
      updateContent(content.blocks, newSettings)
    }
  }

  const handlePreview = () => {
    setIsPlaying(!isPlaying)
    // TODO: Implement audio preview
  }

  const handleRegenerate = async () => {
    setIsProcessing(true)
    // TODO: Implement audio regeneration
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsProcessing(false)
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
        <h2 className="text-lg font-semibold">Audio Settings</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePreview}
            className="p-2 hover:bg-accent rounded-full"
          >
            {isPlaying ? (
              <StopIcon className="w-4 h-4" />
            ) : (
              <PlayIcon className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={handleRegenerate}
            disabled={isProcessing}
            className="p-2 hover:bg-accent rounded-full disabled:opacity-50"
          >
            <ReloadIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-4 space-y-6">
          {/* Background Music */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Background Music</h3>
            <div className="space-y-4">
              <select
                value={settings.backgroundMusic}
                onChange={(e) => updateSetting('backgroundMusic', e.target.value)}
                className="w-full p-2 bg-background border border-input rounded-md"
              >
                <option value="none">None</option>
                <option value="ambient">Ambient</option>
                <option value="upbeat">Upbeat</option>
                <option value="dramatic">Dramatic</option>
                <option value="custom">Custom Upload</option>
              </select>

              <div className="space-y-2">
                <label className="text-sm">Music Volume</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.musicVolume}
                    onChange={(e) =>
                      updateSetting('musicVolume', parseInt(e.target.value))
                    }
                    className="flex-1"
                  />
                  <span className="text-sm w-8">{settings.musicVolume}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sound Effects */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Sound Effects</h3>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.soundEffects}
                  onChange={(e) =>
                    updateSetting('soundEffects', e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            {settings.soundEffects && (
              <div className="space-y-2">
                <label className="text-sm">Effects Volume</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.effectsVolume}
                    onChange={(e) =>
                      updateSetting('effectsVolume', parseInt(e.target.value))
                    }
                    className="flex-1"
                  />
                  <span className="text-sm w-8">{settings.effectsVolume}%</span>
                </div>
              </div>
            )}
          </div>

          {/* Master Volume */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Master Volume</h3>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="0"
                max="100"
                value={settings.masterVolume}
                onChange={(e) =>
                  updateSetting('masterVolume', parseInt(e.target.value))
                }
                className="flex-1"
              />
              <span className="text-sm w-8">{settings.masterVolume}%</span>
            </div>
          </div>

          {/* Export Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Export Settings</h3>
            <select
              value={settings.audioQuality}
              onChange={(e) =>
                updateSetting(
                  'audioQuality',
                  e.target.value as AudioSettings['audioQuality']
                )
              }
              className="w-full p-2 bg-background border border-input rounded-md"
            >
              <option value="128">Standard Quality (128kbps)</option>
              <option value="256">High Quality (256kbps)</option>
              <option value="320">Premium Quality (320kbps)</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 space-x-2 flex justify-end">
            <button
              onClick={() => {/* TODO: Save settings */}}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
