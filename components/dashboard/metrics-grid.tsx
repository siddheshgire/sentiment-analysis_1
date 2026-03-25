'use client'

import { Eye, ThumbsUp, MessageSquare, Clock, TrendingUp, Zap, Activity, BarChart3 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface MetricsGridProps {
  video: {
    viewCount: number
    likeCount: number
    commentCount: number
    duration: number
    durationFormatted: string
  }
  metrics: {
    engagementRate: number
    viewsPerMinute: number
    likeRatio: number
    commentRatio: number
    estimatedAvgWatchTimeFormatted: string
    totalWatchHours: number
    viewsPerDay: number
    viralityScore: number
  }
  sentiment: {
    total: number
    positivePercent: number
    avgConfidence: number
  }
}

function formatNumber(num: number): string {
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
  return num.toLocaleString()
}

const metrics_config = [
  {
    key: 'engagementRate',
    label: 'Engagement Rate',
    icon: Activity,
    format: (v: number) => `${v}%`,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    key: 'viewsPerMinute',
    label: 'Views / Minute',
    icon: Eye,
    format: (v: number) => formatNumber(v),
    color: 'text-chart-3',
    bgColor: 'bg-chart-3/10',
  },
  {
    key: 'likeRatio',
    label: 'Like Ratio',
    icon: ThumbsUp,
    format: (v: number) => `${v}%`,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    key: 'viewsPerDay',
    label: 'Views / Day',
    icon: TrendingUp,
    format: (v: number) => formatNumber(v),
    color: 'text-chart-4',
    bgColor: 'bg-chart-4/10',
  },
  {
    key: 'totalWatchHours',
    label: 'Total Watch Hours',
    icon: Clock,
    format: (v: number) => formatNumber(v),
    color: 'text-chart-3',
    bgColor: 'bg-chart-3/10',
  },
  {
    key: 'avgWatchTime',
    label: 'Avg Watch Time',
    icon: BarChart3,
    format: (_v: number, m: MetricsGridProps['metrics']) => m.estimatedAvgWatchTimeFormatted,
    color: 'text-chart-4',
    bgColor: 'bg-chart-4/10',
  },
  {
    key: 'commentsAnalyzed',
    label: 'Comments Analyzed',
    icon: MessageSquare,
    format: (_v: number, _m: MetricsGridProps['metrics'], s: MetricsGridProps['sentiment']) => formatNumber(s.total),
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    key: 'sentimentAccuracy',
    label: 'ML Confidence',
    icon: Zap,
    format: (_v: number, _m: MetricsGridProps['metrics'], s: MetricsGridProps['sentiment']) => `${s.avgConfidence}%`,
    color: 'text-chart-4',
    bgColor: 'bg-chart-4/10',
  },
]

export function MetricsGrid({ metrics, sentiment }: MetricsGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {metrics_config.map((m) => {
        const val = (metrics as Record<string, number>)[m.key] ?? 0
        const display = m.format(val, metrics, sentiment)

        return (
          <Card key={m.key} className="border-border bg-card hover:border-primary/20 transition-colors">
            <CardContent className="p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className={`flex items-center justify-center h-7 w-7 rounded-md ${m.bgColor}`}>
                  <m.icon className={`h-3.5 w-3.5 ${m.color}`} />
                </div>
                <span className="text-xs text-muted-foreground">{m.label}</span>
              </div>
              <p className="text-xl font-semibold text-foreground font-mono">{display}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
