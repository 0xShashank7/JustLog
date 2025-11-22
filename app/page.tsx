"use client"

import React, { useEffect, useState } from 'react';
import { Loader2, Plus, X } from 'lucide-react';
import { redirect } from 'next/navigation'


import type { WorkoutLog, Metrics, ChartData, DurationData, ActivityData, CustomTooltipProps, } from '@/interfaces/types';

import AddWorkout from '../components/actions/AddWorkout';
import MetricsComponent from '../components/actions/Metrics';
import RecentWorkouts from '@/components/actions/RecentWorkouts';
import DurationTrends from '@/components/actions/DurationTrends';
import ActivityMetrics from '@/components/actions/ActivityMetrics';

import { createClient } from '@/lib/supabase/client';
import { ChartBarStacked } from '@/components/actions/BarChart';
import { useAccount } from 'wagmi';
import { toast } from 'sonner';
import { CardTitle } from '@/components/ui/card';


export default function FitnessDashboard() {

  const supabase = createClient();
  const [workouts, setWorkouts] = useState<WorkoutLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkouts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('workouts').select('*');
    debugger;
    if (error) {
      console.error('Error fetching workouts:', error);
    } else {
      console.log('workouts data ', data)
      setWorkouts(data);
    }
    setLoading(false);
  };


  useEffect(() => {
    fetchWorkouts();
  }, [])

  const [showAddForm, setShowAddForm] = useState(false);


  const calculateMetrics = (): Metrics | null => {

    if (workouts.length === 0) {

      toast.warning('Please add data')
      return null
    };

    const sortedLogs = [...workouts].sort((a, b) => a.day - b.day);

    const loggedDays = workouts.length;

    const todayDate = new Date().toISOString().slice(0, 10); // current date
    const firstLoggedDate = sortedLogs[0].date;
    const dateDifference = Math.round((new Date(todayDate).getTime() - new Date(firstLoggedDate).getTime()) / (1000 * 60 * 60 * 24)); // difference in days
    const loggedDaysTillToday = dateDifference + 1;

    const consistencyRate = ((loggedDays / loggedDaysTillToday) * 100).toFixed(1);


    const avgDuration = (workouts.reduce((sum, log) => sum + log.duration, 0) / workouts.length).toFixed(1);

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;

    for (let i = 1; i < sortedLogs.length; i++) {
      if (sortedLogs[i].day - sortedLogs[i - 1].day === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    const today = sortedLogs[sortedLogs.length - 1].day;
    for (let i = sortedLogs.length - 1; i >= 0; i--) {
      if (today - sortedLogs[i].day === sortedLogs.length - 1 - i) {
        currentStreak++;
      } else {
        break;
      }
    }

    const distribution = workouts.reduce((acc, log) => {
      acc[log.workout_type] = (acc[log.workout_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      consistencyRate,
      avgDuration,
      currentStreak,
      longestStreak,
      totalWorkouts: loggedDays,
      distribution
    };
  };

  const prepareWeeklyData = (): ChartData[] => {
    const weeks: Record<number, number> = {};
    workouts.forEach(log => {
      const week = Math.floor(log.day / 7);
      weeks[week] = (weeks[week] || 0) + 1;
    });

    return Object.entries(weeks).map(([week, count]) => ({
      week: `Week ${parseInt(week) + 1}`,
      workouts: count
    }));
  };

  const prepareMonthlyData = (): ChartData[] => {
    const months: Record<number, number> = {};
    workouts.forEach(log => {
      const month = Math.floor(log.day / 30);
      months[month] = (months[month] || 0) + 1;
    });
    debugger;

    return Object.entries(months).map(([month, count]) => ({
      month: `Month ${parseInt(month) + 1}`,
      workouts: count
    }));
  };

  const prepareDurationData = (): DurationData[] => {
    return [...workouts]
      .sort((a, b) => a.day - b.day)
      .map(log => ({
        day: `Day ${log.day}`,
        duration: log.duration,
        workout_type: log.workout_type
      }));
  };

  const prepareActivityDistribution = (): ActivityData[] => {
    const distribution = workouts.reduce((acc, log) => {
      acc[log.workout_type] = (acc[log.workout_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(distribution).map(([type, count]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: count
    }));
  };

  const metrics = calculateMetrics();
  const weeklyData = prepareWeeklyData();
  const durationData = prepareDurationData();
  const activityData = prepareActivityDistribution();
  const monthsChartData = prepareMonthlyData()
  console.log(monthsChartData)

  const [editingId, setEditingId] = useState<number | null>(null);

  const deleteLog = async (id: number) => {
    setWorkouts(workouts.filter(log => log.id !== id));
    const toastId = toast.loading('Deleting workout...');
    try {
      const { data, error } = await supabase.from('workouts').delete().eq('id', id);
      if (error) {
        console.error('Error deleting workout:', error);
        toast.error('Error deleting workout!', { id: toastId });
      } else {
        toast.success('Workout deleted successfully!', { id: toastId });
      }
    }
    catch (error) {
      console.error('Error deleting workout:', error);
      toast.error('Error deleting workout!', { id: toastId });
    }

  };

  const updateLog = async (id: number, updates: Partial<WorkoutLog>) => {

    setWorkouts(workouts.map(log => log.id === id ? { ...log, ...updates } : log));

    const toastId = toast.loading('Updating workout...');
    try {
      const { data, error } = await supabase.from('workouts').update(updates).eq('id', id);
      if (error) {
        console.error('Error updating workout:', error);
        toast.error('Error updating workout!', { id: toastId });
      } else {
        toast.success('Workout updated successfully!', { id: toastId });
      }
    }
    catch (error) {
      console.error('Error updating workout:', error);
      toast.error('Error updating workout!', { id: toastId });
    }

    setEditingId(null);


  };

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

  function ConnectButton() {
    return <appkit-button />
  }

  const { isConnected } = useAccount()

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        {/* <Navigation /> */}

        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="mx-auto grid max-w-236 flex-1 auto-rows-max gap-4">
            <div className="flex items-center gap-4">
              <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-bold tracking-tight sm:grow-0">
                Just log
              </h1>
              <div className="hidden items-center gap-2 md:ml-auto md:flex">
                {/* Add Workout Button */}

                {
                  isConnected ?
                    <h2 className='mr-2' >Hello, User {isConnected}</h2> :
                    <ConnectButton />
                }

                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 transition-all duration-200 ease-in-out"
                >
                  {showAddForm ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap transition-all duration-200 ease-in-out">
                    {showAddForm ? 'Cancel' : 'Add Workout'}
                  </span>
                </button>
              </div>
            </div>

            {
              workouts.length === 0 &&
              <CardTitle>Please add run logs to see metrics</CardTitle>
            }

            {loading && (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            )}

            {/* Add Workout */}
            {showAddForm && !loading && (
              <>
                <AddWorkout
                  logs={workouts}
                  setLogs={setWorkouts}
                  showAddForm={showAddForm}
                  setShowAddForm={setShowAddForm}
                />

              </>
            )}

            {/* Metrics Header */}
            {metrics && !loading && (
              <MetricsComponent metrics={metrics} />
            )}

            {/* Activity Metrics */}
            {!loading && <ActivityMetrics weeklyData={weeklyData} activityData={activityData} />}

            {/* Duration Trends */}
            {!loading && <DurationTrends durationData={durationData} />}

            {!loading && <ChartBarStacked />}

            {/* Recent Workouts */}
            {!loading && <RecentWorkouts logs={workouts} editingId={editingId} setEditingId={setEditingId} updateLog={updateLog} deleteLog={deleteLog} />}
          </div>
        </main>
      </div>
    </div>
  );
}