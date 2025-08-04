"use client"
import React from "react"
import {
  CartesianGrid,
  Line,
  LineChart,
  Bar,
  BarChart,
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer as RechartsChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart" // Corrected import path
import { cn } from "@/lib/utils"

const ChartContainer = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof RechartsChartContainer>>(
  ({ className, ...props }, ref) => (
    <RechartsChartContainer ref={ref} className={cn("h-[200px] w-full", className)} {...props} />
  ),
)
ChartContainer.displayName = "ChartContainer"

interface ChartProps {
  data: any[]
  type: "line" | "bar" | "area"
  xAxisKey: string
  yAxisKey: string
  title?: string
  description?: string
  lineColor?: string
  barColor?: string
  areaColor?: string
}

export function Chart({
  data,
  type,
  xAxisKey,
  yAxisKey,
  title,
  description,
  lineColor = "hsl(var(--primary))",
  barColor = "hsl(var(--primary))",
  areaColor = "hsl(var(--primary))",
}: ChartProps) {
  const ChartComponent = type === "line" ? LineChart : type === "bar" ? BarChart : AreaChart
  const DataComponent = type === "line" ? Line : type === "bar" ? Bar : Area

  return (
    <Card>
      <CardHeader>
        {title && <CardTitle>{title}</CardTitle>}
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            [yAxisKey]: {
              label: yAxisKey,
              color: "hsl(var(--primary))",
            },
          }}
        >
          <ResponsiveContainer width="100%" height={300}>
            <ChartComponent data={data}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey={xAxisKey}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} tickCount={5} />
              <Tooltip content={<ChartTooltipContent />} />
              <Legend />
              <DataComponent
                dataKey={yAxisKey}
                fill={type === "line" ? lineColor : type === "bar" ? barColor : areaColor}
                stroke={lineColor}
                type="monotone"
              />
            </ChartComponent>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export { ChartContainer, ChartTooltip, ChartTooltipContent }
