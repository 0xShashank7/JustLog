import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { useState } from "react";
import type { WorkoutLog } from "@/interfaces/types";


interface AddWorkoutProps {
    logs: WorkoutLog[];
    setLogs: (logs: WorkoutLog[]) => void;
    showAddForm: boolean;
    setShowAddForm: (show: boolean) => void;
}

export default function AddWorkout({ logs, setLogs, showAddForm, setShowAddForm }: AddWorkoutProps) {

    const [newLog, setNewLog] = useState<Omit<WorkoutLog, 'id'>>({
        day: 0,
        date: '',
        type: 'run',
        duration: 0,
        notes: ''
    });

    const addLog = () => {
        if (!newLog.day || !newLog.date || !newLog.duration) return;

        const log: WorkoutLog = {
            id: Date.now(),
            day: newLog.day,
            date: newLog.date,
            type: newLog.type,
            duration: newLog.duration,
            notes: newLog.notes
        };

        setLogs([...logs, log]);
        setNewLog({ day: 0, date: '', type: 'run', duration: 0, notes: '' });
        setShowAddForm(false);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>New Workout</CardTitle>
                <CardDescription>Add a new workout to your log</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Day Number
                        </label>
                        <input
                            type="number"
                            placeholder="21"
                            value={newLog.day || ''}
                            onChange={(e) => setNewLog({ ...newLog, day: parseInt(e.target.value) || 0 })}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Date
                        </label>
                        <input
                            type="date"
                            value={newLog.date}
                            onChange={(e) => setNewLog({ ...newLog, date: e.target.value })}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Activity Type
                        </label>
                        <select
                            value={newLog.type}
                            onChange={(e) => setNewLog({ ...newLog, type: e.target.value as 'run' | 'calisthenics' })}
                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="run">Run</option>
                            <option value="calisthenics">Calisthenics</option>
                        </select>
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Duration (minutes)
                        </label>
                        <input
                            type="number"
                            placeholder="25"
                            value={newLog.duration || ''}
                            onChange={(e) => setNewLog({ ...newLog, duration: parseInt(e.target.value) || 0 })}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Notes
                        </label>
                        <input
                            type="text"
                            placeholder="25 minutes run non-stop"
                            value={newLog.notes}
                            onChange={(e) => setNewLog({ ...newLog, notes: e.target.value })}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                    <button
                        onClick={addLog}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    >
                        Save Workout
                    </button>
                </div>
            </CardContent>
        </Card>
    )
}
