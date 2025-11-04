import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

import type { Metrics } from "@/interfaces/types";


export default function MetricsComponent({ metrics }: { metrics: Metrics }) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            <Card className="sm:col-span-2">
                <CardHeader className="pb-3">
                    <CardTitle>Consistency Rate</CardTitle>
                    <CardDescription className="max-w-lg text-balance leading-relaxed">
                        Days logged compared to total days in your journey
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-baseline gap-2">
                        <div className="text-5xl font-bold tracking-tight">{metrics.consistencyRate}%</div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                    <CardDescription>Average Duration</CardDescription>
                    <CardTitle className="text-4xl">{metrics.avgDuration} min</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-xs text-muted-foreground">Per workout session</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                    <CardDescription>Current Streak</CardDescription>
                    <CardTitle className="text-4xl">{metrics.currentStreak}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-xs text-muted-foreground">Consecutive days</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                    <CardDescription>Longest Streak</CardDescription>
                    <CardTitle className="text-3xl">{metrics.longestStreak} days</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-xs text-muted-foreground">Your best performance</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                    <CardDescription>Total Workouts</CardDescription>
                    <CardTitle className="text-4xl">{metrics.totalWorkouts}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-xs text-muted-foreground">Activities logged</div>
                </CardContent>
            </Card>
        </div>
    )
}
