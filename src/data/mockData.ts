import type { ServiceCategory, Worker, Job } from '../types';

export const MOST_SEARCHED_SERVICES: ServiceCategory[] = [
  { 
    id: 'electrician', 
    name: 'Electrician', 
    icon: '⚡', 
    desc: 'Wiring, installation, repairs' 
  },
  { 
    id: 'plumber', 
    name: 'Plumber', 
    icon: '💧', 
    desc: 'Pipe repair, leakage, installation' 
  },
  { 
    id: 'cleaning', 
    name: 'Cleaning', 
    icon: '🧹', 
    desc: 'Home, office, shop cleaning' 
  },
  { 
    id: 'carpenter', 
    name: 'Carpenter', 
    icon: '🔨', 
    desc: 'Furniture, wood work, repairs' 
  }
];

export const OTHER_SERVICES: ServiceCategory[] = [
  { 
    id: 'painter', 
    name: 'Painter', 
    icon: '🎨', 
    desc: 'Interior, exterior, whitewash' 
  },
  { 
    id: 'gardening', 
    name: 'Gardening', 
    icon: '🌱', 
    desc: 'Grass cutting, yard maintenance' 
  },
  { 
    id: 'farm-work', 
    name: 'Farm Work', 
    icon: '🌾', 
    desc: 'Paddy field work, harvesting' 
  },
  { 
    id: 'mechanic', 
    name: 'Mechanic', 
    icon: '⚙️', 
    desc: 'Two-wheeler, engine, motor repair' 
  },
  { 
    id: 'cooking', 
    name: 'Cooking', 
    icon: '🍳', 
    desc: 'Daily meals, catering, functions' 
  },
  { 
    id: 'transport', 
    name: 'Transport', 
    icon: '🚚', 
    desc: 'Pickup truck, goods moving, haulage' 
  },
  { 
    id: 'animal-care', 
    name: 'Animal Care', 
    icon: '🐄', 
    desc: 'Cattle care, milking, shed helper' 
  },
  { 
    id: 'general-labour', 
    name: 'General Labour', 
    icon: '👥', 
    desc: 'Construction, brickwork, loader' 
  },
  { 
    id: 'tailor', 
    name: 'Tailor', 
    icon: '✂️', 
    desc: 'Stitching, alterations, curtains' 
  }
];

export const RURAL_LOCATIONS: string[] = [
  'Palakkad Town',
  'Chittur',
  'Alathur',
  'Kuzhalmannam',
  'Nenmara',
  'Kollengode',
  'Ottapalam',
  'Cherpulassery',
  'Pattambi',
  'Mannarkkad'
];

