export const firestoreCollections = [
  'news',
  'championships',
  'teams',
  'agenda',
  'programs',
  'videos',
  'sponsors',
  'horoscopePredictions',
  'wordOfLife',
  'jobs',
  'links',
  'player',
  'theme',
  'settings',
  'communityUsers',
  'sportsContent',
  'notificationTokens',
  'notifications',
  'userProfiles',
  'liveStreams',
  'chatMessages',
  'chatBlockedUsers',
] as const

export type FirestoreCollectionName = (typeof firestoreCollections)[number]

export type ContentStatus = 'draft' | 'published' | 'archived'

export type FirestoreMeta = {
  id?: string
  createdAt?: unknown
  updatedAt?: unknown
}

export type NewsDocument = FirestoreMeta & {
  title: string
  excerpt: string
  category: string
  author: string
  content: string
  imageUrl: string
  programSlug?: string
  status: ContentStatus
  featured: boolean
}

export type ChampionshipDocument = FirestoreMeta & {
  name: string
  category: string
  description: string
  year?: string
  status: ContentStatus | string
}

export type TeamDocument = FirestoreMeta & {
  name: string
  city: string
  category: string
  logoUrl: string
  alt: string
  championshipId?: string
  color?: string
}

export type AgendaDocument = FirestoreMeta & {
  title: string
  date: string
  time: string
  type: string
  description: string
  status: ContentStatus
}

export type ProgramLiveStatus = 'none' | 'scheduled' | 'live' | 'ended'

export type ProgramDocument = FirestoreMeta & {
  slug: string
  name: string
  time: string
  days: string
  category: string
  description: string
  isOnAir: boolean
  coverImageUrl: string
  youtubeUrl: string
  liveDate: string
  liveNote: string
  liveStatus: ProgramLiveStatus
  livePlatform: 'youtube' | 'instagram'
  liveStartedAt?: unknown
  liveEndedAt?: unknown
}

export type VideoPlatform = 'youtube' | 'instagram' | 'tiktok' | 'facebook'

export type VideoDocument = FirestoreMeta & {
  title: string
  category: string
  platform: VideoPlatform
  videoUrl: string
  description: string
  status: ContentStatus
}

export type SponsorDocument = FirestoreMeta & {
  name: string
  category: string
  logoFile: string
  bannerFile?: string
  bannerSize?: 'small' | 'medium' | 'large'
  bannerPosition?: 'left' | 'center' | 'right'
  linkLabel?: string
  linkUrl?: string
  info?: string
  note?: string
  displayOrder?: number
  active?: boolean
  status: ContentStatus
}

export type HoroscopePredictionDocument = FirestoreMeta & {
  date: string
  sign: string
  message: string
  love: string
  work: string
  health: string
  money: string
  advice: string
  luckyNumber: string
  color: string
  compatibility: string
  emoji: string
  imageUrl?: string
  status: 'draft' | 'published'
}

export type WordOfLifeDocument = FirestoreMeta & {
  title: string
  message: string
  reference: string
  status: ContentStatus
}

export type JobDocument = FirestoreMeta & {
  title: string
  company: string
  city: string
  type: string
  description: string
  contact: string
  salary?: string
  requirements?: string
  imageUrl?: string
  urgent?: boolean
  published: boolean
}

export type LinksDocument = FirestoreMeta & {
  instagram: string
  youtube: string
  whatsapp: string
  streamUrl: string
}

export type PlayerDocument = FirestoreMeta & {
  streamUrl: string
  statusMessage: string
  isLive: boolean
  youtubeLiveUrl: string
  youtubeIsLive: boolean
  instagramLiveUrl: string
  instagramIsLive: boolean
}

export type ThemeDocument = FirestoreMeta & {
  primaryColor: string
  accentColor: string
  backgroundColor: string
}

export type SettingsDocument = FirestoreMeta & {
  siteName: string
  description: string
  maintenanceMode: boolean
}

export type CommunityUserDocument = FirestoreMeta & {
  name: string
  nickname: string
  age: string
  whatsapp: string
  city: string
  interest: string
  origin: string
}

export type SportsCardData = {
  category: string
  title: string
  description: string
  meta: string
}

export type SportsContentDocument = FirestoreMeta & {
  featured: SportsCardData
  amateurCards: SportsCardData[]
  callout: {
    title: string
    description: string
    actionLabel: string
  }
  status: ContentStatus
}

export type NotificationTokenDocument = FirestoreMeta & {
  token: string
  uid: string
  active: boolean
}

export type NotificationDocument = FirestoreMeta & {
  title: string
  body: string
  url: string
  imageUrl?: string
  sentAt: unknown
  sentBy: string
}

export type UserProfileDocument = FirestoreMeta & {
  uid: string
  displayName: string
  bio: string
  city: string
  avatarUrl: string
  interests: string[]
  accentColor: string
  birthday?: string
  zodiacSign?: string
  horoscopeNotification?: boolean
  horoscopeNotificationTime?: string
}

export type TeamRow = {
  pos: number
  name: string
  pts: number
  pj: number
  v: number
  e: number
  d: number
  gp: number
  gc: number
  sg: number
  ultimos: string[]
}

export type MatchChave = {
  home: string
  homeLogo: string
  homeScore?: number
  away: string
  awayLogo: string
  awayScore?: number
  date: string
  time: string
  played: boolean
}

export type Scorer = {
  pos: number
  name: string
  position: string
  team: string
  teamLogo: string
  photo: string
  goals: number
}

export type GroupStanding = {
  pos: number
  name: string
  code: string
  logo?: string
  pts: number
  pj: number
  v: number
  e: number
  d: number
  gp: number
  gc: number
  sg: string
  ultimos: string[]
}

export type GroupData = {
  name: string
  teams: GroupStanding[]
}

export type MatchData = {
  phase: string
  chaves: MatchChave[]
  scorers?: Scorer[]
  groups?: GroupData[]
}

export type LeagueTable = {
  league: string
  slug: string
  updatedAt: string
  teams: TeamRow[]
  matches?: MatchData
}

export type LiveStreamStatus = 'scheduled' | 'live' | 'ended' | 'archived'

export type LiveStreamDocument = FirestoreMeta & {
  programSlug: string
  programName: string
  platform: 'youtube' | 'instagram'
  url: string
  title: string
  scheduledDate: string
  scheduledTime: string
  status: LiveStreamStatus
  startedAt?: unknown
  endedAt?: unknown
  coverImageUrl: string
  thumbnailUrl: string
}
