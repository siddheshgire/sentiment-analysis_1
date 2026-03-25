'use client'

import { ArrowLeft, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { AnalysisData } from '@/app/page'
import { VideoOverview } from '@/components/dashboard/video-overview'
import { MetricsGrid } from '@/components/dashboard/metrics-grid'
import { SentimentOverview } from '@/components/dashboard/sentiment-overview'
import { SentimentChart } from '@/components/dashboard/sentiment-chart'
import { SentimentTimeline } from '@/components/dashboard/sentiment-timeline'
import { TopComments } from '@/components/dashboard/top-comments'
import { KeywordsSection } from '@/components/dashboard/keywords-section'
import { InsightsSection } from '@/components/dashboard/insights-section'

interface AnalysisDashboardProps {
  data: AnalysisData
  onReset: () => void
}

export function AnalysisDashboard({ data, onReset }: AnalysisDashboardProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex items-center justify-between px-4 py-3 max-w-7xl">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              New Analysis
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 border border-primary/20">
              <BarChart3 className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-medium tracking-wider uppercase text-muted-foreground hidden sm:block">
              TubeInsight
            </span>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="mx-auto max-w-7xl px-4 py-6 flex flex-col gap-6">
        {/* Video Overview */}
        <VideoOverview video={data.video} metrics={data.metrics} />

        {/* Metrics Grid */}
        <MetricsGrid video={data.video} metrics={data.metrics} sentiment={data.sentiment} />

        {/* Sentiment Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SentimentOverview sentiment={data.sentiment} />
          <div className="lg:col-span-2">
            <SentimentChart sentiment={data.sentiment} />
          </div>
        </div>

        {/* Timeline */}
        {data.sentiment.sentimentTimeline.length > 1 && (
          <SentimentTimeline timeline={data.sentiment.sentimentTimeline} />
        )}

        {/* Comments & Keywords */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopComments
            positive={data.sentiment.topPositive}
            negative={data.sentiment.topNegative}
            mostLiked={data.sentiment.mostLiked}
          />
          <KeywordsSection keywords={data.sentiment.keywords} />
        </div>

        {/* Insights */}
        <InsightsSection insights={data.insights} />
      </div>
    </div>
  )
}
