'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Hash } from 'lucide-react'

interface KeywordsSectionProps {
  keywords: Array<{
    word: string
    score: number
    sentiment: number
  }>
}

export function KeywordsSection({ keywords }: KeywordsSectionProps) {
  const maxScore = Math.max(...keywords.map(k => k.score), 1)

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Keyword Analysis (TF-IDF)
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Word Cloud Style */}
        <div className="flex flex-wrap gap-2">
          {keywords.map((kw) => {
            const sizeScale = Math.max(0.7, (kw.score / maxScore) * 1.3 + 0.5)
            const sentColor = kw.sentiment > 0
              ? 'border-primary/30 bg-primary/5 text-primary'
              : kw.sentiment < 0
                ? 'border-destructive/30 bg-destructive/5 text-destructive'
                : 'border-border bg-secondary/50 text-muted-foreground'

            return (
              <div
                key={kw.word}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 transition-colors hover:opacity-80 ${sentColor}`}
                style={{ fontSize: `${Math.round(sizeScale * 12)}px` }}
              >
                <Hash className="h-3 w-3 opacity-60" />
                <span className="font-medium">{kw.word}</span>
                <span className="text-[10px] opacity-60 font-mono">{Math.round(kw.score)}</span>
              </div>
            )
          })}
        </div>

        {/* Keyword Table */}
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="grid grid-cols-[1fr_80px_80px] bg-secondary/50 px-3 py-2 text-xs font-medium text-muted-foreground">
            <span>Keyword</span>
            <span className="text-right">TF-IDF</span>
            <span className="text-right">Sentiment</span>
          </div>
          <div className="max-h-[280px] overflow-y-auto">
            {keywords.map((kw, i) => (
              <div
                key={kw.word}
                className={`grid grid-cols-[1fr_80px_80px] px-3 py-2 text-sm ${
                  i % 2 === 0 ? '' : 'bg-secondary/20'
                }`}
              >
                <span className="text-foreground font-medium">{kw.word}</span>
                <span className="text-right font-mono text-muted-foreground text-xs">
                  {Math.round(kw.score)}
                </span>
                <span
                  className={`text-right font-mono text-xs ${
                    kw.sentiment > 0
                      ? 'text-primary'
                      : kw.sentiment < 0
                        ? 'text-destructive'
                        : 'text-muted-foreground'
                  }`}
                >
                  {kw.sentiment > 0 ? '+' : ''}{kw.sentiment.toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
