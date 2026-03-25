/**
 * Sentiment Analysis Engine
 * 
 * Uses lexicon-based scoring with mathematical fundamentals:
 * - AFINN-inspired word scoring (-5 to +5 scale)
 * - TF-IDF keyword extraction
 * - Bayesian confidence scoring
 * - N-gram analysis for context
 */

// Comprehensive sentiment lexicon (AFINN-inspired, -5 to +5)
const SENTIMENT_LEXICON: Record<string, number> = {
  // Strong positive words
  'amazing': 5, 'awesome': 5, 'excellent': 5, 'outstanding': 5, 'incredible': 5,
  'masterpiece': 5, 'brilliant': 5, 'phenomenal': 5, 'perfect': 5, 'exceptional': 5,
  'extraordinary': 5, 'superb': 5, 'magnificent': 5, 'spectacular': 5,
  
  // Positive words
  'good': 3, 'great': 4, 'love': 4, 'like': 2, 'best': 4, 'wonderful': 4,
  'fantastic': 4, 'beautiful': 4, 'enjoy': 3, 'happy': 3, 'helpful': 3,
  'informative': 3, 'useful': 3, 'impressive': 4, 'cool': 2, 'nice': 2,
  'interesting': 3, 'recommend': 3, 'favorite': 3, 'fun': 3, 'exciting': 4,
  'creative': 3, 'inspiring': 4, 'talented': 3, 'genius': 4, 'clear': 2,
  'engaging': 3, 'entertaining': 3, 'educational': 3, 'quality': 3,
  'valuable': 3, 'insightful': 3, 'well': 2, 'better': 2, 'thanks': 2,
  'thank': 2, 'appreciate': 3, 'congratulations': 3, 'bravo': 4,
  'underrated': 3, 'legendary': 4, 'goat': 4, 'fire': 3, 'lit': 3,
  'dope': 3, 'sick': 2, 'blessed': 3, 'wholesome': 4, 'beautiful': 4,
  'heartwarming': 4, 'touching': 3, 'moving': 3, 'powerful': 3,
  'motivating': 3, 'uplifting': 4, 'positive': 2, 'win': 3, 'winning': 3,
  'worth': 2, 'subscribe': 2, 'subscribed': 2, 'support': 2, 'respect': 3,
  'agree': 2, 'correct': 2, 'accurate': 2, 'true': 1, 'right': 1,
  'yes': 1, 'definitely': 2, 'absolutely': 3, 'exactly': 2, 'top': 2,
  'king': 3, 'queen': 3, 'hero': 3, 'legend': 4, 'iconic': 3,

  // Mild positive
  'ok': 1, 'okay': 1, 'decent': 1, 'fine': 1, 'alright': 1, 'fair': 1,

  // Negative words
  'bad': -3, 'terrible': -4, 'horrible': -4, 'awful': -4, 'worst': -5,
  'hate': -4, 'dislike': -3, 'boring': -3, 'waste': -3, 'poor': -3,
  'disappointing': -3, 'disappointed': -3, 'ugly': -3, 'stupid': -3,
  'dumb': -3, 'lame': -2, 'sucks': -3, 'suck': -3, 'trash': -4,
  'garbage': -4, 'useless': -3, 'annoying': -3, 'irritating': -3,
  'frustrating': -3, 'confusing': -2, 'misleading': -3, 'clickbait': -3,
  'fake': -3, 'scam': -4, 'fraud': -4, 'cringe': -3, 'overrated': -2,
  'mediocre': -2, 'meh': -1, 'wrong': -2, 'worse': -3, 'fail': -3,
  'failure': -3, 'pathetic': -4, 'ridiculous': -2, 'absurd': -2,
  'disgusting': -4, 'offensive': -3, 'toxic': -3, 'negative': -2,
  'unsubscribe': -3, 'unsubscribed': -3, 'disrespect': -3, 'spam': -3,
  'stolen': -3, 'copy': -1, 'copied': -2, 'plagiarism': -4,

  // Strong negative
  'terrible': -4, 'horrendous': -5, 'atrocious': -5, 'abysmal': -5,
  'catastrophic': -5, 'nightmare': -4, 'disaster': -4, 'ruined': -4,
  'destroyed': -4, 'wrecked': -3,

  // Intensifiers (modify adjacent words)
  'very': 0, 'really': 0, 'extremely': 0, 'super': 0, 'so': 0,
  'absolutely': 0, 'totally': 0, 'completely': 0, 'incredibly': 0,

  // Negation words (handled separately)
  'not': 0, 'never': 0, 'no': 0, "don't": 0, "doesn't": 0,
  "won't": 0, "can't": 0, "couldn't": 0, "wouldn't": 0, "shouldn't": 0,
}

