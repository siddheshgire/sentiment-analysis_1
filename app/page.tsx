'use client'

import { useState } from 'react'
import { HeroSection } from '@/components/hero-section'
import { AnalysisDashboard } from '@/components/analysis-dashboard'

export interface AnalysisData {
  video: {
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
  }
  metrics: {
    engagementRate: number
    viewsPerMinute: number
    likeRatio: number
    commentRatio: number
    estimatedAvgWatchTime: number
    estimatedAvgWatchTimeFormatted: string
    totalWatchHours: number
    daysSincePublish: number
    viewsPerDay: number
    viralityScore: number
  }
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
    topPositive: Array<{
      text: string
      authorName: string
      likeCount: number
      publishedAt: string
      sentiment: { score: number; label: string; confidence: number }
    }>
    topNegative: Array<{
      text: string
      authorName: string
      likeCount: number
      publishedAt: string
      sentiment: { score: number; label: string; confidence: number }
    }>
    mostLiked: Array<{
      text: string
      authorName: string
      likeCount: number
      publishedAt: string
      sentiment: { score: number; label: string; confidence: number }
    }>
    sentimentTimeline: Array<{
      date: string
      positive: number
      negative: number
      neutral: number
      total: number
      positivePercent: number
    }>
    keywords: Array<{
      word: string
      score: number
      sentiment: number
    }>
    avgCommentLength: number
    avgLikesPerComment: number
  }
  insights: Array<{
    type: 'success' | 'warning' | 'info'
    title: string
    description: string
  }>
}

export default function Home() {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async (url: string) => {
    setIsAnalyzing(true)
    setError(null)
    setAnalysisData(null)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Analysis failed')
      }

      setAnalysisData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleReset = () => {
    setAnalysisData(null)
    setError(null)
  }

  return (
    <main className="min-h-screen bg-background">
      {!analysisData ? (
        <HeroSection
          onAnalyze={handleAnalyze}
          isAnalyzing={isAnalyzing}
          error={error}
        />
      ) : (
        <AnalysisDashboard
          data={analysisData}
          onReset={handleReset}
        />
      )}
    </main>
  )
}
