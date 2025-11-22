import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

import type { Metrics } from "@/interfaces/types";
import { AnimatePresence, motion } from "framer-motion";

export default function MetricsComponent({ metrics }: { metrics: Metrics }) {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{
                    type: "tween",
                    stiffness: 400,
                    damping: 40,
                    duration: 0.3
                }}
            >
                <div className="grid gap-4 md:grid-cols-2">
                    <Card className="sm:col-span-2">
                        <CardHeader className="pb-3">
                            <CardTitle>Consistency Rate</CardTitle>
                            <CardDescription className="max-w-lg text-balance leading-relaxed">
                                Rate of days logged from the start of the journey till today
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
                            <CardDescription>Total Runs</CardDescription>
                            <CardTitle className="text-4xl">{metrics.totalWorkouts}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xs text-muted-foreground">Runs logged so far</div>
                        </CardContent>
                    </Card>

                </div>
            </motion.div>
        </AnimatePresence>
    )
}
