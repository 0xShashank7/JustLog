import React, { useState } from 'react'
import { CardHeader, Card, CardTitle, CardDescription, CardContent } from '../ui/card';
import { WorkoutLog } from '@/interfaces/types';
import { Edit2, Save, Trash2 } from 'lucide-react';

interface RecentWorkoutsProps {
    logs: WorkoutLog[];
    editingId: number | null;
    setEditingId: (id: number) => void;
    deleteLog: (id: number) => void;
    updateLog: (id: number, updates: Partial<WorkoutLog>) => void;
}

export default function RecentWorkouts({ logs, editingId, setEditingId, deleteLog, updateLog }: RecentWorkoutsProps) {


    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Workouts</CardTitle>
                <CardDescription>Your latest activity log</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {[...logs].sort((a, b) => b.day - a.day).slice(0, 10).map(log => (
                        <div key={log.id} className="flex items-center justify-between rounded-lg border p-3">
                            {editingId === log.id ? (
                                <div className="flex-1 space-y-2">
                                    <div className="grid gap-2 sm:grid-cols-2">
                                        <input
                                            type="number"
                                            defaultValue={log.day}
                                            onChange={(e) => {
                                                const updatedLog = logs.find(l => l.id === log.id);
                                                if (updatedLog) updatedLog.day = parseInt(e.target.value);
                                            }}
                                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                                        />
                                        <input
                                            type="date"
                                            defaultValue={log.date}
                                            onChange={(e) => {
                                                const updatedLog = logs.find(l => l.id === log.id);
                                                if (updatedLog) updatedLog.date = e.target.value;
                                            }}
                                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                                        />
                                    </div>
                                    <div className="grid gap-2 sm:grid-cols-3">
                                        <select
                                            defaultValue={log.type}
                                            onChange={(e) => {
                                                const updatedLog = logs.find(l => l.id === log.id);
                                                if (updatedLog) updatedLog.type = e.target.value as 'run' | 'calisthenics';
                                            }}
                                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                                        >
                                            <option value="run">Run</option>
                                            <option value="calisthenics">Calisthenics</option>
                                        </select>
                                        <input
                                            type="number"
                                            defaultValue={log.duration}
                                            onChange={(e) => {
                                                const updatedLog = logs.find(l => l.id === log.id);
                                                if (updatedLog) updatedLog.duration = parseInt(e.target.value);
                                            }}
                                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                                        />
                                        <input
                                            type="text"
                                            defaultValue={log.notes}
                                            onChange={(e) => {
                                                const updatedLog = logs.find(l => l.id === log.id);
                                                if (updatedLog) updatedLog.notes = e.target.value;
                                            }}
                                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm sm:col-span-1"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="font-semibold">Day {log.day}</span>
                                        <span className="text-muted-foreground">{log.date}</span>
                                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${log.type === 'run'
                                            ? 'bg-blue-50 text-blue-700 ring-blue-700/10 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/30'
                                            : 'bg-green-50 text-green-700 ring-green-700/10 dark:bg-green-400/10 dark:text-green-400 dark:ring-green-400/30'
                                            }`}>
                                            {log.type}
                                        </span>
                                        <span className="font-medium">{log.duration}m</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{log.notes}</p>
                                </div>
                            )}
                            <div className="flex gap-1">
                                {editingId === log.id ? (
                                    <button
                                        onClick={() => updateLog(log.id, log)}
                                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9"
                                    >
                                        <Save className="h-4 w-4" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setEditingId(log.id)}
                                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </button>
                                )}
                                <button
                                    onClick={() => deleteLog(log.id)}
                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9 text-destructive"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
