import type { Job } from '../types';

/**
 * Checks if a job is requested for today (Urgent, 3-min matching lifespan).
 */
export const isJobUrgent = (job: Job): boolean => {
  if (!job.date) return false;
  const todayStr = new Date().toISOString().split('T')[0];
  const jobDateStr = job.date.split('T')[0];
  return jobDateStr === todayStr;
};

/**
 * Returns remaining seconds for urgent job (3 minutes = 180 seconds from createdAt).
 * If createdAt is invalid or older than 3 minutes, returns 0 (expired).
 */
export const getUrgentJobTimeRemaining = (job: Job): { remainingSeconds: number; isExpired: boolean; formatted: string } => {
  if (!isJobUrgent(job)) {
    return { remainingSeconds: 0, isExpired: false, formatted: '' };
  }

  const createdTime = job.createdAt ? new Date(job.createdAt).getTime() : Date.now();
  const now = Date.now();
  const elapsedSec = Math.max(0, Math.floor((now - createdTime) / 1000));
  const totalLifespanSec = 180; // 3 minutes

  const remaining = Math.max(0, totalLifespanSec - elapsedSec);
  const isExpired = remaining <= 0;

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return { remainingSeconds: remaining, isExpired, formatted };
};

/**
 * Checks if a job has expired or passed its scheduled date:
 * - A job scheduled for a past date (date < todayStr) has passed its day end.
 * - Completed, cancelled, or unfilled jobs are also considered past.
 */
export const isScheduledJobExpired = (job: Job): boolean => {
  if (job.status === 'completed' || job.status === 'cancelled' || job.status === 'unfilled') {
    return true;
  }
  const todayStr = new Date().toISOString().split('T')[0];
  const jobDateStr = (job.date || '').split('T')[0];
  // If the scheduled date is earlier than today, it has expired (day has ended)
  return jobDateStr < todayStr;
};