const NEGATION_WORDS = new Set([
  'not', 'never', 'no', "don't", "doesn't", "won't", "can't",
  "couldn't", "wouldn't", "shouldn't", "barely", "hardly", "neither",
  "nor", "nothing", "nobody", "nowhere", "isn't", "aren't", "wasn't",
  "weren't", "hasn't", "haven't", "hadn't",
])

const INTENSIFIERS: Record<string, number> = {
  'very': 1.5, 'really': 1.5, 'extremely': 2.0, 'super': 1.5,
  'so': 1.3, 'absolutely': 2.0, 'totally': 1.5, 'completely': 1.8,
  'incredibly': 2.0, 'highly': 1.5, 'quite': 1.2, 'fairly': 0.8,
  'somewhat': 0.5, 'slightly': 0.3, 'a bit': 0.5,
}

// Emoji sentiment scores
const EMOJI_PATTERNS: [RegExp, number][] = [
  [/[😍🥰😘💕💖💗💓💞💝❤️💚💙💜🖤🤍🧡💛]/g, 3],
  [/[😀😁😂🤣😃😄😅😆😊😉🙂🙃😋😎🤩🥳]/g, 2],
  [/[👍👏🔥💯🎉🎊✨⭐🌟💪🙌👑🏆💎]/g, 3],
  [/[😐😑😶🤔🤨]/g, 0],
  [/[😕😟😔😞😒😩😫😤😠😡🤬😈👎💩😭😢😥]/g, -3],
  [/[🤮🤢😷💀☠️🚫❌⛔]/g, -3],
]

/**
 * Tokenize text into words
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s'-]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 0)
}

/**
 * Calculate sentiment score for a single comment
 * Uses modified AFINN approach with negation handling and intensifier detection
 */
export function analyzeSentiment(text: string): {
  score: number
  magnitude: number
  label: 'positive' | 'negative' | 'neutral'
  confidence: number
} {
  const tokens = tokenize(text)
  let totalScore = 0
  let wordCount = 0
  let magnitudeSum = 0

  // Process emoji sentiment
  for (const [pattern, score] of EMOJI_PATTERNS) {
    const matches = text.match(pattern)
    if (matches) {
      totalScore += score * matches.length
      wordCount += matches.length
      magnitudeSum += Math.abs(score) * matches.length
    }
  }

  // Process word-level sentiment with context
  for (let i = 0; i < tokens.length; i++) {
    const word = tokens[i]
    const lexScore = SENTIMENT_LEXICON[word]

    if (lexScore !== undefined && lexScore !== 0) {
      let modifiedScore = lexScore

      // Check for negation in previous 3 words
      let isNegated = false
      for (let j = Math.max(0, i - 3); j < i; j++) {
        if (NEGATION_WORDS.has(tokens[j])) {
          isNegated = true
          break
        }
      }

      if (isNegated) {
        modifiedScore = -modifiedScore * 0.75 // Negation flips and dampens
      }

      // Check for intensifiers in previous 2 words
      for (let j = Math.max(0, i - 2); j < i; j++) {
        const intensifier = INTENSIFIERS[tokens[j]]
        if (intensifier !== undefined) {
          modifiedScore = modifiedScore * intensifier
        }
      }

      totalScore += modifiedScore
      wordCount++
      magnitudeSum += Math.abs(modifiedScore)
    }
  }

  // Normalize score to [-1, 1] range using sigmoid-like function
  const rawScore = wordCount > 0 ? totalScore / Math.sqrt(wordCount) : 0
  const normalizedScore = Math.tanh(rawScore / 3) // Smooth normalization

  // Calculate confidence using Bayesian-inspired approach
  // More sentiment-bearing words = higher confidence
  const tokenCount = Math.max(tokens.length, 1)
  const sentimentDensity = wordCount / tokenCount
  const confidence = Math.min(
    1,
    1 - Math.exp(-2 * sentimentDensity) * (1 - sentimentDensity)
  )

  // Classify
  let label: 'positive' | 'negative' | 'neutral'
  if (normalizedScore > 0.05) label = 'positive'
  else if (normalizedScore < -0.05) label = 'negative'
  else label = 'neutral'

  return {
    score: Math.round(normalizedScore * 1000) / 1000,
    magnitude: Math.round((magnitudeSum / Math.max(wordCount, 1)) * 100) / 100,
    label,
    confidence: Math.round(confidence * 100) / 100,
  }
}