export const WORKERS_DATABASE: Worker[] = [
  { 
    id: 1, 
    name: 'Rajesh Kumar', 
    category: 'Electrician', 
    rating: 4.8, 
    reviewsCount: 34, 
    completedJobsCount: 34,
    distance: 3.2, 
    wage: '₹200/hr', 
    dailyWage: '₹850/day',
    serviceWages: {
      'Electrician': { hourly: '₹200/hr', daily: '₹850/day' },
      'Plumber': { hourly: '₹190/hr', daily: '₹800/day' }
    },
    badgeTier: 'Gold',
    badgePoints: 500,
    phone: '+91 94471 23456', 
    initial: 'R',
    avatar: '/images/workers/rajesh.jpg',
    skills: ['Electrician', 'Plumber'],
    matchedSkill: 'Electrician',
    about: 'Experienced licensed electrician with over 8 years of wiring, switchboard troubleshooting, and household electrical repair experience in Palakkad.'
  },
  { 
    id: 2, 
    name: 'Suresh Menon', 
    category: 'Electrician', 
    rating: 4.7, 
    reviewsCount: 22, 
    completedJobsCount: 22,
    distance: 5.1, 
    wage: '₹180/hr', 
    dailyWage: '₹800/day',
    serviceWages: {
      'Electrician': { hourly: '₹180/hr', daily: '₹800/day' }
    },
    badgeTier: 'Silver',
    badgePoints: 200,
    phone: '+91 98462 34567', 
    initial: 'S',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&auto=format&fit=crop&q=80',
    skills: ['Electrician'],
    matchedSkill: 'Electrician',
    about: 'Reliable village electrician specialized in fan installation, inverter setup, and emergency household repairs.'
  },
  { 
    id: 3, 
    name: 'Anil Prasad', 
    category: 'Electrician', 
    rating: 4.9, 
    reviewsCount: 48, 
    completedJobsCount: 48,
    distance: 7.0, 
    wage: '₹250/hr', 
    dailyWage: '₹950/day',
    serviceWages: {
      'Electrician': { hourly: '₹250/hr', daily: '₹950/day' },
      'Plumber': { hourly: '₹220/hr', daily: '₹880/day' }
    },
    badgeTier: 'Platinum',
    badgePoints: 1000,
    phone: '+91 97453 45678', 
    initial: 'A',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&auto=format&fit=crop&q=80',
    skills: ['Electrician', 'Plumber'],
    matchedSkill: 'Electrician',
    about: 'Master electrician and contractor handling residential three-phase wiring, pump house connections, and solar installations.'
  },
  { 
    id: 4, 
    name: 'Manu C.R.', 
    category: 'Electrician', 
    rating: 4.5, 
    reviewsCount: 15, 
    completedJobsCount: 15,
    distance: 9.4, 
    wage: '₹180/hr', 
    dailyWage: '₹800/day',
    serviceWages: {
      'Electrician': { hourly: '₹180/hr', daily: '₹800/day' }
    },
    badgeTier: 'Bronze',
    badgePoints: 80,
    phone: '+91 94954 56789', 
    initial: 'M',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80',
    skills: ['Electrician'],
    matchedSkill: 'Electrician',
    about: 'Young certified wireman offering punctual and affordable residential electrical services.'
  },
  { 
    id: 5, 
    name: 'Ashraf Ali', 
    category: 'Electrician', 
    rating: 4.9, 
    reviewsCount: 52, 
    completedJobsCount: 52,
    distance: 11.2, 
    wage: '₹220/hr', 
    dailyWage: '₹900/day',
    serviceWages: {
      'Electrician': { hourly: '₹220/hr', daily: '₹900/day' },
      'Plumber': { hourly: '₹200/hr', daily: '₹850/day' }
    },
    badgeTier: 'Diamond',
    badgePoints: 2000,
    phone: '+91 98955 67890', 
    initial: 'A',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=240&auto=format&fit=crop&q=80',
    skills: ['Electrician', 'Plumber'],
    matchedSkill: 'Electrician',
    about: 'Top-rated senior technician in Palakkad district with 12+ years experience in heavy motor rewinding and complete house wiring.'
  },
  
  { 
    id: 10, 
    name: 'Biju Varghese', 
    category: 'Plumber', 
    rating: 4.8, 
    reviewsCount: 29, 
    completedJobsCount: 29,
    distance: 2.8, 
    wage: '₹220/hr', 
    dailyWage: '₹850/day',
    serviceWages: {
      'Plumber': { hourly: '₹220/hr', daily: '₹850/day' },
      'Electrician': { hourly: '₹200/hr', daily: '₹820/day' }
    },
    badgeTier: 'Gold',
    badgePoints: 520,
    phone: '+91 94477 11223', 
    initial: 'B',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=240&auto=format&fit=crop&q=80',
    skills: ['Plumber', 'Electrician'],
    matchedSkill: 'Plumber',
    about: 'Prompt sanitation and pipe technician specializing in PVC and CPVC leak repairs, tank cleaning, and bathroom fitting installations.'
  },
  { 
    id: 11, 
    name: 'Radhakrishnan M.', 
    category: 'Plumber', 
    rating: 4.7, 
    reviewsCount: 19, 
    completedJobsCount: 19,
    distance: 6.4, 
    wage: '₹190/hr', 
    dailyWage: '₹800/day',
    serviceWages: {
      'Plumber': { hourly: '₹190/hr', daily: '₹800/day' }
    },
    badgeTier: 'Silver',
    badgePoints: 240,
    phone: '+91 98468 22334', 
    initial: 'R',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=240&auto=format&fit=crop&q=80',
    skills: ['Plumber'],
    matchedSkill: 'Plumber',
    about: 'Reliable village plumber with expertise in borewell motors, overhead tanks, and underground drainage.'
  },
  { 
    id: 12, 
    name: 'Saji Mohan', 
    category: 'Plumber', 
    rating: 4.5, 
    reviewsCount: 12, 
    completedJobsCount: 12,
    distance: 8.9, 
    wage: '₹200/hr', 
    dailyWage: '₹820/day',
    serviceWages: {
      'Plumber': { hourly: '₹200/hr', daily: '₹820/day' }
    },
    badgeTier: 'Bronze',
    badgePoints: 110,
    phone: '+91 97459 33445', 
    initial: 'S',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=240&auto=format&fit=crop&q=80',
    skills: ['Plumber'],
    matchedSkill: 'Plumber',
    about: 'Experienced in faucet installations, block removal, and bathroom fixture servicing.'
  },
  { 
    id: 13, 
    name: 'Manoj Kumar', 
    category: 'Plumber', 
    rating: 4.6, 
    reviewsCount: 16, 
    completedJobsCount: 16,
    distance: 4.1, 
    wage: '₹210/hr', 
    dailyWage: '₹840/day',
    serviceWages: {
      'Plumber': { hourly: '₹210/hr', daily: '₹840/day' }
    },
    badgeTier: 'Silver',
    badgePoints: 210,
    phone: '+91 94462 88990', 
    initial: 'M',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&auto=format&fit=crop&q=80',
    skills: ['Plumber'],
    matchedSkill: 'Plumber',
    about: 'Specialist in bathroom pipe fittings, tap repair, and water tank pipeline leakage works in Palakkad.'
  },

  { 
    id: 30, 
    name: 'Santhosh Kumar', 
    category: 'Cleaning', 
    rating: 4.8, 
    reviewsCount: 38, 
    completedJobsCount: 38,
    distance: 3.5, 
    wage: '₹150/hr', 
    dailyWage: '₹650/day',
    serviceWages: {
      'Cleaning': { hourly: '₹150/hr', daily: '₹650/day' },
      'Gardening': { hourly: '₹160/hr', daily: '₹700/day' }
    },
    badgeTier: 'Gold',
    badgePoints: 600,
    phone: '+91 94953 77889', 
    initial: 'S',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=240&auto=format&fit=crop&q=80',
    skills: ['Cleaning', 'Gardening'],
    matchedSkill: 'Cleaning',
    about: 'Specialized in thorough home, office, and shop floor cleaning, deep yard maintenance, and rubbish removal.'
  },
  { 
    id: 31, 
    name: 'Maniamma', 
    category: 'Cleaning', 
    rating: 4.9, 
    reviewsCount: 44, 
    completedJobsCount: 44,
    distance: 6.0, 
    wage: '₹140/hr', 
    dailyWage: '₹600/day',
    serviceWages: {
      'Cleaning': { hourly: '₹140/hr', daily: '₹600/day' }
    },
    badgeTier: 'Platinum',
    badgePoints: 1100,
    phone: '+91 98954 88990', 
    initial: 'M',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=240&auto=format&fit=crop&q=80',
    skills: ['Cleaning'],
    matchedSkill: 'Cleaning',
    about: 'Trusted domestic and kitchen cleaning helper known for promptness, spotless work, and utmost honesty.'
  },

  { 
    id: 40, 
    name: 'Sudhakaran P.', 
    category: 'Carpenter', 
    rating: 4.8, 
    reviewsCount: 31, 
    completedJobsCount: 31,
    distance: 4.5, 
    wage: '₹220/hr', 
    dailyWage: '₹850/day',
    serviceWages: {
      'Carpenter': { hourly: '₹220/hr', daily: '₹850/day' }
    },
    badgeTier: 'Gold',
    badgePoints: 550,
    phone: '+91 94475 99001', 
    initial: 'S',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=240&auto=format&fit=crop&q=80',
    skills: ['Carpenter'],
    matchedSkill: 'Carpenter',
    about: 'Expert craftsman with 15+ years experience building wooden doors, window frames, wardrobes, and modular furniture repairs.'
  },
  { 
    id: 41, 
    name: 'Balaraman', 
    category: 'Carpenter', 
    rating: 4.7, 
    reviewsCount: 24, 
    completedJobsCount: 24,
    distance: 8.0, 
    wage: '₹200/hr', 
    dailyWage: '₹800/day',
    serviceWages: {
      'Carpenter': { hourly: '₹200/hr', daily: '₹800/day' }
    },
    badgeTier: 'Silver',
    badgePoints: 320,
    phone: '+91 98466 00112', 
    initial: 'B',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=240&auto=format&fit=crop&q=80',
    skills: ['Carpenter'],
    matchedSkill: 'Carpenter',
    about: 'Traditional carpenter specializing in lock repairs, wooden chair polishing, and roof timber maintenance.'
  },

  { 
    id: 50, 
    name: 'Unnikrishnan', 
    category: 'Painter', 
    rating: 4.8, 
    reviewsCount: 36, 
    completedJobsCount: 36,
    distance: 5.0, 
    wage: '₹210/hr', 
    dailyWage: '₹850/day',
    serviceWages: {
      'Painter': { hourly: '₹210/hr', daily: '₹850/day' }
    },
    badgeTier: 'Gold',
    badgePoints: 620,
    phone: '+91 97457 11223', 
    initial: 'U',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=240&auto=format&fit=crop&q=80',
    skills: ['Painter'],
    matchedSkill: 'Painter',
    about: 'Experienced whitewash, exterior weather-proofing, and interior wall emulsion specialist.'
  },
  { 
    id: 52, 
    name: 'Murugan T.', 
    category: 'Painter', 
    rating: 4.7, 
    reviewsCount: 20, 
    completedJobsCount: 20,
    distance: 7.2, 
    wage: '₹190/hr', 
    dailyWage: '₹800/day',
    serviceWages: {
      'Painter': { hourly: '₹190/hr', daily: '₹800/day' }
    },
    badgeTier: 'Silver',
    badgePoints: 280,
    phone: '+91 97457 99887', 
    initial: 'M',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=240&auto=format&fit=crop&q=80',
    skills: ['Painter'],
    matchedSkill: 'Painter',
    about: 'Fast and neat painting contractor for gate enamel, wood varnish, and wall primer coats.'
  },
  { 
    id: 51, 
    name: 'Karthik R.', 
    category: 'Gardening', 
    rating: 4.8, 
    reviewsCount: 27, 
    completedJobsCount: 27,
    distance: 4.2, 
    wage: '₹180/hr', 
    dailyWage: '₹750/day',
    serviceWages: {
      'Gardening': { hourly: '₹180/hr', daily: '₹750/day' },
      'Farm Work': { hourly: '₹190/hr', daily: '₹800/day' }
    },
    badgeTier: 'Silver',
    badgePoints: 400,
    phone: '+91 94463 33445', 
    initial: 'K',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=240&auto=format&fit=crop&q=80',
    skills: ['Gardening', 'Farm Work'],
    matchedSkill: 'Gardening',
    about: 'Grass trimming, lawn leveling, flower bed pruning, and vegetable garden care.'
  },
  { 
    id: 20, 
    name: 'Gopalan K.', 
    category: 'Farm Work', 
    rating: 4.9, 
    reviewsCount: 60, 
    completedJobsCount: 60,
    distance: 4.1, 
    wage: '₹200/hr', 
    dailyWage: '₹850/day',
    serviceWages: {
      'Farm Work': { hourly: '₹200/hr', daily: '₹850/day' }
    },
    badgeTier: 'Diamond',
    badgePoints: 2100,
    phone: '+91 94460 44556', 
    initial: 'G',
    avatar: '/images/workers/gopalan.jpg',
    skills: ['Farm Work'],
    matchedSkill: 'Farm Work',
    about: 'Veteran agricultural worker with extensive knowledge in paddy planting, coconut tree climbing, and canal bund maintenance.'
  },
  { 
    id: 21, 
    name: 'Chandran V.', 
    category: 'Farm Work', 
    rating: 4.7, 
    reviewsCount: 33, 
    completedJobsCount: 33,
    distance: 6.8, 
    wage: '₹190/hr', 
    dailyWage: '₹800/day',
    serviceWages: {
      'Farm Work': { hourly: '₹190/hr', daily: '₹800/day' }
    },
    badgeTier: 'Gold',
    badgePoints: 510,
    phone: '+91 94460 77889', 
    initial: 'C',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&auto=format&fit=crop&q=80',
    skills: ['Farm Work'],
    matchedSkill: 'Farm Work',
    about: 'Hardworking field hand experienced in agricultural harvesting, de-weeding, and soil preparation.'
  },
  { 
    id: 60, 
    name: 'Satheesh Kumar', 
    category: 'Mechanic', 
    rating: 4.7, 
    reviewsCount: 25, 
    completedJobsCount: 25,
    distance: 3.8, 
    wage: '₹250/hr', 
    dailyWage: '₹950/day',
    serviceWages: {
      'Mechanic': { hourly: '₹250/hr', daily: '₹950/day' }
    },
    badgeTier: 'Silver',
    badgePoints: 350,
    phone: '+91 94478 55667', 
    initial: 'S',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&auto=format&fit=crop&q=80',
    skills: ['Mechanic'],
    matchedSkill: 'Mechanic',
    about: 'Two-wheeler and pump motor specialist. Available for doorstep carburetor, brake, and electrical checks.'
  },
  { 
    id: 70, 
    name: 'Parvathy Amma', 
    category: 'Cooking', 
    rating: 4.9, 
    reviewsCount: 72, 
    completedJobsCount: 72,
    distance: 5.2, 
    wage: '₹160/hr', 
    dailyWage: '₹700/day',
    serviceWages: {
      'Cooking': { hourly: '₹160/hr', daily: '₹700/day' }
    },
    badgeTier: 'Diamond',
    badgePoints: 2400,
    phone: '+91 98469 77889', 
    initial: 'P',
    avatar: '/images/workers/parvathy.jpg',
    skills: ['Cooking'],
    matchedSkill: 'Cooking',
    about: 'Renowned local cook for authentic Kerala sadhya, daily household meals, breakfast snacks, and small family functions.'
  },
  { 
    id: 80, 
    name: 'Shaji Mathew', 
    category: 'Transport', 
    rating: 4.8, 
    reviewsCount: 41, 
    completedJobsCount: 41,
    distance: 6.1, 
    wage: '₹220/hr', 
    dailyWage: '₹900/day',
    serviceWages: {
      'Transport': { hourly: '₹220/hr', daily: '₹900/day' }
    },
    badgeTier: 'Platinum',
    badgePoints: 1200,
    phone: '+91 94472 88990', 
    initial: 'S',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=240&auto=format&fit=crop&q=80',
    skills: ['Transport'],
    matchedSkill: 'Transport',
    about: 'Safe driver with pick-up mini truck for carrying household goods, farm produce, and building materials.'
  },
  { 
    id: 90, 
    name: 'Ramanathan', 
    category: 'Animal Care', 
    rating: 4.8, 
    reviewsCount: 39, 
    completedJobsCount: 39,
    distance: 4.6, 
    wage: '₹150/hr', 
    dailyWage: '₹600/day',
    serviceWages: {
      'Animal Care': { hourly: '₹150/hr', daily: '₹600/day' }
    },
    badgeTier: 'Gold',
    badgePoints: 580,
    phone: '+91 97451 99001', 
    initial: 'R',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=240&auto=format&fit=crop&q=80',
    skills: ['Animal Care'],
    matchedSkill: 'Animal Care',
    about: 'Experienced cattle feeder, milker, and goat shed manager assisting local rural farms.'
  },
  { 
    id: 95, 
    name: 'Muthuvel K.', 
    category: 'General Labour', 
    rating: 4.7, 
    reviewsCount: 28, 
    completedJobsCount: 28,
    distance: 3.9, 
    wage: '₹200/hr', 
    dailyWage: '₹800/day',
    serviceWages: {
      'General Labour': { hourly: '₹200/hr', daily: '₹800/day' }
    },
    badgeTier: 'Silver',
    badgePoints: 310,
    phone: '+91 94950 11223', 
    initial: 'M',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=240&auto=format&fit=crop&q=80',
    skills: ['General Labour'],
    matchedSkill: 'General Labour',
    about: 'Strong, reliable hand for loading/unloading, construction mixing, garden digging, and heavy lifting.'
  },
  { 
    id: 98, 
    name: 'Khadeeja M.', 
    category: 'Tailor', 
    rating: 4.9, 
    reviewsCount: 54, 
    completedJobsCount: 54,
    distance: 2.5, 
    wage: '₹180/hr', 
    dailyWage: '₹750/day',
    serviceWages: {
      'Tailor': { hourly: '₹180/hr', daily: '₹750/day' }
    },
    badgeTier: 'Diamond',
    badgePoints: 2300,
    phone: '+91 98952 22334', 
    initial: 'K',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=240&auto=format&fit=crop&q=80',
    skills: ['Tailor'],
    matchedSkill: 'Tailor',
    about: 'Skilled local seamstress for blouse stitching, churidar fitting, uniform alteration, and curtain hemming.'
  }
];

