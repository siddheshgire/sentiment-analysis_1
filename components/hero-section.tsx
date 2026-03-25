'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, Zap, BarChart3, MessageSquare, TrendingUp, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeroSectionProps {
  onAnalyze: (url: string) => void
  isAnalyzing: boolean
  error: string | null
}

export function HeroSection({ onAnalyze, isAnalyzing, error }: HeroSectionProps) {
  const [url, setUrl] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (url.trim() && !isAnalyzing) {
      onAnalyze(url.trim())
    }
  }

  const features = [
    { icon: BarChart3, label: 'Deep Analytics', desc: 'Views, engagement, watch time metrics' },
    { icon: MessageSquare, label: 'Sentiment Analysis', desc: 'ML-powered comment classification' },
    { icon: TrendingUp, label: 'Creator Insights', desc: 'Actionable business recommendations' },
    { icon: Zap, label: 'Keyword Extraction', desc: 'TF-IDF topic analysis' },
  ]

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4">
      {/* Background grid pattern */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-3xl">
        {/* Logo & Title */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/20 border border-primary/40 pulse-glow">
              <BarChart3 className="h-5 w-5 text-primary spin-slow" />
            </div>
            <span className="text-sm font-medium tracking-widest uppercase text-primary float-bounce">
              TubeInsight
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground text-balance">
            YouTube Video
            <span className="block text-primary float-bounce" style={{ animationDelay: '200ms' }}>Sentiment Analyzer</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl leading-relaxed text-pretty">
            Paste any YouTube link and get deep analysis powered by mathematical ML fundamentals. Understand your audience sentiment, engagement metrics, and get actionable creator insights.
          </p>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSubmit} className="w-full">
          <div className="relative flex items-center w-full rounded-xl border border-border bg-card shadow-lg shadow-primary/10 transition-all focus-within:border-primary focus-within:shadow-primary/30 focus-within:pulse-glow">
            <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste YouTube video URL here..."
              className="flex-1 bg-transparent py-4 pl-12 pr-4 text-foreground placeholder:text-muted-foreground/60 focus:outline-none text-base"
              disabled={isAnalyzing}
              aria-label="YouTube video URL"
            />
            <div className="pr-2">
              <Button
                type="submit"
                disabled={!url.trim() || isAnalyzing}
                className="rounded-lg px-6 font-medium"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze'
                )}
              </Button>
            </div>
          </div>
        </form>

        {/* Error Display */}
        {error && (
          <div className="w-full flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <AlertCircle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-destructive">Analysis Failed</p>
              <p className="text-sm text-destructive/80 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isAnalyzing && (
          <div className="w-full flex flex-col items-center gap-4 py-4">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse delay-150" style={{ animationDelay: '150ms' }} />
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse delay-300" style={{ animationDelay: '300ms' }} />
            </div>
            <p className="text-sm text-muted-foreground">
              Fetching video data, analyzing comments, and generating insights...
            </p>
          </div>
        )}

        {/* Feature Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full mt-4">
          {features.map((feature) => (
            <div
              key={feature.label}
              className="flex flex-col items-center gap-2 rounded-lg border border-border/50 bg-card/50 p-4 text-center transition-colors hover:border-primary/30 hover:bg-card"
            >
              <feature.icon className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-foreground">{feature.label}</span>
              <span className="text-xs text-muted-foreground leading-relaxed">{feature.desc}</span>
            </div>
          ))}
        </div>

        {/* Example URLs */}
        <div className="flex flex-col items-center gap-2 mt-2">
          <span className="text-xs text-muted-foreground">Try an example:</span>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { label: 'Music Video', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
              { label: 'Tech Review', url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw' },
            ].map((example) => (
              <button
                key={example.label}
                onClick={() => {
                  setUrl(example.url)
                  onAnalyze(example.url)
                }}
                disabled={isAnalyzing}
                className="rounded-full border border-border/50 bg-secondary/50 px-3 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground hover:border-primary/30 disabled:opacity-50"
              >
                {example.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
