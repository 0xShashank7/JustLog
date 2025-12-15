'use server'

import { auth } from "@/lib/auth";
import { db } from "@/db/drizzle";
import { workouts } from "@/db/schema";
import { user } from "@/db/schema";
import { eq, InferInsertModel } from "drizzle-orm";

type Workout = InferInsertModel<typeof workouts>;

export const getWorkouts = async () => {
    try {
        const allWorkouts = await db.select().from(workouts);
        return allWorkouts;
    } catch (error) {
        console.log(error);
    }
}

export const getWorkout = async (id: string) => {
    try {
        const workout = await db.select().from(workouts).where(eq(workouts.id, id));
        return workout;
    } catch (error) {
        console.log(error);
    }
}

export const createWorkout = async (workout: Omit<Workout, 'createdAt' | 'updatedAt'>) => {
    try {
        const newWorkout = await db.insert(workouts).values({
            ...workout,
            // Let the database handle these timestamps
            createdAt: undefined,
            updatedAt: undefined
        }).returning();
        return newWorkout[0];
    } catch (error) {
        console.error('Error creating workout:', error);
        throw error; // Re-throw to handle in the component
    }
}

export const updateWorkout = async (id: string, workout: Workout) => {
    try {
        const updatedWorkout = await db.update(workouts).set(workout).where(eq(workouts.id, id));
        return updatedWorkout;
    } catch (error) {
        console.log(error);
    }
}

export const deleteWorkout = async (id: string) => {
    try {
        const deletedWorkout = await db.delete(workouts).where(eq(workouts.id, id));
        return deletedWorkout;
    } catch (error) {
        console.log(error);
    }
}

export const getFirstUserId = async (): Promise<string | null> => {
    try {
        const users = await db.select().from(user);
        return users[0]?.id || null;
    } catch (error) {
        console.error('Error fetching users:', error);
        return null;
    }
};

export const signUp = async () => {

    await auth.api.signUpEmail({
        body: {
            email: "huuuuhuuu@gmail.com",
            password: "jaiBalayya@1",
            name: "bruh",
        }
    })

}