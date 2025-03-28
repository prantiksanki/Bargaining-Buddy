"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart"

export function PriceHistoryChart({ data }) {
  return (
    <ChartContainer
      config={{
        amazon: {
          label: "Amazon",
          color: "hsl(var(--primary))",
        },
        bestbuy: {
          label: "Best Buy",
          color: "hsl(var(--secondary, 280 100% 70%))",
        },
        walmart: {
          label: "Walmart",
          color: "hsl(var(--accent))",
        },
        target: {
          label: "Target",
          color: "hsl(var(--muted))",
        },
      }}
      className="aspect-[4/3] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line type="monotone" dataKey="amazon" strokeWidth={2} activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="bestbuy" strokeWidth={2} activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="walmart" strokeWidth={2} activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="target" strokeWidth={2} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

