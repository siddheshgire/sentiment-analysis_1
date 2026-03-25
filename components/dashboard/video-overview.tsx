'use client'

import { Calendar, Clock, Eye, ThumbsUp, MessageSquare, ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface VideoOverviewProps {
  video: {
    id: string
    title: string
    channelTitle: string
    publishedAt: string
    thumbnails: { high: string; maxres?: string }
    durationFormatted: string
    viewCount: number
    likeCount: number
    commentCount: number
  }
  metrics: {
    daysSincePublish: number
    viralityScore: number
  }
}

function formatNumber(num: number): string {
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
  return num.toLocaleString()
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function VideoOverview({ video, metrics }: VideoOverviewProps) {
  return (
    <Card className="overflow-hidden border-border bg-card">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row gap-0">
          {/* Thumbnail */}
          <div className="relative md:w-80 lg:w-96 shrink-0">
            <img
              src={video.thumbnails.maxres || video.thumbnails.high}
              alt={video.title}
              className="h-full w-full object-cover aspect-video md:aspect-auto"
              crossOrigin="anonymous"
            />
            <div className="absolute bottom-2 right-2 rounded-md bg-background/90 px-2 py-0.5 text-xs font-mono font-medium text-foreground backdrop-blur-sm">
              {video.durationFormatted}
            </div>
            {/* Virality Badge */}
            <div className="absolute top-2 left-2 rounded-md bg-primary/90 px-2 py-0.5 text-xs font-medium text-primary-foreground backdrop-blur-sm">
              Virality: {metrics.viralityScore}/100
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col justify-between p-5 gap-4 flex-1">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-foreground leading-snug text-balance line-clamp-2">
                {video.title}
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-primary font-medium">{video.channelTitle}</span>
                <a
                  href={`https://www.youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Watch on YouTube"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatDate(video.publishedAt)}</span>
                <span className="mx-1">-</span>
                <span>{metrics.daysSincePublish} days ago</span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-base font-semibold text-foreground">{formatNumber(video.viewCount)}</p>
                  <p className="text-xs text-muted-foreground">Views</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-base font-semibold text-foreground">{formatNumber(video.likeCount)}</p>
                  <p className="text-xs text-muted-foreground">Likes</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-base font-semibold text-foreground">{formatNumber(video.commentCount)}</p>
                  <p className="text-xs text-muted-foreground">Comments</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-base font-semibold text-foreground">{video.durationFormatted}</p>
                  <p className="text-xs text-muted-foreground">Duration</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
