'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer } from '@/components/ui/chart'

interface SentimentTimelineProps {
  timeline: Array<{
    date: string
    positive: number
    negative: number
    neutral: number
    total: number
    positivePercent: number
  }>
}

const POSITIVE_COLOR = '#22c55e'
const NEGATIVE_COLOR = '#ef4444'
const NEUTRAL_COLOR = '#6b7280'

export function SentimentTimeline({ timeline }: SentimentTimelineProps) {
  const data = timeline.map(t => ({
    ...t,
    date: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }))

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Sentiment Over Time
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            positive: { label: 'Positive', color: POSITIVE_COLOR },
            negative: { label: 'Negative', color: NEGATIVE_COLOR },
            neutral: { label: 'Neutral', color: NEUTRAL_COLOR },
          }}
          className="h-[280px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="positiveGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={POSITIVE_COLOR} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={POSITIVE_COLOR} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="negativeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={NEGATIVE_COLOR} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={NEGATIVE_COLOR} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="neutralGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={NEUTRAL_COLOR} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={NEUTRAL_COLOR} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis
                dataKey="date"
                tick={{ fill: '#6b7280', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#6b7280', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: '#1a1b23',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#e5e7eb',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="positive"
                stroke={POSITIVE_COLOR}
                fill="url(#positiveGrad)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="neutral"
                stroke={NEUTRAL_COLOR}
                fill="url(#neutralGrad)"
                strokeWidth={1.5}
              />
              <Area
                type="monotone"
                dataKey="negative"
                stroke={NEGATIVE_COLOR}
                fill="url(#negativeGrad)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="flex items-center justify-center gap-6 mt-3">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: POSITIVE_COLOR }} />
            <span className="text-xs text-muted-foreground">Positive</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: NEUTRAL_COLOR }} />
            <span className="text-xs text-muted-foreground">Neutral</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: NEGATIVE_COLOR }} />
            <span className="text-xs text-muted-foreground">Negative</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
