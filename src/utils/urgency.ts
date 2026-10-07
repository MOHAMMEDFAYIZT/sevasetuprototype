import type { Job } from '../types';

/**
 * Checks if a job was scheduled for "today" on the same day it was created.
 * Today's immediate jobs are considered URGENT (5-minute matching lifespan).
 * Other scheduled jobs (tomorrow or later) have a standard 3-hour match lifespan.
 */
export const isJobUrgent = (job: Job): boolean => {
  if (!job.date) return false;
  
  // Format check: if job.date matches today's YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];
  const jobDateStr = job.date.split('T')[0];
  
  return jobDateStr === todayStr;
};

/**
 * Returns remaining seconds for urgent job (5 minutes = 300 seconds from createdAt).
 * If createdAt is invalid or older than 5 minutes, returns 0 (expired).
 */
export const getUrgentJobTimeRemaining = (job: Job): { remainingSeconds: number; isExpired: boolean; formatted: string } => {
  if (!isJobUrgent(job)) {
    return { remainingSeconds: 0, isExpired: false, formatted: '' };
  }

  const createdTime = job.createdAt ? new Date(job.createdAt).getTime() : Date.now();
  const now = Date.now();
  const elapsedSec = Math.max(0, Math.floor((now - createdTime) / 1000));
  const totalLifespanSec = 300; // 5 minutes

  const remaining = Math.max(0, totalLifespanSec - elapsedSec);
  const isExpired = remaining <= 0;

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return { remainingSeconds: remaining, isExpired, formatted };
};

