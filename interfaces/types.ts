export interface FitnessLog {
    id: string;  // or number, depending on what type your IDs are
    day: string;
    date: string;
    workout_type: string;  // you might want to make this more specific with a union type
    duration: string;
    notes: string;
}


export interface WorkoutLog {
    id: string;
    day: string;
    date: string;
    workout_type: string;
    duration: number;
    notes: string | null;
    kilometers: number;
}

export interface Metrics {
    consistencyRate: string;
    avgDuration: string;
    currentStreak: number;
    longestStreak: number;
    totalWorkouts: number;
    distribution: Record<string, number>;
}

export interface ChartData {
    week?: string;
    month?: string;
    workouts?: number;
}

export interface DurationData {
    day: string;
    duration: number;
    workout_type: string;
    date?: string;

}

export interface ActivityData {
    name: string;
    value: number;
    [key: string]: any; // Add index signature for Recharts compatibility
}

export interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
        name: string;
        value: number;
        color: string;
    }>;
    label?: string;
}