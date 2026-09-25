export interface UserProfile {
  name: string;
  phone: string;
  location: string;
  isLoggedIn: boolean;
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  desc: string;
}

export interface Worker {
  id: number;
  name: string;
  category: string;
  rating: number;
  reviewsCount?: number;
  distance: number; // in km
  wage: string;
  phone: string;
  initial: string;
  avatar?: string;
  skills?: string[];
  matchedSkill?: string;
}

export type WorkerRequestStatus = 'pending' | 'accepted' | 'inactive' | 'cancelled' | 'rejected';

export interface WorkerRequest {
  workerId: number;
  status: WorkerRequestStatus;
}

export type JobStatus = 'looking' | 'matched' | 'completed' | 'cancelled' | 'unfilled';

export interface Job {
  id: number;
  category: string;
  date: string;
  time: string;
  location: string;
  description: string;
  wage: string;
  status: JobStatus;
  requests: WorkerRequest[];
  rating: number | null;
  createdAt: string;
}

export type AppScreen = 
  | 'splash'
  | 'auth-phone'
  | 'auth-otp'
  | 'auth-profile'
  | 'home'
  | 'create-job'
  | 'workers'
  | 'job-detail'
  | 'jobs'
  | 'favourites'
  | 'profile';
