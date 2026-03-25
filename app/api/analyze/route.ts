import { NextRequest, NextResponse } from 'next/server'
import { extractVideoId, fetchVideoDetails, fetchComments, calculateMetrics } from '@/lib/youtube'
import { analyzeComments } from '@/lib/sentiment'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: 'YouTube URL is required' }, { status: 400 })
    }

    const apiKey = process.env.YOUTUBE_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'YouTube API key is not configured. Please add YOUTUBE_API_KEY to your environment variables.' },
        { status: 500 }
      )
    }

    const videoId = extractVideoId(url)
    if (!videoId) {
      return NextResponse.json({ error: 'Invalid YouTube URL. Please provide a valid YouTube video link.' }, { status: 400 })
    }

    // Fetch video details and comments in parallel
    const [videoDetails, comments] = await Promise.all([
      fetchVideoDetails(videoId, apiKey),
      fetchComments(videoId, apiKey, 300),
    ])

    // Calculate video metrics
    const metrics = calculateMetrics(videoDetails)

    // Perform sentiment analysis on comments
    const sentimentAnalysis = analyzeComments(
      comments.map(c => ({
        text: c.text,
        likeCount: c.likeCount,
        authorName: c.authorName,
        publishedAt: c.publishedAt,
      }))
    )

    // Generate creator insights
    const insights = generateInsights(videoDetails, metrics, sentimentAnalysis)

    return NextResponse.json({
      video: videoDetails,
      metrics,
      sentiment: {
        total: sentimentAnalysis.total,
        positive: sentimentAnalysis.positive,
        negative: sentimentAnalysis.negative,
        neutral: sentimentAnalysis.neutral,
        positivePercent: sentimentAnalysis.positivePercent,
        negativePercent: sentimentAnalysis.negativePercent,
        neutralPercent: sentimentAnalysis.neutralPercent,
        overallScore: sentimentAnalysis.overallScore,
        overallLabel: sentimentAnalysis.overallLabel,
        avgConfidence: sentimentAnalysis.avgConfidence,
        topPositive: sentimentAnalysis.topPositive,
        topNegative: sentimentAnalysis.topNegative,
        mostLiked: sentimentAnalysis.mostLiked,
        sentimentTimeline: sentimentAnalysis.sentimentTimeline,
        keywords: sentimentAnalysis.keywords,
        avgCommentLength: sentimentAnalysis.avgCommentLength,
        avgLikesPerComment: sentimentAnalysis.avgLikesPerComment,
      },
      insights,
    })
  } catch (error) {
    console.error('Analysis error:', error)
    const message = error instanceof Error ? error.message : 'An unexpected error occurred'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

function generateInsights(
  video: Awaited<ReturnType<typeof fetchVideoDetails>>,
  metrics: ReturnType<typeof calculateMetrics>,
  sentiment: ReturnType<typeof analyzeComments>
) {
  const insights: { type: 'success' | 'warning' | 'info'; title: string; description: string }[] = []

  // Engagement insights
  if (metrics.engagementRate > 5) {
    insights.push({
      type: 'success',
      title: 'Exceptional Engagement',
      description: `Your engagement rate of ${metrics.engagementRate}% is well above the YouTube average of 1-3%. Your audience is highly interactive.`,
    })
  } else if (metrics.engagementRate > 2) {
    insights.push({
      type: 'success',
      title: 'Good Engagement',
      description: `Your engagement rate of ${metrics.engagementRate}% is above average. Keep creating content that resonates with your audience.`,
    })
  } else {
    insights.push({
      type: 'warning',
      title: 'Low Engagement Rate',
      description: `Your engagement rate of ${metrics.engagementRate}% is below average. Consider adding calls-to-action and engaging hooks in your content.`,
    })
  }

  // Sentiment insights
  if (sentiment.positivePercent > 70) {
    insights.push({
      type: 'success',
      title: 'Overwhelmingly Positive Reception',
      description: `${sentiment.positivePercent}% of comments are positive. Your audience loves this content. Consider creating similar videos.`,
    })
  } else if (sentiment.negativePercent > 30) {
    insights.push({
      type: 'warning',
      title: 'Notable Negative Sentiment',
      description: `${sentiment.negativePercent}% of comments are negative. Review the top negative comments to understand audience concerns and address them.`,
    })
  } else {
    insights.push({
      type: 'info',
      title: 'Mixed Sentiment',
      description: `Your comment sentiment is mixed with ${sentiment.positivePercent}% positive and ${sentiment.negativePercent}% negative. This is common for discussion-driven content.`,
    })
  }

  // Views performance
  if (metrics.viewsPerDay > 10000) {
    insights.push({
      type: 'success',
      title: 'Viral Performance',
      description: `Averaging ${metrics.viewsPerDay.toLocaleString()} views per day. This video is performing exceptionally well and may be getting algorithmic boost.`,
    })
  } else if (metrics.viewsPerDay > 1000) {
    insights.push({
      type: 'success',
      title: 'Strong View Velocity',
      description: `Averaging ${metrics.viewsPerDay.toLocaleString()} views per day. This video is performing well in discovery.`,
    })
  } else {
    insights.push({
      type: 'info',
      title: 'Steady View Growth',
      description: `Averaging ${metrics.viewsPerDay.toLocaleString()} views per day. Consider optimizing your title and thumbnail to improve click-through rate.`,
    })
  }

  // Like ratio
  if (metrics.likeRatio > 5) {
    insights.push({
      type: 'success',
      title: 'Excellent Like Ratio',
      description: `${metrics.likeRatio}% of viewers liked this video, which is excellent. This signals strong audience satisfaction to the algorithm.`,
    })
  } else if (metrics.likeRatio > 3) {
    insights.push({
      type: 'info',
      title: 'Good Like Ratio',
      description: `${metrics.likeRatio}% of viewers liked this video. This is a healthy like-to-view ratio.`,
    })
  }

  // Comment engagement
  if (sentiment.avgLikesPerComment > 10) {
    insights.push({
      type: 'success',
      title: 'Engaging Comment Section',
      description: `Comments average ${sentiment.avgLikesPerComment} likes each, indicating an active and engaged community around your content.`,
    })
  }

  // Content length insight
  if (video.duration > 600) {
    const estimatedWatchPercent = Math.round((metrics.estimatedAvgWatchTime / video.duration) * 100)
    insights.push({
      type: 'info',
      title: 'Long-Form Content',
      description: `At ${video.durationFormatted}, this is long-form content. Estimated ${estimatedWatchPercent}% average retention. Consider adding timestamps and hooks to maintain viewer attention.`,
    })
  }

  // Keywords insight
  if (sentiment.keywords.length > 0) {
    const topWords = sentiment.keywords.slice(0, 3).map(k => k.word)
    insights.push({
      type: 'info',
      title: 'Top Discussion Topics',
      description: `Your audience is most discussing: "${topWords.join('", "')}". Use these topics to guide your future content strategy.`,
    })
  }

  return insights
}
