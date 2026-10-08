import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import type { UserProfile, Job, AppScreen, Worker } from '../types';
import { INITIAL_JOBS, WORKERS_DATABASE } from '../data/mockData';
import { TRANSLATIONS, type Language } from '../utils/translations';

interface DraftJob {
  category: string;
  date: string;
  time: string;
  timeSlot: string;
  location: string;
  locationMode: 'saved' | 'current';
  description: string;
  wageMin: number;
  wageMax: number;
  hasVoiceNote?: boolean;
  voiceNoteDuration?: string;
  workersNeeded?: number;
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;
  screen: AppScreen;
  navigateTo: (screen: AppScreen) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  draftJob: DraftJob;
  updateDraftJob: (updates: Partial<DraftJob>) => void;
  selectedWorkerIds: number[];
  setSelectedWorkerIds: (ids: number[]) => void;
  toggleWorkerSelection: (id: number) => void;
  favourites: number[];
  toggleFavourite: (id: number) => void;
  isFavourite: (id: number) => boolean;
  jobs: Job[];
  activeJobsTab: 'active' | 'past';
  setActiveJobsTab: (tab: 'active' | 'past') => void;
  currentJobId: number | null;
  openJobDetails: (jobId: number) => void;
  createJobFromDraft: () => void;
  createJobWithRequests: () => void;
  createJobForWorker: (
    workerId: number, 
    customParams?: { category?: string; date?: string; time?: string; location?: string; description?: string }
  ) => number | null;
  requestWorkerDirectly: (workerId: number) => void;
  isWorkerRequested: (workerId: number) => boolean;
  requestFavouriteDirectly: (workerId: number, tradeCategory?: string) => void;
  requestMoreWorkers: (jobId: number) => void;
  requestWorkerForJob: (jobId: number, workerId: number) => void;
  cancelJob: (jobId: number) => void;
  completeJob: (jobId: number) => void;
  rateJob: (jobId: number, stars: number) => void;
  callWorker: (worker: Worker) => void;
  retryUrgentJob: (jobId: number) => void;
  retryingJobId: number | null;
  setRetryingJobId: (id: number | null) => void;
  
  // Simulator Triggers
  simulateWorkerAcceptance: (jobId: number, targetWorkerId?: number) => void;
  simulateWorkerCancellation: (jobId: number, targetWorkerId?: number) => void;
  simulateNoWorkerAccepts: (jobId: number) => void;
  simulateResetJob: (jobId: number) => void;

