export interface Character {
  id: string
  name: string
  description: string
  role: string
  background: string
  voiceId?: string
  isPreset?: boolean
}

export const presetCharacters: Character[] = [
  {
    id: "host-1",
    name: "Alex Thompson",
    description: "Charismatic and knowledgeable podcast host",
    role: "Host",
    background: "Experienced journalist with a warm, engaging personality",
    isPreset: true
  },
  {
    id: "expert-1",
    name: "Dr. Sarah Chen",
    description: "Tech industry expert and researcher",
    role: "Expert",
    background: "PhD in Computer Science, 15 years in Silicon Valley",
    isPreset: true
  },
  {
    id: "interviewer-1",
    name: "Mike Rodriguez",
    description: "Sharp and curious interviewer",
    role: "Interviewer",
    background: "Former radio host with a talent for asking insightful questions",
    isPreset: true
  },
  {
    id: "cohost-1",
    name: "Jordan Lee",
    description: "Witty and entertaining co-host",
    role: "Co-host",
    background: "Comedy writer and improv performer",
    isPreset: true
  }
]
