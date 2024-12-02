import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Show, Character, Topic } from '@/lib/supabase'
import { Plus, Wand2, MoreHorizontal, Edit, X, Search, Check, Hash, Pencil } from 'lucide-react'
import { getCharacters } from '@/lib/api/characters'
import { getTopics } from '@/lib/api/topics'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { CharacterDetail } from '@/components/modals/character-detail'
import { TopicDetail } from '@/components/modals/topic-detail'
import { Image, ImageIcon, Upload, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'

interface ShowInterfaceProps {
  show: Show
  onChange?: (data: Partial<Show>) => void
  data?: Partial<Show>
}

export function ShowInterface({ show, onChange, data }: ShowInterfaceProps) {
  const { toast } = useToast()
  const { user } = useAuth()
  const router = useRouter()
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>(data?.character_ids || show.character_ids || [])
  const [selectedTopics, setSelectedTopics] = useState<string[]>(data?.topic_ids || show.topic_ids || [])
  const [characters, setCharacters] = useState<Character[]>([])
  const [topics, setTopics] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCharacterCreateOpen, setIsCharacterCreateOpen] = useState(false)
  const [isCharacterDetailOpen, setIsCharacterDetailOpen] = useState(false)
  const [isCharacterEditOpen, setIsCharacterEditOpen] = useState(false)
  const [isTopicCreateOpen, setIsTopicCreateOpen] = useState(false)
  const [isTopicDetailOpen, setIsTopicDetailOpen] = useState(false)
  const [isTopicEditOpen, setIsTopicEditOpen] = useState(false)
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null)
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null)
  const [showName, setShowName] = useState(data?.name || show.name)
  const [showDescription, setShowDescription] = useState(data?.description || show.description || '')
  const [format, setFormat] = useState(data?.format || show.format || 'Discussion')
  const [duration, setDuration] = useState(data?.duration || show.duration || '30')
  const [tone, setTone] = useState(data?.tone || show.tone || 'Casual')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isCharacterSelectOpen, setIsCharacterSelectOpen] = useState(false)
  const [isTopicSelectOpen, setIsTopicSelectOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (onChange) {
      onChange({
        name: showName,
        description: showDescription,
        character_ids: selectedCharacters,
        topic_ids: selectedTopics,
        format,
        duration,
        tone
      })
    }
  }, [showName, showDescription, selectedCharacters, selectedTopics, format, duration, tone])

  const fetchData = async () => {
    if (!user) return
    
    try {
      const [charactersData, topicsData] = await Promise.all([
        getCharacters(user.id),
        getTopics(user.id)
      ])
      setCharacters(charactersData)
      setTopics(topicsData)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast({
        title: "Error",
        description: "Failed to load characters and topics",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchTopics = async () => {
    if (!user) return
    try {
      const topicsData = await getTopics(user.id)
      setTopics(topicsData || [])
    } catch (error) {
      console.error('Error fetching topics:', error)
      toast({
        title: 'Error loading topics',
        description: 'Please try again later',
        variant: 'destructive',
      })
    }
  }

  useEffect(() => {
    if (user) {
      fetchData()
      fetchTopics()
    }
  }, [user])

  const handleGenerateEpisode = async () => {
    if (selectedCharacters.length === 0) {
      toast({
        title: "No Characters Selected",
        description: "Please select at least one character for your episode",
        variant: "destructive"
      })
      return
    }

    if (selectedTopics.length === 0) {
      toast({
        title: "No Topics Selected",
        description: "Please select at least one topic for your episode",
        variant: "destructive"
      })
      return
    }

    if (!showName.trim()) {
      toast({
        title: "Missing Title",
        description: "Please enter a title for your episode",
        variant: "destructive"
      })
      return
    }

    // TODO: Implement generation logic
    console.log('Generating episode...')
  }

  const handleCreateCharacter = () => {
    setIsCharacterCreateOpen(true)
  }

  const handleCharacterClick = (characterId: string) => {
    setSelectedCharacters(prev => {
      if (prev.includes(characterId)) {
        return prev.filter(id => id !== characterId)
      } else {
        return [...prev, characterId]
      }
    })
  }

  const handleCharacterView = (e: React.MouseEvent, characterId: string) => {
    e.stopPropagation()
    const character = characters.find(c => c.id === characterId)
    if (!character) return
    
    setSelectedCharacterId(characterId)
    setIsCharacterDetailOpen(true)
  }

  const handleCharacterEdit = (e: React.MouseEvent, characterId: string) => {
    e.stopPropagation()
    const character = characters.find(c => c.id === characterId)
    if (!character) return

    setSelectedCharacterId(characterId)
    setIsCharacterEditOpen(true)
  }

  const handleCreateTopic = () => {
    setIsTopicCreateOpen(true)
  }

  const handleTopicSave = async () => {
    setIsTopicCreateOpen(false)
    await fetchTopics()
  }

  const handleTopicClick = (topicId: string) => {
    setSelectedTopics(prev => {
      if (prev.includes(topicId)) {
        return prev.filter(id => id !== topicId)
      } else {
        return [...prev, topicId]
      }
    })
  }

  const handleTopicView = (e: React.MouseEvent, topicId: string) => {
    e.stopPropagation()
    const topic = topics.find(t => t.id === topicId)
    if (!topic) return
    
    setSelectedTopicId(topicId)
    setIsTopicDetailOpen(true)
  }

  const handleTopicEdit = (e: React.MouseEvent, topicId: string) => {
    e.stopPropagation()
    const topic = topics.find(t => t.id === topicId)
    if (!topic) return

    setSelectedTopicId(topicId)
    setIsTopicEditOpen(true)
  }

  const handleSaveAsNew = async () => {
    if (!user) return
    try {
      const newShow = await createShow({
        name: `${showName} (Copy)`,
        description: showDescription,
        character_ids: selectedCharacters,
        topic_ids: selectedTopics,
        format,
        duration,
        tone,
        user_id: user.id
      })
      toast({
        title: "Success",
        description: "New show created successfully"
      })
      router.push(`/shows/${newShow.id}`)
    } catch (error) {
      console.error('Error creating show:', error)
      toast({
        title: "Error",
        description: "Failed to create new show",
        variant: "destructive"
      })
    }
  }

  const handleCharacterDelete = async () => {
    setIsCharacterDetailOpen(false)
    setIsCharacterEditOpen(false)
    setSelectedCharacterId(null)
    await fetchData() // Refresh characters
  }

  const handleTopicDelete = async () => {
    setIsTopicDetailOpen(false)
    setIsTopicEditOpen(false)
    setSelectedTopicId(null)
    await fetchTopics() // Refresh topics
  }

  // Get the character and topic objects for the selected IDs
  const selectedCharacterObjects = characters.filter(char => selectedCharacters.includes(char.id))
  const selectedTopicObjects = topics.filter(topic => selectedTopics.includes(topic.id))

  return (
    <div className="space-y-6 py-6">
      {/* Show Panel */}
      <div className="bg-muted rounded-lg p-6">
        <div className="flex gap-6">
          <div 
            className="relative group w-32 h-32 rounded-lg overflow-hidden cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-full h-full bg-muted-foreground/10 flex items-center justify-center text-muted-foreground">
              <ImageIcon className="w-8 h-8" />
            </div>
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              disabled={true}
            />
          </div>

          <div className="flex-1 min-w-0">
            <Input
              value={showName}
              onChange={(e) => setShowName(e.target.value)}
              className="text-xl font-semibold h-auto px-0 border-0 focus-visible:ring-0 bg-transparent"
              placeholder="Show title"
            />
            <Textarea
              value={showDescription}
              onChange={(e) => setShowDescription(e.target.value)}
              placeholder="Add a description..."
              className="resize-none border-0 focus-visible:ring-0 bg-transparent mt-2"
            />
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Characters Section */}
        <Card className="flex flex-col overflow-hidden">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Characters</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedCharacters.length} selected
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCreateCharacter}
              >
                <Pencil className="h-4 w-4 mr-2" />
                New Character
              </Button>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto p-4">
            <div className="grid grid-cols-1 gap-2">
              {selectedCharacterObjects.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-muted-foreground mb-4">No characters added</div>
                  <Button 
                    variant="outline"
                    onClick={() => setIsCharacterSelectOpen(true)}
                    className="mx-auto"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add from Library
                  </Button>
                </div>
              ) : (
                <>
                  {selectedCharacterObjects.map((character) => (
                    <div
                      key={character.id}
                      className="relative flex items-center gap-3 p-3 border rounded-lg bg-card"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={character.avatar_url} />
                        <AvatarFallback>
                          {character.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{character.name}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {character.role || 'No role set'}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-background"
                            onClick={(e) => handleCharacterView(e, character.id)}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => handleCharacterClick(character.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        {character.traits && character.traits.length > 0 && (
                          <div className="flex gap-1">
                            {character.traits.slice(0, 2).map((trait, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {trait}
                              </Badge>
                            ))}
                            {character.traits.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{character.traits.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full mt-4"
                    onClick={() => setIsCharacterSelectOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add from Library
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>

        {/* Topics Section */}
        <Card className="flex flex-col overflow-hidden">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Topics</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedTopics.length} selected
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCreateTopic}
              >
                <Pencil className="h-4 w-4 mr-2" />
                New Topic
              </Button>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto p-4">
            <div className="grid grid-cols-1 gap-2">
              {selectedTopicObjects.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-muted-foreground mb-4">No topics added</div>
                  <Button 
                    variant="outline"
                    onClick={() => setIsTopicSelectOpen(true)}
                    className="mx-auto"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add from Library
                  </Button>
                </div>
              ) : (
                <>
                  {selectedTopicObjects.map((topic) => (
                    <div
                      key={topic.id}
                      className="relative flex items-center gap-3 p-3 border rounded-lg bg-card"
                    >
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary">
                        <Hash className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{topic.name}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {topic.description || 'No description'}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-background"
                            onClick={(e) => handleTopicView(e, topic.id)}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => handleTopicClick(topic.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        {topic.tags && topic.tags.length > 0 && (
                          <div className="flex gap-1">
                            {topic.tags.slice(0, 2).map((tag, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {topic.tags.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{topic.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full mt-4"
                    onClick={() => setIsTopicSelectOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add from Library
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>

        {/* Generation Settings Section */}
        <Card className="flex flex-col overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">Generation</h3>
          </div>
          
          <div className="flex-1 overflow-auto p-4">
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Sound and music</label>
                <Button variant="outline" size="sm" className="w-full justify-between">
                  <span>Configure audio settings</span>
                  <Edit className="h-4 w-4" />
                </Button>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Gencast Formats</label>
                <Button variant="outline" size="sm" className="w-full justify-between">
                  <span>Select format</span>
                  <Edit className="h-4 w-4" />
                </Button>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Settings</label>
                <Button variant="outline" size="sm" className="w-full justify-between">
                  <span>Configure settings</span>
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Character Modals */}
      <CharacterDetail
        isOpen={isCharacterCreateOpen}
        onClose={() => setIsCharacterCreateOpen(false)}
        mode="create"
        userId={user?.id || ''}
        onSave={() => {
          setIsCharacterCreateOpen(false)
          fetchData()
        }}
        onDelete={handleCharacterDelete}
      />

      <CharacterDetail
        isOpen={isCharacterDetailOpen}
        onClose={() => {
          setIsCharacterDetailOpen(false)
          setSelectedCharacterId(null)
        }}
        mode="view"
        character={selectedCharacterId ? characters.find(c => c.id === selectedCharacterId) : undefined}
        userId={user?.id || ''}
        onDelete={handleCharacterDelete}
      />

      <CharacterDetail
        isOpen={isCharacterEditOpen}
        onClose={() => {
          setIsCharacterEditOpen(false)
          setSelectedCharacterId(null)
        }}
        mode="edit"
        character={selectedCharacterId ? characters.find(c => c.id === selectedCharacterId) : undefined}
        userId={user?.id || ''}
        onSave={() => {
          setIsCharacterEditOpen(false)
          setSelectedCharacterId(null)
          fetchData()
        }}
        onDelete={handleCharacterDelete}
      />

      {/* Topic Modals */}
      <TopicDetail
        isOpen={isTopicCreateOpen}
        onClose={() => setIsTopicCreateOpen(false)}
        mode="create"
        userId={user?.id || ''}
        onSave={handleTopicSave}
        onDelete={handleTopicDelete}
      />

      <TopicDetail
        isOpen={isTopicDetailOpen}
        onClose={() => {
          setIsTopicDetailOpen(false)
          setSelectedTopicId(null)
        }}
        mode="view"
        topic={selectedTopicId ? topics.find(t => t.id === selectedTopicId) : undefined}
        userId={user?.id || ''}
        onDelete={handleTopicDelete}
      />

      <TopicDetail
        isOpen={isTopicEditOpen}
        onClose={() => {
          setIsTopicEditOpen(false)
          setSelectedTopicId(null)
        }}
        mode="edit"
        topic={selectedTopicId ? topics.find(t => t.id === selectedTopicId) : undefined}
        userId={user?.id || ''}
        onSave={() => {
          setIsTopicEditOpen(false)
          setSelectedTopicId(null)
          fetchTopics()
        }}
        onDelete={handleTopicDelete}
      />

      {/* Character Selection Modal */}
      <Dialog open={isCharacterSelectOpen} onOpenChange={setIsCharacterSelectOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Characters</DialogTitle>
            <DialogDescription>
              Select characters to add to your show
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center gap-2 mb-4">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search characters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
            </div>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {characters
                .filter(c => 
                  c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (c.role && c.role.toLowerCase().includes(searchQuery.toLowerCase()))
                )
                .map((character) => {
                  const isSelected = selectedCharacters.includes(character.id);
                  return (
                    <div
                      key={character.id}
                      className={`flex items-center gap-3 p-3 border rounded-lg hover:bg-accent/50 cursor-pointer transition-all ${
                        isSelected ? 'bg-accent border-primary shadow-sm ring-1 ring-primary' : ''
                      }`}
                      onClick={() => handleCharacterClick(character.id)}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={character.avatar_url} />
                        <AvatarFallback>
                          {character.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{character.name}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {character.role || 'No role set'}
                        </div>
                      </div>
                      {isSelected ? (
                        <Check className="h-4 w-4 text-primary" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCharacterSelectOpen(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Topic Selection Modal */}
      <Dialog open={isTopicSelectOpen} onOpenChange={setIsTopicSelectOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Topics</DialogTitle>
            <DialogDescription>
              Select topics to add to your show
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center gap-2 mb-4">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
            </div>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {topics
                .filter(t => 
                  t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()))
                )
                .map((topic) => {
                  const isSelected = selectedTopics.includes(topic.id);
                  return (
                    <div
                      key={topic.id}
                      className={`flex items-center gap-3 p-3 border rounded-lg hover:bg-accent/50 cursor-pointer transition-all ${
                        isSelected ? 'bg-accent border-primary shadow-sm ring-1 ring-primary' : ''
                      }`}
                      onClick={() => handleTopicClick(topic.id)}
                    >
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary">
                        <Hash className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{topic.name}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {topic.description || 'No description'}
                        </div>
                      </div>
                      {isSelected ? (
                        <Check className="h-4 w-4 text-primary" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTopicSelectOpen(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