/**
 * Extract keywords using TF-IDF inspired approach
 */
export function extractKeywords(comments: string[], topN: number = 15): { word: string; score: number; sentiment: number }[] {
  const stopWords = new Set([
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'can', 'shall', 'to', 'of', 'in', 'for',
    'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through', 'during',
    'before', 'after', 'above', 'below', 'between', 'out', 'off', 'over',
    'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when',
    'where', 'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more',
    'most', 'other', 'some', 'such', 'only', 'own', 'same', 'so', 'than',
    'too', 'very', 'just', 'because', 'but', 'and', 'or', 'if', 'while',
    'about', 'up', 'its', 'it', 'this', 'that', 'these', 'those', 'i',
    'me', 'my', 'we', 'our', 'you', 'your', 'he', 'him', 'his', 'she',
    'her', 'they', 'them', 'their', 'what', 'which', 'who', 'whom',
    'not', 'no', 'nor', 'don', 'doesn', 'didn', 'won', 'wouldn', 'couldn',
    'shouldn', 'also', 'like', 'get', 'got', 'one', 'im', 'ive', 've',
    'really', 'much', 'even', 'still', 'well', 'back', 'going', 'go',
    'know', 'think', 'make', 'see', 'come', 'want', 'look', 'use',
    'find', 'give', 'tell', 'say', 'said', 'let', 'put', 'take',
  ])

  // Term frequency across all documents
  const tf: Record<string, number> = {}
  // Document frequency (how many comments contain the word)
  const df: Record<string, number> = {}
  // Track sentiment per word
  const wordSentiment: Record<string, number[]> = {}

  const totalDocs = comments.length

  for (const comment of comments) {
    const tokens = tokenize(comment)
    const seenInDoc = new Set<string>()

    for (const token of tokens) {
      if (token.length < 3 || stopWords.has(token) || /^\d+$/.test(token)) continue

      tf[token] = (tf[token] || 0) + 1
      wordSentiment[token] = wordSentiment[token] || []

      const lexScore = SENTIMENT_LEXICON[token]
      if (lexScore !== undefined) {
        wordSentiment[token].push(lexScore)
      }

      if (!seenInDoc.has(token)) {
        df[token] = (df[token] || 0) + 1
        seenInDoc.add(token)
      }
    }
  }

  // Calculate TF-IDF scores
  const tfidf: { word: string; score: number; sentiment: number }[] = []

  for (const word in tf) {
    const termFreq = tf[word]
    const docFreq = df[word] || 1
    // TF-IDF: tf * log(N / df)
    const score = termFreq * Math.log(totalDocs / docFreq)

    const sentiments = wordSentiment[word] || []
    const avgSentiment = sentiments.length > 0
      ? sentiments.reduce((a, b) => a + b, 0) / sentiments.length
      : 0

    tfidf.push({ word, score: Math.round(score * 100) / 100, sentiment: avgSentiment })
  }

  // Sort by score and return top N
  return tfidf.sort((a, b) => b.score - a.score).slice(0, topN)
}

