"use client"
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
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart-components"
import { cn } from "@/lib/utils"

// Define common chart props for reusability
interface CommonChartProps {
  data: any[]
  categories: string[]
  index: string
  type?: "line" | "bar" | "area"
  title?: string
  description?: string
  className?: string
}

const Chart = ({ data, categories, index, type = "line", title, description, className }: CommonChartProps) => {
  const ChartComponent = type === "line" ? LineChart : type === "bar" ? BarChart : AreaChart
  const ChartElement = type === "line" ? Line : type === "bar" ? Bar : Area

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        {title && <CardTitle>{title}</CardTitle>}
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            [index]: {
              label: index,
              color: "hsl(var(--chart-1))",
            },
            ...categories.reduce((acc, category, i) => {
              acc[category] = {
                label: category,
                color: `hsl(var(--chart-${(i % 5) + 1}))`, // Cycle through chart colors
              }
              return acc
            }, {}),
          }}
          className="aspect-video h-[250px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <ChartComponent data={data}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey={index}
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis tickLine={false} tickMargin={10} axisLine={false} />
              <Tooltip content={<ChartTooltipContent />} />
              <Legend />
              {categories.map((category, i) => (
                <ChartElement
                  key={category}
                  dataKey={category}
                  stroke={`hsl(var(--chart-${(i % 5) + 1}))`}
                  fill={`hsl(var(--chart-${(i % 5) + 1}))`}
                  type="monotone"
                />
              ))}
            </ChartComponent>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export { Chart }
