'use client';

import React, { useEffect, useState } from 'react';
import { getWorkouts, createWorkout } from '@/server/users';
import { getFirstUserId } from '@/server/users';

// Test data array
const testWorkouts = [
    {
        id: 'test-1',
        userId: 'test-user-1', // Make sure this matches an existing user ID in your database
        date: '2025-12-15', // YYYY-MM-DD format
        day: 'Monday',
        workout_type: 'Running',
        duration: 30, // in minutes
        kilometers: 5, // in km
        notes: 'Morning run in the park'
    },
    {
        id: 'test-2',
        userId: 'test-user-1',
        date: '2025-12-16',
        day: 'Tuesday',
        workout_type: 'Cycling',
        duration: 45,
        kilometers: 15,
        notes: 'Evening bike ride'
    },
    {
        id: 'test-3',
        userId: 'test-user-1',
        date: '2025-12-17',
        day: 'Wednesday',
        workout_type: 'Swimming',
        duration: 60,
        kilometers: 2, // km swum
        notes: 'Pool session - freestyle'
    }
];

export default function Workouts() {
    const [workouts, setWorkouts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    const addTestWorkouts = async () => {
        try {
            setIsAdding(true);
            // Get a valid user ID first
            const userId = await getFirstUserId();
            debugger;
            if (!userId) {
                console.error('No users found in the database');
                return;
            }

            // Update test workouts with the valid user ID
            const workoutsToAdd = testWorkouts.map(workout => ({
                ...workout,
                userId: userId
            }));

            // Add all workouts
            for (const workout of workoutsToAdd) {
                await createWorkout(workout);
            }

            const updatedWorkouts = await getWorkouts();
            setWorkouts(updatedWorkouts || []);
        } catch (error) {
            console.error('Error adding test workouts:', error);
        } finally {
            setIsAdding(false);
        }
    };

    const loadWorkouts = async () => {
        try {
            const data = await getWorkouts();
            setWorkouts(data || []);
        } catch (error) {
            console.error('Error fetching workouts:', error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadWorkouts();
    }, []);
    if (loading) {
        return <div>Loading workouts...</div>;
    }
    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Your Workouts</h1>
                <button
                    onClick={addTestWorkouts}
                    disabled={isAdding}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
                >
                    {isAdding ? 'Adding Test Data...' : 'Add Test Workouts'}                </button>
            </div>
            {/* Rest of your component remains the same */}
            <div className="space-y-4">
                {workouts.map((workout) => (
                    <div key={workout.id} className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-lg font-semibold">{workout.workout_type}</h2>
                                <p className="text-sm text-gray-600">{workout.day}, {workout.date}</p>
                                {workout.notes && <p className="mt-2 text-gray-700">{workout.notes}</p>}
                            </div>
                            <div className="text-right">
                                <p className="font-medium">{workout.duration} min</p>
                                <p className="text-sm text-gray-500">{workout.kilometers} km</p>
                            </div>
                        </div>
                    </div>
                ))}
                {workouts.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No workouts found. Add your first workout!
                    </div>
                )}
            </div>
        </div>
    );
}