'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface SentimentOverviewProps {
  sentiment: {
    total: number
    positive: number
    negative: number
    neutral: number
    positivePercent: number
    negativePercent: number
    neutralPercent: number
    overallScore: number
    overallLabel: string
    avgConfidence: number
  }
}

export function SentimentOverview({ sentiment }: SentimentOverviewProps) {
  const overallIcon = sentiment.overallLabel === 'positive'
    ? TrendingUp
    : sentiment.overallLabel === 'negative'
      ? TrendingDown
      : Minus

  const OverallIcon = overallIcon

  const scoreColor = sentiment.overallLabel === 'positive'
    ? 'text-primary'
    : sentiment.overallLabel === 'negative'
      ? 'text-destructive'
      : 'text-muted-foreground'

  const scorePercent = Math.round(((sentiment.overallScore + 1) / 2) * 100)

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Sentiment Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {/* Overall Score */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative flex items-center justify-center h-28 w-28">
            {/* Ring */}
            <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50" cy="50" r="42"
                fill="none"
                stroke="currentColor"
                className="text-secondary"
                strokeWidth="8"
              />
              <circle
                cx="50" cy="50" r="42"
                fill="none"
                stroke="currentColor"
                className={scoreColor}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${scorePercent * 2.64} ${264 - scorePercent * 2.64}`}
              />
            </svg>
            <div className="flex flex-col items-center">
              <OverallIcon className={`h-5 w-5 ${scoreColor}`} />
              <span className={`text-xl font-bold font-mono ${scoreColor}`}>
                {sentiment.overallScore > 0 ? '+' : ''}{sentiment.overallScore}
              </span>
            </div>
          </div>
          <span className="text-sm font-medium capitalize text-foreground">
            {sentiment.overallLabel} Sentiment
          </span>
        </div>

        {/* Breakdown */}
        <div className="flex flex-col gap-3">
          {/* Positive */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Positive</span>
              <span className="text-sm font-mono font-medium text-primary">
                {sentiment.positivePercent}%
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-1000"
                style={{ width: `${sentiment.positivePercent}%` }}
              />
            </div>
          </div>

          {/* Neutral */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Neutral</span>
              <span className="text-sm font-mono font-medium text-muted-foreground">
                {sentiment.neutralPercent}%
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full bg-muted-foreground/40 transition-all duration-1000"
                style={{ width: `${sentiment.neutralPercent}%` }}
              />
            </div>
          </div>

          {/* Negative */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Negative</span>
              <span className="text-sm font-mono font-medium text-destructive">
                {sentiment.negativePercent}%
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full bg-destructive transition-all duration-1000"
                style={{ width: `${sentiment.negativePercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center rounded-lg bg-primary/5 p-2">
            <span className="text-lg font-bold text-primary font-mono">{sentiment.positive}</span>
            <span className="text-xs text-muted-foreground">Positive</span>
          </div>
          <div className="flex flex-col items-center rounded-lg bg-muted p-2">
            <span className="text-lg font-bold text-muted-foreground font-mono">{sentiment.neutral}</span>
            <span className="text-xs text-muted-foreground">Neutral</span>
          </div>
          <div className="flex flex-col items-center rounded-lg bg-destructive/5 p-2">
            <span className="text-lg font-bold text-destructive font-mono">{sentiment.negative}</span>
            <span className="text-xs text-muted-foreground">Negative</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
