/**
 * YouTube Data API v3 integration
 * Fetches video statistics, details, and comments
 */

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3'

export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/, // Just the video ID
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }

  return null
}

/**
 * Parse ISO 8601 duration to seconds
 */
export function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return 0
  const hours = parseInt(match[1] || '0')
  const minutes = parseInt(match[2] || '0')
  const seconds = parseInt(match[3] || '0')
  return hours * 3600 + minutes * 60 + seconds
}

/**
 * Format seconds to human-readable duration
 */
export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}h ${m}m ${s}s`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

export interface VideoDetails {
  id: string
  title: string
  description: string
  channelTitle: string
  channelId: string
  publishedAt: string
  thumbnails: {
    default: string
    medium: string
    high: string
    maxres?: string
  }
  duration: number
  durationFormatted: string
  viewCount: number
  likeCount: number
  commentCount: number
  tags: string[]
  categoryId: string
  defaultLanguage?: string
}

export interface CommentData {
  text: string
  authorName: string
  authorImage: string
  likeCount: number
  publishedAt: string
  replyCount: number
}

export async function fetchVideoDetails(videoId: string, apiKey: string): Promise<VideoDetails> {
  const url = `${YOUTUBE_API_BASE}/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${apiKey}`
  const res = await fetch(url)
  
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error?.message || 'Failed to fetch video details')
  }
  
  const data = await res.json()
  
  if (!data.items || data.items.length === 0) {
    throw new Error('Video not found')
  }
  
  const item = data.items[0]
  const snippet = item.snippet
  const stats = item.statistics
  const content = item.contentDetails
  const durationSeconds = parseDuration(content.duration)
  
  return {
    id: videoId,
    title: snippet.title,
    description: snippet.description || '',
    channelTitle: snippet.channelTitle,
    channelId: snippet.channelId,
    publishedAt: snippet.publishedAt,
    thumbnails: {
      default: snippet.thumbnails?.default?.url || '',
      medium: snippet.thumbnails?.medium?.url || '',
      high: snippet.thumbnails?.high?.url || '',
      maxres: snippet.thumbnails?.maxresdefault?.url || snippet.thumbnails?.high?.url || '',
    },
    duration: durationSeconds,
    durationFormatted: formatDuration(durationSeconds),
    viewCount: parseInt(stats.viewCount || '0'),
    likeCount: parseInt(stats.likeCount || '0'),
    commentCount: parseInt(stats.commentCount || '0'),
    tags: snippet.tags || [],
    categoryId: snippet.categoryId || '',
    defaultLanguage: snippet.defaultLanguage,
  }
}

export async function fetchComments(videoId: string, apiKey: string, maxComments: number = 200): Promise<CommentData[]> {
  const comments: CommentData[] = []
  let nextPageToken: string | undefined

  while (comments.length < maxComments) {
    const pageToken = nextPageToken ? `&pageToken=${nextPageToken}` : ''
    const maxResults = Math.min(100, maxComments - comments.length)
    const url = `${YOUTUBE_API_BASE}/commentThreads?part=snippet&videoId=${videoId}&maxResults=${maxResults}&order=relevance&textFormat=plainText&key=${apiKey}${pageToken}`
    
    const res = await fetch(url)
    
    if (!res.ok) {
      const error = await res.json()
      // Comments might be disabled
      if (error.error?.errors?.[0]?.reason === 'commentsDisabled') {
        return comments
      }
      throw new Error(error.error?.message || 'Failed to fetch comments')
    }
    
    const data = await res.json()
    
    if (!data.items || data.items.length === 0) break
    
    for (const item of data.items) {
      const topComment = item.snippet.topLevelComment.snippet
      comments.push({
        text: topComment.textDisplay || topComment.textOriginal || '',
        authorName: topComment.authorDisplayName || 'Unknown',
        authorImage: topComment.authorProfileImageUrl || '',
        likeCount: topComment.likeCount || 0,
        publishedAt: topComment.publishedAt,
        replyCount: item.snippet.totalReplyCount || 0,
      })
    }
    
    nextPageToken = data.nextPageToken
    if (!nextPageToken) break
  }
  
  return comments
}

/**
 * Calculate derived metrics from video data
 */
export function calculateMetrics(video: VideoDetails) {
  const viewCount = video.viewCount || 1
  const durationMinutes = Math.max(video.duration / 60, 1)
  
  // Engagement rate: (likes + comments) / views * 100
  const engagementRate = ((video.likeCount + video.commentCount) / viewCount) * 100
  
  // Average views per minute of content
  const viewsPerMinute = viewCount / durationMinutes
  
  // Like-to-view ratio
  const likeRatio = (video.likeCount / viewCount) * 100
  
  // Comment-to-view ratio
  const commentRatio = (video.commentCount / viewCount) * 100
  
  // Estimated average watch time (industry average ~50% of video length)
  const estimatedAvgWatchTime = video.duration * 0.5
  
  // Total estimated watch hours
  const totalWatchHours = (estimatedAvgWatchTime * viewCount) / 3600
  
  // Days since publish
  const daysSincePublish = Math.max(1, Math.floor(
    (Date.now() - new Date(video.publishedAt).getTime()) / (1000 * 60 * 60 * 24)
  ))
  
  // Views per day
  const viewsPerDay = viewCount / daysSincePublish
  
  // Virality score (0-100) based on views per day relative to age
  const viralityScore = Math.min(100, Math.round(
    (Math.log10(viewsPerDay + 1) / Math.log10(1000000)) * 100
  ))
  
  return {
    engagementRate: Math.round(engagementRate * 1000) / 1000,
    viewsPerMinute: Math.round(viewsPerMinute),
    likeRatio: Math.round(likeRatio * 1000) / 1000,
    commentRatio: Math.round(commentRatio * 10000) / 10000,
    estimatedAvgWatchTime,
    estimatedAvgWatchTimeFormatted: formatDuration(Math.round(estimatedAvgWatchTime)),
    totalWatchHours: Math.round(totalWatchHours),
    daysSincePublish,
    viewsPerDay: Math.round(viewsPerDay),
    viralityScore,
  }
}
