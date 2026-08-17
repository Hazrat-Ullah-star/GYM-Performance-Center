import { apiClient } from './apiClient';
import type {
  Trainer,
  GymClass,
  ClassSchedule,
  Booking,
  Membership,
  WorkoutLog,
  PaginatedResponse,
} from '../types';

// Trainers
export const getTrainers = async (): Promise<Trainer[]> => {
  const response = await apiClient.get<PaginatedResponse<Trainer> | Trainer[]>('/gym/trainers/');
  const data = response.data as PaginatedResponse<Trainer> | Trainer[];
  return Array.isArray(data) ? data : data.results;
};

export const getTrainer = async (id: number): Promise<Trainer> => {
  const response = await apiClient.get<Trainer>(`/gym/trainers/${id}/`);
  return response.data;
};

// Classes
export const getClasses = async (): Promise<GymClass[]> => {
  const response = await apiClient.get<PaginatedResponse<GymClass> | GymClass[]>('/gym/classes/');
  const data = response.data as PaginatedResponse<GymClass> | GymClass[];
  return Array.isArray(data) ? data : data.results;
};

export const getClass = async (id: number): Promise<GymClass> => {
  const response = await apiClient.get<GymClass>(`/gym/classes/${id}/`);
  return response.data;
};

// Schedules
export const getSchedules = async (): Promise<ClassSchedule[]> => {
  const response = await apiClient.get<PaginatedResponse<ClassSchedule> | ClassSchedule[]>('/gym/schedules/');
  const data = response.data as PaginatedResponse<ClassSchedule> | ClassSchedule[];
  return Array.isArray(data) ? data : data.results;
};

export const getWeekSchedule = async (): Promise<Record<string, ClassSchedule[]>> => {
  const response = await apiClient.get<Record<string, ClassSchedule[]>>('/gym/schedules/week_schedule/');
  return response.data;
};

// Bookings
export const getBookings = async (): Promise<Booking[]> => {
  const response = await apiClient.get<Booking[]>('/gym/bookings/');
  return response.data;
};

export const getUpcomingBookings = async (): Promise<Booking[]> => {
  const response = await apiClient.get<Booking[]>('/gym/bookings/upcoming/');
  return response.data;
};

export const createBooking = async (data: {
  class_schedule_id: number;
  booking_date: string;
  notes?: string;
}): Promise<Booking> => {
  const response = await apiClient.post<Booking>('/gym/bookings/', data);
  return response.data;
};

export const cancelBooking = async (id: number): Promise<Booking> => {
  const response = await apiClient.post<Booking>(`/gym/bookings/${id}/cancel/`);
  return response.data;
};

// Membership
export const getMyMembership = async (): Promise<Membership> => {
  const response = await apiClient.get<Membership>('/gym/memberships/my_membership/');
  return response.data;
};

// Workout Logs
export const getWorkoutLogs = async (): Promise<WorkoutLog[]> => {
  const response = await apiClient.get<WorkoutLog[]>('/gym/workout-logs/');
  return response.data;
};

export const getRecentWorkouts = async (): Promise<WorkoutLog[]> => {
  const response = await apiClient.get<WorkoutLog[]>('/gym/workout-logs/recent/');
  return response.data;
};

export const getWorkoutStats = async (): Promise<{
  total_workouts: number;
  total_calories: number;
  avg_duration: number;
  total_sets: number;
  total_reps: number;
}> => {
  const response = await apiClient.get<{
    total_workouts: number;
    total_calories: number;
    avg_duration: number;
    total_sets: number;
    total_reps: number;
  }>('/gym/workout-logs/stats/');
  return response.data;
};

export const createWorkoutLog = async (data: {
  exercise_name: string;
  sets?: number;
  reps?: number;
  weight?: number;
  duration?: number;
  calories_burned?: number;
  notes?: string;
}): Promise<WorkoutLog> => {
  const response = await apiClient.post<WorkoutLog>('/gym/workout-logs/', {
    ...data,
    workout_date: new Date().toISOString().split('T')[0]
  });
  return response.data;
};

export const deleteWorkoutLog = async (id: number): Promise<void> => {
  await apiClient.delete(`/gym/workout-logs/${id}/`);
};

// Export as object for convenience
export const gymApi = {
  getTrainers,
  getTrainer,
  getClasses,
  getClass,
  getSchedules,
  getWeekSchedule,
  getBookings,
  getUpcomingBookings,
  createBooking,
  cancelBooking,
  getMyMembership,
  getWorkoutLogs,
  getRecentWorkouts,
  getWorkoutStats,
  createWorkoutLog,
  deleteWorkoutLog
};

