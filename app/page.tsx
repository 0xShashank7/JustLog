"use client"

import React, { useEffect, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { redirect } from 'next/navigation'


import type { WorkoutLog, Metrics, ChartData, DurationData, ActivityData, CustomTooltipProps, } from '@/interfaces/types';

import AddWorkout from '../components/actions/AddWorkout';
import MetricsComponent from '../components/actions/Metrics';
import RecentWorkouts from '@/components/actions/RecentWorkouts';
import DurationTrends from '@/components/actions/DurationTrends';
import ActivityMetrics from '@/components/actions/ActivityMetrics';

import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { ChartBarStacked } from '@/components/ui/BarChart';
import { useAccount } from 'wagmi';
import Navigation from '@/components/actions/Navigation';


export default function FitnessDashboard() {
  const [logs, setLogs] = useState<WorkoutLog[]>([
    { id: 1, day: 21, date: '2024-10-10', type: 'run', duration: 25, notes: '25 minutes run non-stop' },
    { id: 2, day: 22, date: '2024-10-11', type: 'calisthenics', duration: 30, notes: 'Push-ups and planks' },
    { id: 3, day: 23, date: '2024-10-12', type: 'run', duration: 20, notes: 'Easy recovery run' },
    { id: 4, day: 25, date: '2024-10-14', type: 'calisthenics', duration: 35, notes: 'Full body workout' },
    { id: 5, day: 27, date: '2024-10-16', type: 'run', duration: 28, notes: 'Interval training' },
    { id: 6, day: 28, date: '2024-10-17', type: 'run', duration: 22, notes: 'Morning jog' },
    { id: 7, day: 30, date: '2024-10-19', type: 'calisthenics', duration: 40, notes: 'Pull-ups and dips' },
    { id: 8, day: 34, date: '2024-10-23', type: 'run', duration: 24, notes: 'Elevated run' },
    { id: 9, day: 35, date: '2024-10-24', type: 'run', duration: 30, notes: 'Distance run' },
    { id: 10, day: 37, date: '2024-10-26', type: 'calisthenics', duration: 45, notes: 'Core focus' },
  ]);

  const [workouts, setWorkouts] = useState<WorkoutLog[]>([]);
  const supabase = createClient();

  useEffect(() => {
    debugger;
    const fetchWorkouts = async () => {
      const { data, error } = await supabase.from('workouts').select('*');
      if (error) {
        console.error('Error fetching workouts:', error);
      } else {
        console.log('workouts data ', data)
        setWorkouts(data);
      }
    };
    fetchWorkouts();
  }, [])

  const [showAddForm, setShowAddForm] = useState(false);


  const calculateMetrics = (): Metrics | null => {
    if (logs.length === 0) return null;

    const sortedLogs = [...logs].sort((a, b) => a.day - b.day);
    const totalDays = sortedLogs[sortedLogs.length - 1].day - sortedLogs[0].day + 1;
    const loggedDays = logs.length;
    const consistencyRate = ((loggedDays / totalDays) * 100).toFixed(1);

    const avgDuration = (logs.reduce((sum, log) => sum + log.duration, 0) / logs.length).toFixed(1);

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

    const distribution = logs.reduce((acc, log) => {
      acc[log.type] = (acc[log.type] || 0) + 1;
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
    logs.forEach(log => {
      const week = Math.floor(log.day / 7);
      weeks[week] = (weeks[week] || 0) + 1;
    });

    return Object.entries(weeks).map(([week, count]) => ({
      week: `Week ${parseInt(week) + 1}`,
      workouts: count
    }));
  };

  const prepareDurationData = (): DurationData[] => {
    return [...logs]
      .sort((a, b) => a.day - b.day)
      .map(log => ({
        day: `Day ${log.day}`,
        duration: log.duration,
        type: log.type
      }));
  };

  const prepareActivityDistribution = (): ActivityData[] => {
    const distribution = logs.reduce((acc, log) => {
      acc[log.type] = (acc[log.type] || 0) + 1;
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

  const [editingId, setEditingId] = useState<number | null>(null);

  const deleteLog = (id: number) => {
    setLogs(logs.filter(log => log.id !== id));
  };

  const updateLog = (id: number, updates: Partial<WorkoutLog>) => {
    setLogs(logs.map(log => log.id === id ? { ...log, ...updates } : log));
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
              <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                Just Log
              </h1>
              <div className="hidden items-center gap-2 md:ml-auto md:flex">
                {/* Add Workout Button */}

                <ConnectButton />

                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                  {showAddForm ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    {showAddForm ? 'Cancel' : 'Add Workout'}
                  </span>
                </button>
              </div>
            </div>

            {/* Add Workout */}
            {showAddForm && (
              <>
                <AddWorkout
                  logs={logs}
                  setLogs={setLogs}
                  showAddForm={showAddForm}
                  setShowAddForm={setShowAddForm}
                />

              </>
            )}

            <ChartBarStacked />


            {/* Metrics Header */}
            {metrics && (
              <MetricsComponent metrics={metrics} />
            )}

            {/* Activity Metrics */}
            <ActivityMetrics weeklyData={weeklyData} activityData={activityData} />

            {/* Duration Trends */}
            <DurationTrends durationData={durationData} />

            {/* Recent Workouts */}
            <RecentWorkouts logs={logs} editingId={editingId} setEditingId={setEditingId} updateLog={updateLog} deleteLog={deleteLog} />
          </div>
        </main>
      </div>
    </div>
  );
}