'use client'

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

interface SentimentChartProps {
  sentiment: {
    positive: number
    negative: number
    neutral: number
    positivePercent: number
    negativePercent: number
    neutralPercent: number
    keywords: Array<{ word: string; score: number; sentiment: number }>
  }
}

// Compute CSS color values at render time for Recharts
const POSITIVE_COLOR = '#22c55e'
const NEGATIVE_COLOR = '#ef4444'
const NEUTRAL_COLOR = '#6b7280'

export function SentimentChart({ sentiment }: SentimentChartProps) {
  const pieData = [
    { name: 'Positive', value: sentiment.positive, color: POSITIVE_COLOR },
    { name: 'Neutral', value: sentiment.neutral, color: NEUTRAL_COLOR },
    { name: 'Negative', value: sentiment.negative, color: NEGATIVE_COLOR },
  ]

  const topKeywords = sentiment.keywords.slice(0, 8).map(k => ({
    word: k.word,
    score: Math.round(k.score),
    fill: k.sentiment > 0 ? POSITIVE_COLOR : k.sentiment < 0 ? NEGATIVE_COLOR : NEUTRAL_COLOR,
  }))

  return (
    <Card className="border-border bg-card h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Sentiment Distribution & Top Keywords
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="flex flex-col items-center gap-4">
            <ChartContainer
              config={{
                positive: { label: 'Positive', color: POSITIVE_COLOR },
                neutral: { label: 'Neutral', color: NEUTRAL_COLOR },
                negative: { label: 'Negative', color: NEGATIVE_COLOR },
              }}
              className="h-[220px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="flex items-center gap-4">
              {pieData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-xs text-muted-foreground">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Keyword Bar Chart */}
          <div>
            {topKeywords.length > 0 ? (
              <ChartContainer
                config={{
                  score: { label: 'TF-IDF Score', color: POSITIVE_COLOR },
                }}
                className="h-[260px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topKeywords} layout="vertical" margin={{ left: 60, right: 10, top: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
                    <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis
                      dataKey="word"
                      type="category"
                      width={55}
                      tick={{ fill: '#9ca3af', fontSize: 11 }}
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
                    <Bar
                      dataKey="score"
                      radius={[0, 4, 4, 0]}
                      barSize={18}
                    >
                      {topKeywords.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} opacity={0.8} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="h-[260px] flex items-center justify-center text-sm text-muted-foreground">
                No keywords extracted
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
