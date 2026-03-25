'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react'

interface InsightsSectionProps {
  insights: Array<{
    type: 'success' | 'warning' | 'info'
    title: string
    description: string
  }>
}

const iconMap = {
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Info,
}

const colorMap = {
  success: {
    icon: 'text-primary',
    border: 'border-primary/20',
    bg: 'bg-primary/5',
  },
  warning: {
    icon: 'text-chart-4',
    border: 'border-chart-4/20',
    bg: 'bg-chart-4/5',
  },
  info: {
    icon: 'text-chart-3',
    border: 'border-chart-3/20',
    bg: 'bg-chart-3/5',
  },
}

export function InsightsSection({ insights }: InsightsSectionProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Creator Insights & Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {insights.map((insight, i) => {
            const Icon = iconMap[insight.type]
            const colors = colorMap[insight.type]

            return (
              <div
                key={i}
                className={`flex gap-3 rounded-lg border p-4 ${colors.border} ${colors.bg}`}
              >
                <Icon className={`h-5 w-5 shrink-0 mt-0.5 ${colors.icon}`} />
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-foreground">{insight.title}</span>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {insight.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
