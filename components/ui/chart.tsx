"use client"

import type * as React from "react"
import {
  CartesianGrid,
  Line,
  LineChart,
  Bar,
  BarChart,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  Area,
  AreaChart,
} from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Define a type for the chart components
type ChartComponent = typeof LineChart | typeof BarChart | typeof PieChart | typeof RadialBarChart | typeof AreaChart

// Define a type for the chart elements (Line, Bar, Pie, etc.)
type ChartElement = typeof Line | typeof Bar | typeof Pie | typeof RadialBar | typeof Area | typeof CartesianGrid

interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  chartType: "line" | "bar" | "pie" | "radial" | "area"
  data: Record<string, any>[]
  dataKeys: { name: string; color: string; type?: string }[]
  xAxisKey?: string
  yAxisKey?: string
  className?: string
}

const chartComponents: Record<string, ChartComponent> = {
  line: LineChart,
  bar: BarChart,
  pie: PieChart,
  radial: RadialBarChart,
  area: AreaChart,
}

const chartElements: Record<string, ChartElement> = {
  line: Line,
  bar: Bar,
  pie: Pie,
  radial: RadialBar,
  area: Area,
  grid: CartesianGrid,
}

export function Chart({
  title,
  description,
  chartType,
  data,
  dataKeys,
  xAxisKey,
  yAxisKey,
  className,
  ...props
}: ChartProps) {
  const ChartComponent = chartComponents[chartType]
  const ChartElement = chartElements[chartType]

  if (!ChartComponent || !ChartElement) {
    return <div>Invalid chart type</div>
  }

  return (
    <Card className={className} {...props}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={dataKeys.reduce(
            (acc, key) => ({
              ...acc,
              [key.name]: { color: key.color },
            }),
            {},
          )}
          className="aspect-auto h-[250px] w-full"
        >
          <ChartComponent data={data}>
            <chartElements.grid vertical={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            {dataKeys.map((key) => {
              if (chartType === "pie" || chartType === "radial") {
                return (
                  <ChartElement
                    key={key.name}
                    dataKey={key.name}
                    name={key.name}
                    fill={key.color}
                    innerRadius={chartType === "pie" ? 60 : 20}
                    outerRadius={chartType === "pie" ? 80 : 80}
                  />
                )
              } else {
                return (
                  <ChartElement
                    key={key.name}
                    dataKey={key.name}
                    stroke={key.color}
                    fill={key.color}
                    type={key.type || "monotone"}
                  />
                )
              }
            })}
          </ChartComponent>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
