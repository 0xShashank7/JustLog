"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../../components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "../../components/ui/chart"

export const description = "A stacked bar chart with a legend"

const chartData = [
    { month: "January", run: 186, walk: 80 },
    { month: "February", run: 305, walk: 200 },
    { month: "March", run: 237, walk: 120 },
    { month: "April", run: 73, walk: 190 },
    { month: "May", run: 209, walk: 130 },
    { month: "June", run: 214, walk: 140 },
]

const chartConfig = {
    run: {
        label: "Run",
        color: "#0ea5e9",
    },
    walk: {
        label: "Walk",
        color: "#10b981",
    },
} satisfies ChartConfig

export function ChartBarStacked() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Monthly Activity</CardTitle>
                <CardDescription>Duration logged per month</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar
                            dataKey="run"
                            stackId="a"
                            fill="#10b981"
                            radius={[0, 0, 4, 4]}
                        />
                        <Bar
                            dataKey="walk"
                            fill="#0ea5e9"
                            stackId="a"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground leading-none">
                    Showing total visitors for the last 6 months
                </div>
            </CardFooter>
        </Card>
    )
}