  // Modals & Feedback
  toast: string | null;
  showToast: (msg: string) => void;
  hideToast: () => void;
  isCreateJobModalOpen: boolean;
  openCreateJobModal: (cat?: string) => void;
  closeCreateJobModal: () => void;
  isLocationModalOpen: boolean;
  openLocationModal: () => void;
  closeLocationModal: () => void;
  isConfirmModalOpen: boolean;
  openConfirmModal: () => void;
  closeConfirmModal: () => void;
  isCancelModalOpen: boolean;
  cancelTargetJobId: number | null;
  openCancelModal: (jobId: number) => void;
  closeCancelModal: () => void;
  isCompleteConfirmModalOpen: boolean;
  completeTargetJobId: number | null;
  openCompleteConfirmModal: (jobId: number) => void;
  closeCompleteConfirmModal: () => void;
  isRateModalOpen: boolean;
  rateTargetJobId: number | null;
  openRateModal: (jobId: number) => void;
  closeRateModal: () => void;
  profileWorker: Worker | null;
  profileWorkerSource: 'list' | 'favourites';
  openWorkerProfile: (worker: Worker, source?: 'list' | 'favourites') => void;
  closeWorkerProfile: () => void;
  sentJobConfirmation: { jobId: number; workerCount: number; category: string } | null;
  openSentJobConfirmation: (jobId: number, workerCount: number, category: string) => void;
  closeSentJobConfirmation: () => void;
  isKeyboardOpen: boolean;
  openKeyboard: () => void;
  closeKeyboard: () => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('SEVA_SETU_LANG') as Language;
    return (saved === 'hi' || saved === 'en') ? saved : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('SEVA_SETU_LANG', lang);
  };

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['en']?.[key] || key;
  };

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('SEVA_SETU_USER_PROD');
    return saved ? JSON.parse(saved) : {
      name: 'Manoj Kumar',
      phone: '9876543210',
      location: 'Palakkad Town',
      isLoggedIn: false
    };
  });

  const [screen, setScreen] = useState<AppScreen>('splash');
  const [selectedCategory, setSelectedCategory] = useState<string>('Electrician');

  const [draftJob, setDraftJob] = useState<DraftJob>({
    category: 'Electrician',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    timeSlot: 'morning',
    location: user.location,
    locationMode: 'saved',
    description: '',
    wageMin: 350,
    wageMax: 500,
    workersNeeded: 1
  });

  const [selectedWorkerIds, setSelectedWorkerIds] = useState<number[]>([1, 2]);
  const [favourites, setFavourites] = useState<number[]>([1, 10, 20]);
  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem('SEVA_SETU_JOBS_V6');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 5) return parsed;
      } catch {
        // fallback
      }
    }
    return INITIAL_JOBS;
  });

  const [activeJobsTab, setActiveJobsTab] = useState<'active' | 'past'>('active');
  const [currentJobId, setCurrentJobId] = useState<number | null>(null);

  // Modals & Feedback
  const [toast, setToast] = useState<string | null>(null);
  const [retryingJobId, setRetryingJobId] = useState<number | null>(null);
  const [isCreateJobModalOpen, setIsCreateJobModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelTargetJobId, setCancelTargetJobId] = useState<number | null>(null);
  const [isCompleteConfirmModalOpen, setIsCompleteConfirmModalOpen] = useState(false);
  const [completeTargetJobId, setCompleteTargetJobId] = useState<number | null>(null);
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [rateTargetJobId, setRateTargetJobId] = useState<number | null>(null);
  const [profileWorker, setProfileWorker] = useState<Worker | null>(null);
  const [profileWorkerSource, setProfileWorkerSource] = useState<'list' | 'favourites'>('list');
  const [sentJobConfirmation, setSentJobConfirmation] = useState<{
    jobId: number;
    workerCount: number;
    category: string;
  } | null>(null);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const openKeyboard = useCallback(() => setIsKeyboardOpen(true), []);
  const closeKeyboard = useCallback(() => setIsKeyboardOpen(false), []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('SEVA_SETU_USER_PROD', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('SEVA_SETU_JOBS_V6', JSON.stringify(jobs));
  }, [jobs]);

  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hideToast = () => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
    setToast(null);
  };

  const showToast = (msg: string) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToast(msg);
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 2600);
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const navigateTo = (newScreen: AppScreen) => {
    setScreen(newScreen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateDraftJob = (updates: Partial<DraftJob>) => {
    setDraftJob(prev => ({ ...prev, ...updates }));
  };

  const toggleWorkerSelection = (id: number) => {
    setSelectedWorkerIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleFavourite = (id: number) => {
    setFavourites(prev => {
      if (prev.includes(id)) {
        showToast('Removed from Favourites');
        return prev.filter(x => x !== id);
      } else {
        showToast('Saved to Favourites');
        return [...prev, id];
      }
    });
  };

  const isFavourite = (id: number) => favourites.includes(id);

  const openJobDetails = (jobId: number) => {
    setCurrentJobId(jobId);
    navigateTo('job-detail');
  };

  const openWorkerProfile = (worker: Worker, source: 'list' | 'favourites' = 'list') => {
    setProfileWorker(worker);
    setProfileWorkerSource(source);
  };
  const closeWorkerProfile = () => {
    setProfileWorker(null);
    setProfileWorkerSource('list');
  };

  const openSentJobConfirmation = (jobId: number, workerCount: number, category: string) => {
    setSentJobConfirmation({ jobId, workerCount, category });
  };
  const closeSentJobConfirmation = () => setSentJobConfirmation(null);

  const createJobFromDraft = () => {
    // If retrying an urgent job, overwrite the existing card in-place instead of creating a new one
    if (retryingJobId) {
      setJobs(prev => prev.map(j => {
        if (j.id === retryingJobId) {
          return {
            ...j,
            category: draftJob.category,
            date: draftJob.date || new Date().toISOString().split('T')[0],
            time: draftJob.time || '10:00 AM',
            location: draftJob.location || (draftJob.locationMode === 'saved' ? user.location : 'Current Location'),
            description: draftJob.description.trim() || `Requirement for ${draftJob.category}`,
            hasVoiceNote: draftJob.hasVoiceNote,
            voiceNoteDuration: draftJob.voiceNoteDuration,
            status: 'looking',
            requests: selectedWorkerIds.map(wId => ({
              workerId: wId,
              status: 'pending'
            })),
            rating: null,
            createdAt: new Date().toISOString()
          };
        }
        return j;
      }));
      setIsConfirmModalOpen(false);
      setCurrentJobId(retryingJobId);
      setSentJobConfirmation({
        jobId: retryingJobId,
        workerCount: selectedWorkerIds.length,
        category: draftJob.category
      });
      setRetryingJobId(null);
      showToast('⚡ Urgent request updated & rebroadcasted!');
      return;
    }

    const newJob: Job = {
      id: Date.now(),
      category: draftJob.category,
      date: draftJob.date,
      time: draftJob.time,
      location: draftJob.locationMode === 'saved' ? user.location : 'Current Location',
      description: draftJob.description.trim() || `Requirement for ${draftJob.category}`,
      hasVoiceNote: draftJob.hasVoiceNote,
      voiceNoteDuration: draftJob.voiceNoteDuration,
      wage: `₹${draftJob.wageMin}–₹${draftJob.wageMax} / hr`,
      status: 'looking',
      requests: selectedWorkerIds.map(wId => ({
        workerId: wId,
        status: 'pending'
      })),
      rating: null,
      createdAt: new Date().toISOString()
    };

    setJobs(prev => [newJob, ...prev]);
    setIsConfirmModalOpen(false);
    setCurrentJobId(newJob.id);
    setSentJobConfirmation({
      jobId: newJob.id,
      workerCount: selectedWorkerIds.length,
      category: newJob.category
    });
  };

  const createJobWithRequests = () => {
    createJobFromDraft();
  };

  const requestWorkerDirectly = (workerId: number) => {
    const worker = WORKERS_DATABASE.find(w => w.id === workerId);
    if (!worker) return;

    const cat = selectedCategory || draftJob.category || worker.category;

    // Check if there is an active 'looking' job for this category
    const activeLookingJob = jobs.find(j => 
      j.status === 'looking' && 
      j.category.toLowerCase() === cat.toLowerCase()
    );

    if (activeLookingJob) {
      const alreadyRequested = activeLookingJob.requests.some(r => r.workerId === workerId);
      if (!alreadyRequested) {
        setJobs(prev => prev.map(j => {
          if (j.id === activeLookingJob.id) {
            return {
              ...j,
              requests: [...j.requests, { workerId, status: 'pending' }]
            };
          }
          return j;
        }));
      }
      showToast(`Request sent to ${worker.name}!`);
    } else {
      const newJob: Job = {
        id: Date.now(),
        category: cat,
        date: draftJob.date || new Date().toISOString().split('T')[0],
        time: '10:00 AM',
        location: draftJob.location || user.location || 'Saved Address',
        description: draftJob.description.trim() || `Requirement for ${cat}`,
        wage: worker.wage,
        status: 'looking',
        requests: [{ workerId: worker.id, status: 'pending' }],
        rating: null,
        createdAt: new Date().toISOString()
      };
      setJobs(prev => [newJob, ...prev]);
      setCurrentJobId(newJob.id);
      showToast(`Request sent to ${worker.name}!`);
    }
  };

  const isWorkerRequested = (workerId: number): boolean => {
    const cat = selectedCategory || draftJob.category;
    const activeJob = jobs.find(j => 
      (j.status === 'looking' || j.status === 'matched') &&
      j.category.toLowerCase() === cat.toLowerCase()
    );
    if (!activeJob) return false;
    return activeJob.requests.some(r => r.workerId === workerId && (r.status === 'pending' || r.status === 'accepted'));
  };

  const createJobForWorker = (
    workerId: number, 
    customParams?: { category?: string; date?: string; time?: string; location?: string; description?: string }
  ): number | null => {
    const worker = WORKERS_DATABASE.find(w => w.id === workerId);
    if (!worker) return null;

    const cat = customParams?.category || selectedCategory || draftJob.category || worker.category;
    const finalDate = customParams?.date || draftJob.date || new Date().toISOString().split('T')[0];
    const finalLocation = customParams?.location || draftJob.location || user.location || 'Palakkad Town';
    const finalTime = customParams?.time || draftJob.time || '10:00 AM';
    const finalDesc = customParams?.description || draftJob.description.trim() || `Direct request for ${worker.name}`;

    const newJob: Job = {
      id: Date.now(),
      category: cat,
      date: finalDate,
      time: finalTime,
      location: finalLocation,
      description: finalDesc,
      hasVoiceNote: draftJob.hasVoiceNote,
      voiceNoteDuration: draftJob.voiceNoteDuration,
      wage: worker.wage,
      status: 'looking',
      requests: [{ workerId: worker.id, status: 'pending' }],
      rating: null,
      createdAt: new Date().toISOString()
    };

    setJobs(prev => [newJob, ...prev]);
    setCurrentJobId(newJob.id);
    setSelectedWorkerIds([]);
    showToast(`Request sent to ${worker.name}!`);
    return newJob.id;
  };

  const requestFavouriteDirectly = (workerId: number, tradeCategory?: string) => {
    const worker = WORKERS_DATABASE.find(w => w.id === workerId);
    if (!worker) return;

    const cat = tradeCategory || worker.category;
    setSelectedCategory(cat);
    setSelectedWorkerIds([worker.id]);
    setDraftJob(prev => ({
      ...prev,
      category: cat,
      date: prev.date || new Date().toISOString().split('T')[0],
      time: prev.time || '10:00 AM',
      location: prev.locationMode === 'current' ? prev.location : (user.location || 'Palakkad Town'),
      wageMin: 350,
      wageMax: 500
    }));
    setIsCreateJobModalOpen(true);
  };

  const requestMoreWorkers = (jobId: number) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;

    setSelectedCategory(job.category);
    const existingWorkerIds = job.requests.map(r => r.workerId);
    const available = WORKERS_DATABASE
      .filter(w => w.category.toLowerCase() === job.category.toLowerCase() && !existingWorkerIds.includes(w.id))
      .map(w => w.id);

    setSelectedWorkerIds(available);
    navigateTo('workers');
  };

  const requestWorkerForJob = (jobId: number, workerId: number) => {
    const worker = WORKERS_DATABASE.find(w => w.id === workerId);
    if (!worker) return;

    setJobs(prev => prev.map(j => {
      if (j.id === jobId) {
        const already = j.requests.some(r => r.workerId === workerId);
        if (already) return j;
        return {
          ...j,
          status: 'looking',
          requests: [...j.requests, { workerId, status: 'pending' }]
        };
      }
      return j;
    }));
    showToast(`Request sent to ${worker.name}!`);
  };

  const cancelJob = (jobId: number) => {
    setJobs(prev => prev.map(j => {
      if (j.id === jobId) {
        return {
          ...j,
          status: 'cancelled',
          requests: j.requests.map(r => 
            r.status === 'pending' || r.status === 'inactive' ? { ...r, status: 'cancelled' } : r
          )
        };
      }
      return j;
    }));
    setIsCancelModalOpen(false);
    showToast('Job cancelled');
    setActiveJobsTab('past');
    navigateTo('jobs');
  };

  const completeJob = (jobId: number) => {
    setJobs(prev => prev.map(j => {
      if (j.id === jobId) {
        return { ...j, status: 'completed' };
      }
      return j;
    }));
    showToast('Job marked as completed!');
    setRateTargetJobId(jobId);
    setIsRateModalOpen(true);
  };

  const rateJob = (jobId: number, stars: number) => {
    setJobs(prev => prev.map(j => {
      if (j.id === jobId) {
        return { ...j, rating: stars };
      }
      return j;
    }));
    setIsRateModalOpen(false);
    showToast(`Thank you! ${stars}-star rating submitted.`);
    setActiveJobsTab('past');
    navigateTo('jobs');
  };

  const callWorker = (worker: Worker) => {
    showToast(`Dialing ${worker.name} (${worker.phone})...`);
  };

  const retryUrgentJob = (jobId: number) => {
    const targetJob = jobs.find(j => j.id === jobId);
    if (!targetJob) return;

    // Set retry target to overwrite this urgent job card in-place upon submission
    setRetryingJobId(jobId);

    // Pre-fill draftJob with all this job's existing details (no wage field shown in modal)
    setSelectedCategory(targetJob.category);
    setDraftJob({
      category: targetJob.category,
      date: targetJob.date || new Date().toISOString().split('T')[0],
      time: targetJob.time || '10:00 AM',
      timeSlot: 'morning',
      location: targetJob.location || user.location,
      locationMode: 'saved',
      description: targetJob.description || '',
      wageMin: 350,
      wageMax: 500,
      hasVoiceNote: targetJob.hasVoiceNote,
      voiceNoteDuration: targetJob.voiceNoteDuration,
      workersNeeded: Math.max(1, targetJob.requests?.length || 1)
    });

    // Pre-select existing worker IDs
    const previousWorkerIds = targetJob.requests.map(r => r.workerId);
    setSelectedWorkerIds(previousWorkerIds.length > 0 ? previousWorkerIds : [1, 2]);

    // Open Job Details collection bottom sheet modal directly
    setIsCreateJobModalOpen(true);
  };

  // Simulator Triggers
  const simulateWorkerAcceptance = (jobId: number, targetWorkerId?: number) => {
    setJobs(prev => prev.map(j => {
      if (j.id === jobId) {
        const pendingReq = targetWorkerId 
          ? j.requests.find(r => r.workerId === targetWorkerId && r.status === 'pending')
          : j.requests.find(r => r.status === 'pending');
          
        if (!pendingReq) {
          showToast('All requested workers have already responded.');
          return j;
        }

        const updatedRequests = j.requests.map(r => {
          if (r.workerId === pendingReq.workerId) {
            return { ...r, status: 'accepted' as const };
          }
          return r;
        });

        const acceptedWorker = WORKERS_DATABASE.find(w => w.id === pendingReq.workerId);
        const acceptedCount = updatedRequests.filter(r => r.status === 'accepted').length;
        const totalCount = updatedRequests.length;
        
        showToast(`🎉 ${acceptedWorker?.name || 'Worker'} accepted your request! (${acceptedCount} of ${totalCount} workers hired)`);

        return {
          ...j,
          status: 'matched',
          requests: updatedRequests
        };
      }
      return j;
    }));
  };

  const simulateWorkerCancellation = (jobId: number, targetWorkerId?: number) => {
    setJobs(prev => prev.map(j => {
      if (j.id === jobId) {
        const acceptedReq = targetWorkerId
          ? j.requests.find(r => r.workerId === targetWorkerId && r.status === 'accepted')
          : j.requests.find(r => r.status === 'accepted');

        if (!acceptedReq) {
          showToast('No accepted workers found to cancel.');
          return j;
        }

        const matchedWorker = WORKERS_DATABASE.find(w => w.id === acceptedReq.workerId);

        const updatedRequests = j.requests.map(r => {
          if (r.workerId === acceptedReq.workerId) {
            return { ...r, status: 'cancelled' as const };
          }
          return r;
        });

        const remainingAccepted = updatedRequests.filter(r => r.status === 'accepted').length;
        const remainingPending = updatedRequests.filter(r => r.status === 'pending').length;

        showToast(`${matchedWorker?.name || 'Worker'} cancelled their acceptance.`);

        return {
          ...j,
          status: remainingAccepted > 0 ? 'matched' : (remainingPending > 0 ? 'looking' : 'unfilled'),
          requests: updatedRequests
        };
      }
      return j;
    }));
  };

  const simulateNoWorkerAccepts = (jobId: number) => {
    setJobs(prev => prev.map(j => {
      if (j.id === jobId) {
        showToast('No workers were available right now. You can try booking again.');
        return {
          ...j,
          status: 'unfilled',
          requests: j.requests.map(r => ({ ...r, status: 'rejected' as const }))
        };
      }
      return j;
    }));
  };

  const simulateResetJob = (jobId: number) => {
    setJobs(prev => prev.map(j => {
      if (j.id === jobId) {
        showToast('Request reset to waiting for worker reply.');
        return {
          ...j,
          status: 'looking',
          rating: null,
          requests: j.requests.map(r => ({ ...r, status: 'pending' as const }))
        };
      }
      return j;
    }));
  };

  const openCreateJobModal = (cat?: string) => {
    // Starting a normal booking from scratch clears any pending retry target
    setRetryingJobId(null);
    if (cat) {
      setSelectedCategory(cat);
      setSelectedWorkerIds([]);
      setDraftJob(prev => ({
        ...prev,
        category: cat,
        date: prev.date || new Date().toISOString().split('T')[0],
        time: prev.time || '10:00 AM',
        location: prev.locationMode === 'current' ? prev.location : (user.location || 'Palakkad Town'),
        workersNeeded: prev.workersNeeded || 1
      }));
    }
    setIsCreateJobModalOpen(true);
  };
  const closeCreateJobModal = () => setIsCreateJobModalOpen(false);

  const openLocationModal = () => setIsLocationModalOpen(true);
  const closeLocationModal = () => setIsLocationModalOpen(false);

  const openConfirmModal = () => setIsConfirmModalOpen(true);
  const closeConfirmModal = () => setIsConfirmModalOpen(false);

  const openCancelModal = (jobId: number) => {
    setCancelTargetJobId(jobId);
    setIsCancelModalOpen(true);
  };
  const closeCancelModal = () => {
    setIsCancelModalOpen(false);
    setCancelTargetJobId(null);
  };

  const openCompleteConfirmModal = (jobId: number) => {
    setCompleteTargetJobId(jobId);
    setIsCompleteConfirmModalOpen(true);
  };
  const closeCompleteConfirmModal = () => {
    setIsCompleteConfirmModalOpen(false);
    setCompleteTargetJobId(null);
  };

  const openRateModal = (jobId: number) => {
    setRateTargetJobId(jobId);
    setIsRateModalOpen(true);
  };
  const closeRateModal = () => {
    setIsRateModalOpen(false);
    setRateTargetJobId(null);
  };

  const resetDemoData = () => {
    localStorage.removeItem('SEVA_SETU_USER_PROD');
    localStorage.removeItem('SEVA_SETU_JOBS_PROD');
    setUser({
      name: 'Manoj Kumar',
      phone: '9876543210',
      location: 'Palakkad Town',
      isLoggedIn: false
    });
    setJobs(INITIAL_JOBS);
    setFavourites([1, 10, 20]);
    showToast('Demo data reset.');
    navigateTo('auth-phone');
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        user,
        updateUser,
        screen,
        navigateTo,
        selectedCategory,
        setSelectedCategory,
        draftJob,
        updateDraftJob,
        selectedWorkerIds,
        setSelectedWorkerIds,
        toggleWorkerSelection,
        favourites,
        toggleFavourite,
        isFavourite,
        jobs,
        activeJobsTab,
        setActiveJobsTab,
        currentJobId,
        openJobDetails,
        createJobFromDraft,
        createJobWithRequests,
        createJobForWorker,
        requestWorkerDirectly,
        isWorkerRequested,
        requestFavouriteDirectly,
        requestMoreWorkers,
        requestWorkerForJob,
        cancelJob,
        completeJob,
        rateJob,
        callWorker,
        retryUrgentJob,
        retryingJobId,
        setRetryingJobId,
        simulateWorkerAcceptance,
        simulateWorkerCancellation,
        simulateNoWorkerAccepts,
        simulateResetJob,
        toast,
        showToast,
        hideToast,
        isCreateJobModalOpen,
        openCreateJobModal,
        closeCreateJobModal,
        isLocationModalOpen,
        openLocationModal,
        closeLocationModal,
        isConfirmModalOpen,
        openConfirmModal,
        closeConfirmModal,
        isCancelModalOpen,
        cancelTargetJobId,
        openCancelModal,
        closeCancelModal,
        isCompleteConfirmModalOpen,
        completeTargetJobId,
        openCompleteConfirmModal,
        closeCompleteConfirmModal,
        isRateModalOpen,
        rateTargetJobId,
        openRateModal,
        closeRateModal,
        profileWorker,
        profileWorkerSource,
        openWorkerProfile,
        closeWorkerProfile,
        sentJobConfirmation,
        openSentJobConfirmation,
        closeSentJobConfirmation,
        isKeyboardOpen,
        openKeyboard,
        closeKeyboard,
        resetDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
