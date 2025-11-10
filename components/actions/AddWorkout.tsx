"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { WorkoutLog } from "@/interfaces/types";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Calendar } from "../ui/calendar"
import { Button } from "../ui/button"
import { ChevronDownIcon } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from "../ui/input-group";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface AddWorkoutProps {
    logs: WorkoutLog[];
    setLogs: (logs: WorkoutLog[]) => void;
    showAddForm: boolean;
    setShowAddForm: (show: boolean) => void;
}

export default function AddWorkout({ logs, setLogs, showAddForm, setShowAddForm }: AddWorkoutProps) {

    const supabase = createClient();

    const [newLog, setNewLog] = useState<Omit<WorkoutLog, 'id'>>({
        day: logs.length > 0 ? Math.max(...logs.map(log => log.day)) + 1 : 1,
        date: '',
        workout_type: 'run',
        duration: 0,
        notes: ''
    });

    const addLog = async () => {
        debugger;
        if (!newLog.day || !newLog.date || !newLog.duration || !newLog.workout_type) {
            toast.error('Please fill in all fields');
            return;
        };

        const toastId = toast.loading('Adding workout...');
        try {
            const { data, error } = await supabase.from('workouts').insert({
                day: newLog.day,
                date: newLog.date,
                workout_type: newLog.workout_type,
                duration: newLog.duration,
                notes: newLog.notes
            })

            if (error) {
                console.error('Error adding workout:', error);
            } else {
                const log: WorkoutLog = {
                    id: Date.now(),
                    day: newLog.day,
                    date: newLog.date,
                    workout_type: newLog.workout_type,
                    duration: newLog.duration,
                    notes: newLog.notes
                };

                toast.success('Workout added successfully!', { id: toastId });
                setLogs([...logs, log]);
                setNewLog({ day: 0, date: '', workout_type: 'run', duration: 0, notes: '' });
                setShowAddForm(false);
                console.log('Workout added successfully:', data);
            }
        } catch (error) {
            console.error('Error adding workout:', error);
            toast.error('Error adding workout!', { id: toastId });
        }

    };

    const [open, setOpen] = useState(false)
    const [date, setDate] = useState<Date | undefined>(undefined)

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 40,
                    duration: 0.3
                }}
            >
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
                                    value={newLog.day || ''}
                                    onChange={(e) => setNewLog({ ...newLog, day: parseInt(e.target.value) || 0 })}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    min="1"
                                />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Date
                                </label>

                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            id="date"
                                            className="w-48 justify-between font-normal"
                                        >
                                            {date ? date.toLocaleDateString() : "Select date"}
                                            <ChevronDownIcon />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            captionLayout="dropdown"
                                            onSelect={(selectedDate) => {
                                                if (selectedDate) {
                                                    const formattedDate = selectedDate.toISOString().split('T')[0];
                                                    setDate(selectedDate);
                                                    setNewLog({ ...newLog, date: formattedDate });
                                                    setOpen(false);
                                                }
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>

                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Activity Type
                                </label>

                                <Select>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Activity Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="run" onSelect={(e) => setNewLog({ ...newLog, workout_type: 'run' })}>Run</SelectItem>
                                        <SelectItem value="walk" onSelect={(e) => setNewLog({ ...newLog, workout_type: 'walk' })}>Walk</SelectItem>
                                    </SelectContent>
                                </Select>

                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Duration <span className="text-muted-foreground text-xs">(minutes)</span>
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
                                    Notes <span className="text-muted-foreground text-xs">(Optional)</span>
                                </label>

                                <InputGroup>
                                    <InputGroupTextarea placeholder="Enter your notes" value={newLog.notes} onChange={(e) => setNewLog({ ...newLog, notes: e.target.value })} />
                                    <InputGroupAddon align="block-end">
                                        <InputGroupText className="text-muted-foreground text-xs">
                                            {newLog.notes.length}/120 characters
                                        </InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>
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
            </motion.div>
        </AnimatePresence>
    )
}