export const INITIAL_JOBS: Job[] = [
  {
    id: 101,
    category: 'Electrician',
    date: new Date().toISOString().split('T')[0],
    time: '04:00 PM',
    location: 'Kalpathy, Palakkad',
    description: 'Replace 2 ceiling fans & inspect main distribution board wiring.',
    wage: '₹200/hr',
    status: 'matched',
    requests: [
      { workerId: 1, status: 'accepted' },
      { workerId: 2, status: 'accepted' },
      { workerId: 3, status: 'accepted' },
      { workerId: 4, status: 'accepted' },
      { workerId: 5, status: 'accepted' }
    ],
    rating: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 102,
    category: 'Farm Work',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '08:30 AM',
    location: 'Chittur Road, Palakkad',
    description: 'Harvesting coconut trees and clearing the farm irrigation channel.',
    wage: '₹850/day',
    status: 'matched',
    requests: [
      { workerId: 20, status: 'accepted' },
      { workerId: 21, status: 'accepted' }
    ],
    rating: null,
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 104,
    category: 'Tailor',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '11:00 AM',
    location: 'Civil Station, Palakkad',
    description: 'Traditional Kerala saree blouse stitching and kurti alterations.',
    wage: '₹200/piece',
    status: 'matched',
    requests: [
      { workerId: 98, status: 'accepted' }
    ],
    rating: null,
    createdAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 105,
    category: 'Plumber',
    date: new Date().toISOString().split('T')[0],
    time: '06:00 PM',
    location: 'Palakkad Town',
    description: 'Main overhead water tank outlet pipe leaking near the bathroom connector.',
    wage: '₹220/hr',
    status: 'looking',
    requests: [
      { workerId: 10, status: 'pending' },
      { workerId: 11, status: 'pending' },
      { workerId: 12, status: 'pending' },
      { workerId: 13, status: 'pending' }
    ],
    rating: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 103,
    category: 'Cleaning',
    date: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0],
    time: '09:00 AM',
    location: 'Palakkad Town',
    description: 'Courtyard cleaning and dry leaves clearance.',
    wage: '₹650/day',
    status: 'completed',
    requests: [
      { workerId: 30, status: 'accepted' }
    ],
    rating: 5,
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString()
  },
  {
    id: 106,
    category: 'Carpenter',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    time: '02:00 PM',
    location: 'Chandranagar, Palakkad',
    description: 'Teak wood front door lock repair and hinges tightening.',
    wage: '₹850/day',
    status: 'completed',
    requests: [
      { workerId: 40, status: 'accepted' }
    ],
    rating: null,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 107,
    category: 'Painter',
    date: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0],
    time: '10:00 AM',
    location: 'Palakkad Town',
    description: 'Exterior boundary wall white-wash and gate enamel painting.',
    wage: '₹800/day',
    status: 'cancelled',
    requests: [
      { workerId: 45, status: 'cancelled' }
    ],
    rating: null,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString()
  }
];
