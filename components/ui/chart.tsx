"use client"

import * as React from "react"
import { Bar, BarChart, Line, LineChart, Pie, PieChart, XAxis, YAxis, ResponsiveContainer } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"

const ChartContext = React.createContext<ChartConfig | null>(null)

function Chart({
  config,
  className,
  children,
  ...props
}: React.ComponentProps<typeof ChartContainer> & {
  config: ChartConfig
}) {
  return (
    <ChartContext.Provider value={config}>
      <ChartContainer className={cn("h-[200px] w-full", className)} {...props}>
        {children}
      </ChartContainer>
    </ChartContext.Provider>
  )
}

const ChartTooltipLabel = ({
  className,
  ...props
}: React.ComponentProps<typeof ChartTooltipContent>["label"] & {
  className?: string
}) => {
  const config = React.useContext(ChartContext)

  if (!config) {
    return null
  }

  const unit = config[props.payload?.[0]?.dataKey as keyof typeof config]?.unit

  return (
    <ChartTooltipContent
      className={cn("flex flex-col space-y-1.5", className)}
      formatter={(value) => (
        <span className="font-medium">
          {value.toLocaleString()}
          {unit ? ` ${unit}` : ""}
        </span>
      )}
      {...props}
    />
  )
}

const ChartLegendLabel = ({
  className,
  ...props
}: React.ComponentProps<typeof ChartLegendContent>["item"] & {
  className?: string
}) => {
  const config = React.useContext(ChartContext)

  if (!config) {
    return null
  }

  const unit = config[props.payload?.dataKey as keyof typeof config]?.unit

  return (
    <ChartLegendContent
      className={cn("flex items-center gap-1", className)}
      formatter={(value) => (
        <span className="font-medium">
          {value}
          {unit ? ` ${unit}` : ""}
        </span>
      )}
      {...props}
    />
  )
}

const ChartCrosshair = ({
  className,
  ...props
}: React.ComponentProps<typeof ChartTooltip> & {
  className?: string
}) => {
  return (
    <ChartTooltip
      hideContent
      hideLabel
      formatter={(value) => <span className="font-medium">{value.toLocaleString()}</span>}
      className={cn("[&>.recharts-crosshair]:fill-foreground/20", className)}
      {...props}
    />
  )
}

const ChartBar = React.forwardRef<
  React.ElementRef<typeof Bar>,
  React.ComponentPropsWithoutRef<typeof Bar> & {
    className?: string
  }
>(({ className, ...props }, ref) => {
  const config = React.useContext(ChartContext)

  if (!config) {
    return null
  }

  const stroke = config[props.dataKey as keyof typeof config]?.stroke
  const fill = config[props.dataKey as keyof typeof config]?.fill

  return <Bar ref={ref} className={cn("stroke-primary", className)} stroke={stroke} fill={fill} {...props} />
})

const ChartLine = React.forwardRef<
  React.ElementRef<typeof Line>,
  React.ComponentPropsWithoutRef<typeof Line> & {
    className?: string
  }
>(({ className, ...props }, ref) => {
  const config = React.useContext(ChartContext)

  if (!config) {
    return null
  }

  const stroke = config[props.dataKey as keyof typeof config]?.stroke
  const fill = config[props.dataKey as keyof typeof config]?.fill

  return <Line ref={ref} className={cn("stroke-primary", className)} stroke={stroke} fill={fill} {...props} />
})

const ChartPie = React.forwardRef<
  React.ElementRef<typeof Pie>,
  React.ComponentPropsWithoutRef<typeof Pie> & {
    className?: string
  }
>(({ className, ...props }, ref) => {
  const config = React.useContext(ChartContext)

  if (!config) {
    return null
  }

  const stroke = config[props.dataKey as keyof typeof config]?.stroke
  const fill = config[props.dataKey as keyof typeof config]?.fill

  return <Pie ref={ref} className={cn("stroke-primary", className)} stroke={stroke} fill={fill} {...props} />
})

export {
  Chart,
  ChartTooltipLabel,
  ChartLegendLabel,
  ChartCrosshair,
  ChartBar,
  ChartLine,
  ChartPie,
  BarChart,
  LineChart,
  PieChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ChartTooltip,
  ChartLegend,
}
