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
  dailyWage?: string;
  serviceWages?: Record<string, { hourly: string; daily: string }>;
  phone: string;
  initial: string;
  avatar?: string;
  skills?: string[];
  matchedSkill?: string;
  experience?: string;
  location?: string;
  about?: string;
  workSamples?: string[];
  completedJobsCount?: number;
  badgeTier?: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
  badgePoints?: number;
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
  hasVoiceNote?: boolean;
  voiceNoteDuration?: string;
  wage: string;
  status: JobStatus;
  requests: WorkerRequest[];
  rating: number | null;
  createdAt: string;
}

export interface DraftJob {
  category: string;
  date: string;
  time: string;
  timeSlot: string;
  location: string;
  locationMode: 'saved' | 'current';
  description: string;
  hasVoiceNote?: boolean;
  voiceNoteDuration?: string;
  wageMin: number;
  wageMax: number;
  workersNeeded?: number;
}
