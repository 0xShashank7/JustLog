import React from 'react'
import { CardHeader, Card, CardTitle, CardDescription, CardContent } from '../ui/card';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { CustomTooltipProps, DurationData } from '@/interfaces/types';

interface DurationDataProps {
    durationData: DurationData[]
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-lg border bg-background p-2 shadow-sm">
                <div className="grid gap-2">
                    <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                            {label}
                        </span>
                        {payload.map((entry, index) => (
                            <span key={index} className="font-bold text-foreground">
                                {entry.value}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
    return null;
};


export default function DurationTrends({ durationData }: DurationDataProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Duration Trends</CardTitle>
                <CardDescription>Workout duration over time</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={durationData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis
                            dataKey="day"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            className="text-muted-foreground"
                        />
                        <YAxis
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            className="text-muted-foreground"
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                            type="monotone"
                            dataKey="duration"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