/**
 * Batch analyze comments and produce aggregate statistics
 */
export function analyzeComments(comments: { text: string; likeCount: number; authorName: string; publishedAt: string }[]) {
  const results = comments.map(c => ({
    ...c,
    sentiment: analyzeSentiment(c.text),
  }))

  const positive = results.filter(r => r.sentiment.label === 'positive')
  const negative = results.filter(r => r.sentiment.label === 'negative')
  const neutral = results.filter(r => r.sentiment.label === 'neutral')

  // Sort by sentiment score * confidence for top comments
  const topPositive = [...positive]
    .sort((a, b) => (b.sentiment.score * b.sentiment.confidence) - (a.sentiment.score * a.sentiment.confidence))
    .slice(0, 5)

  const topNegative = [...negative]
    .sort((a, b) => (a.sentiment.score * a.sentiment.confidence) - (b.sentiment.score * b.sentiment.confidence))
    .slice(0, 5)

  // Most liked comments
  const mostLiked = [...results]
    .sort((a, b) => b.likeCount - a.likeCount)
    .slice(0, 5)

  // Overall sentiment score (weighted average by confidence)
  const totalWeight = results.reduce((sum, r) => sum + r.sentiment.confidence, 0)
  const weightedScore = totalWeight > 0
    ? results.reduce((sum, r) => sum + r.sentiment.score * r.sentiment.confidence, 0) / totalWeight
    : 0

  // Sentiment over time
  const sortedByTime = [...results].sort(
    (a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
  )

  // Group by date for sentiment timeline
  const timelineMap = new Map<string, { positive: number; negative: number; neutral: number; total: number }>()
  for (const r of sortedByTime) {
    const date = new Date(r.publishedAt).toISOString().split('T')[0]
    const existing = timelineMap.get(date) || { positive: 0, negative: 0, neutral: 0, total: 0 }
    existing[r.sentiment.label]++
    existing.total++
    timelineMap.set(date, existing)
  }

  const sentimentTimeline = Array.from(timelineMap.entries()).map(([date, data]) => ({
    date,
    positive: data.positive,
    negative: data.negative,
    neutral: data.neutral,
    total: data.total,
    positivePercent: Math.round((data.positive / data.total) * 100),
  }))

  // Extract keywords
  const keywords = extractKeywords(comments.map(c => c.text))

  // Average comment length
  const avgLength = Math.round(
    comments.reduce((sum, c) => sum + c.text.length, 0) / Math.max(comments.length, 1)
  )

  // Engagement score (likes per comment on average)
  const avgLikes = Math.round(
    (comments.reduce((sum, c) => sum + c.likeCount, 0) / Math.max(comments.length, 1)) * 10
  ) / 10

  return {
    total: results.length,
    positive: positive.length,
    negative: negative.length,
    neutral: neutral.length,
    positivePercent: Math.round((positive.length / Math.max(results.length, 1)) * 100),
    negativePercent: Math.round((negative.length / Math.max(results.length, 1)) * 100),
    neutralPercent: Math.round((neutral.length / Math.max(results.length, 1)) * 100),
    overallScore: Math.round(weightedScore * 1000) / 1000,
    overallLabel: weightedScore > 0.05 ? 'positive' : weightedScore < -0.05 ? 'negative' : 'neutral',
    avgConfidence: Math.round((results.reduce((s, r) => s + r.sentiment.confidence, 0) / Math.max(results.length, 1)) * 100),
    topPositive,
    topNegative,
    mostLiked,
    sentimentTimeline,
    keywords,
    avgCommentLength: avgLength,
    avgLikesPerComment: avgLikes,
    allResults: results,
  }
}
