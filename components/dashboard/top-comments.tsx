'use client'

import { useState } from 'react'
import { ThumbsUp, ThumbsDown, Heart, User } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface CommentItem {
  text: string
  authorName: string
  likeCount: number
  publishedAt: string
  sentiment: { score: number; label: string; confidence: number }
}

interface TopCommentsProps {
  positive: CommentItem[]
  negative: CommentItem[]
  mostLiked: CommentItem[]
}

type TabKey = 'positive' | 'negative' | 'liked'

export function TopComments({ positive, negative, mostLiked }: TopCommentsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('positive')

  const tabs: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'positive', label: 'Top Positive', icon: ThumbsUp },
    { key: 'negative', label: 'Top Negative', icon: ThumbsDown },
    { key: 'liked', label: 'Most Liked', icon: Heart },
  ]

  const currentComments = activeTab === 'positive' ? positive : activeTab === 'negative' ? negative : mostLiked

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Comment Highlights
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Tab Bar */}
        <div className="flex items-center gap-1 rounded-lg bg-secondary p-1">
          {tabs.map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-md py-2 text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Comments List */}
        <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-1">
          {currentComments.length > 0 ? (
            currentComments.map((comment, i) => (
              <div
                key={i}
                className="flex flex-col gap-2 rounded-lg border border-border/50 bg-secondary/30 p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10">
                      <User className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-xs font-medium text-foreground truncate max-w-[140px]">
                      {comment.authorName}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {comment.likeCount > 0 && (
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{comment.likeCount}</span>
                      </div>
                    )}
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        comment.sentiment.label === 'positive'
                          ? 'bg-primary/10 text-primary'
                          : comment.sentiment.label === 'negative'
                            ? 'bg-destructive/10 text-destructive'
                            : 'bg-secondary text-muted-foreground'
                      }`}
                    >
                      {comment.sentiment.score > 0 ? '+' : ''}{comment.sentiment.score}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed line-clamp-3">
                  {comment.text}
                </p>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
              No comments in this category
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
