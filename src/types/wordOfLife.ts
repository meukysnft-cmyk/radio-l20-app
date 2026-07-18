export type InstagramMetrics = {
  likes: number
  comments: number
  shares: number
  saves: number
  views: number
  engagementRate: number
}

export type WordOfLifePost = {
  id: string
  url: string
  shortcode: string
  caption: string
  timestamp: string
  metrics: InstagramMetrics
  mediaType: 'image' | 'video' | 'carousel' | 'unknown'
  imageUrl: string
  analyzedAt: unknown
  analyzedBy: string
}

export type AnalysisStatus = 'idle' | 'loading' | 'success' | 'error'

export type AnalyzeState = {
  status: AnalysisStatus
  url: string
  post: WordOfLifePost | null
  error: string | null
}

export type BatchItemResult = {
  url: string
  post?: WordOfLifePost
  error?: string
}

export type BatchStatus = 'idle' | 'loading' | 'success' | 'partial' | 'error'

export type BatchAnalyzeState = {
  status: BatchStatus
  total: number
  completed: number
  currentUrl: string
  results: BatchItemResult[]
  error: string | null
}

export type RankedPost = WordOfLifePost & {
  rank: number
  score: number
}

export type PostsFilters = {
  limit: number
  orderBy: 'timestamp' | 'engagementRate' | 'likes' | 'comments'
  order: 'asc' | 'desc'
}

export type PostsState = {
  posts: WordOfLifePost[]
  loading: boolean
  error: string | null
}
