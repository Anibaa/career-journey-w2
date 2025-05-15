export interface Media {
  type: "image" | "video"
  url: string
  thumbnail?: string
  caption: string
}

export interface DateEvent {
  id: string
  date: string
  title: string
  description: string
  achievements: string[]
  media: Media
  links?: Array<{
    title: string
    url: string
  }>
  tags?: string[]
}

export interface CareerEntry {
  id: number
  title: string
  company: string
  location: string
  period: string
  startDate: string
  endDate: string
  color: string
  description: string
  missions: string[]
  skills: string[]
  image: string
  icon: string
  detailedEvents: DateEvent[]
  collaborators?: Array<{
    name: string
    role: string
    avatar?: string
  }>
  keyMetrics?: Array<{
    label: string
    value: string
    icon?: string
  }>
}

export interface CareerData {
  jobs: CareerEvent[]
  education: CareerEvent[]
  projects: CareerEvent[]
  milestones: CareerEvent[]
}

export interface CareerEvent {
  id: string
  title: string
  organization: string
  date: string
  endDate?: string | null
  type: string
  description: string
  skills: Skill[]
  achievements: string[]
}

export interface Skill {
  name: string
}

export interface CareerSkill {
  id: string
  name: string
  level: number
}

export interface Career {
  id: string
  title: string
  description: string
  nodes: CareerNode[]
}

export interface CareerNode {
  id: string
  title: string
  date: string
  type: string
  description: string
  skills: string[]
}
