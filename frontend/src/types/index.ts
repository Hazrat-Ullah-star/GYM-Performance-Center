// Shared TypeScript types for the frontend app

export type UserRole = 'member' | 'trainer' | 'admin' | 'receptionist';

export interface User {
  id: number
  email: string
  username: string
  display_name: string
  avatar?: string | null
  role?: UserRole
  is_email_verified?: boolean
  joined_at?: string
  is_staff?: boolean
  is_trainer?: boolean
}

export interface AuthTokens {
  access: string
  refresh: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  username: string
  password: string
  password_confirm: string
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

// -------------------------------------------------------------------------
// Community — Social types
// -------------------------------------------------------------------------

export interface Tag {
  id: number
  name: string
  slug: string
  post_count: number
}

export interface UserProfile extends User {
  bio?: string
  followers_count: number
  following_count: number
  posts_count: number
  is_following: boolean
  role: UserRole;
  is_email_verified?: boolean;
  joined_at: string;
}

export interface Reply {
  id: number
  author: UserProfile
  content: string
  likes_count: number
  is_liked: boolean
  created_at: string
}

export interface Comment {
  id: number
  author: UserProfile
  content: string
  parent?: number | null
  likes_count: number
  is_liked: boolean
  replies: Reply[]
  created_at: string
  updated_at: string
}

export interface Post {
  id: number
  title?: string
  content: string
  image?: string | null
  author: UserProfile
  tags: Tag[]
  likes_count: number
  comments_count: number
  shares_count: number
  bookmarks_count: number
  is_liked: boolean
  is_bookmarked: boolean
  created_at: string
  updated_at: string
}

export interface Notification {
  id: number
  type: 'like' | 'comment' | 'reply' | 'follow' | 'mention' | 'bookmark' | 'share' | 'system'
  message: string
  is_read: boolean
  created_at: string
  related_post?: number | null
  related_user?: UserProfile | null
}

// Gym domain
export interface Trainer {
  id: number
  user: User
  specialties?: string
  years_experience: number
  total_clients: number
  hourly_rate: number | string
  bio?: string | null
  certifications?: string | null
  rating: string | number
}

export interface GymClass {
  id: number
  name: string
  class_type: string
  difficulty: 'beginner' | 'intermediate' | 'advanced' | string
  duration_minutes: number
  trainer?: Trainer | null
}

export interface ClassSchedule {
  id: number
  gym_class: GymClass
  day_name: string
  start_time: string // e.g., "06:00"
  end_time: string
  available_spots: number
  room?: string | null
}

export interface Booking {
  id: number
  class_name: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | string
  booking_date: string
}

export interface Membership {
  id: number
  plan_type: 'vip' | 'premium' | 'standard' | string
  plan_name: string
  monthly_fee: string | number
  status: 'active' | 'inactive' | string
  start_date: string
  end_date: string
  auto_renew: boolean
}

export interface WorkoutLog {
  id: number
  exercise_name: string
  sets?: number
  reps?: number
  weight_kg?: number
  duration?: number
  calories_burned?: number
  workout_date: string
}
