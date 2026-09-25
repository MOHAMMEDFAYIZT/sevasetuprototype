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
    distance: 3.2, 
    wage: '₹200/hr', 
    phone: '+91 94471 23456', 
    initial: 'R',
    avatar: '/images/workers/rajesh.jpg',
    skills: ['Electrician', 'Plumber'],
    matchedSkill: 'Electrician'
  },
  { 
    id: 2, 
    name: 'Suresh Menon', 
    category: 'Electrician', 
    rating: 4.7, 
    reviewsCount: 22, 
    distance: 5.1, 
    wage: '₹180/hr', 
    phone: '+91 98462 34567', 
    initial: 'S',
    skills: ['Electrician'],
    matchedSkill: 'Electrician'
  },
  { 
    id: 3, 
    name: 'Anil Prasad', 
    category: 'Electrician', 
    rating: 4.9, 
    reviewsCount: 48, 
    distance: 7.0, 
    wage: '₹250/hr', 
    phone: '+91 97453 45678', 
    initial: 'A',
    skills: ['Electrician'],
    matchedSkill: 'Electrician'
  },
  { 
    id: 4, 
    name: 'Manu C.R.', 
    category: 'Electrician', 
    rating: 4.5, 
    reviewsCount: 15, 
    distance: 9.4, 
    wage: '₹180/hr', 
    phone: '+91 94954 56789', 
    initial: 'M',
    skills: ['Electrician'],
    matchedSkill: 'Electrician'
  },
  { 
    id: 5, 
    name: 'Ashraf Ali', 
    category: 'Electrician', 
    rating: 4.9, 
    reviewsCount: 52, 
    distance: 11.2, 
    wage: '₹220/hr', 
    phone: '+91 98955 67890', 
    initial: 'A',
    skills: ['Electrician'],
    matchedSkill: 'Electrician'
  },
  
  { 
    id: 10, 
    name: 'Biju Varghese', 
    category: 'Plumber', 
    rating: 4.8, 
    reviewsCount: 29, 
    distance: 2.8, 
    wage: '₹220/hr', 
    phone: '+91 94477 11223', 
    initial: 'B',
    skills: ['Plumber'],
    matchedSkill: 'Plumber'
  },
  { 
    id: 11, 
    name: 'Radhakrishnan M.', 
    category: 'Plumber', 
    rating: 4.7, 
    reviewsCount: 19, 
    distance: 6.4, 
    wage: '₹190/hr', 
    phone: '+91 98468 22334', 
    initial: 'R',
    skills: ['Plumber'],
    matchedSkill: 'Plumber'
  },
  { 
    id: 12, 
    name: 'Saji Mohan', 
    category: 'Plumber', 
    rating: 4.5, 
    reviewsCount: 12, 
    distance: 8.9, 
    wage: '₹200/hr', 
    phone: '+91 97459 33445', 
    initial: 'S',
    skills: ['Plumber'],
    matchedSkill: 'Plumber'
  },

  { 
    id: 30, 
    name: 'Santhosh Kumar', 
    category: 'Cleaning', 
    rating: 4.8, 
    reviewsCount: 38, 
    distance: 3.5, 
    wage: '₹650/day', 
    phone: '+91 94953 77889', 
    initial: 'S',
    skills: ['Cleaning'],
    matchedSkill: 'Cleaning'
  },
  { 
    id: 31, 
    name: 'Maniamma', 
    category: 'Cleaning', 
    rating: 4.9, 
    reviewsCount: 44, 
    distance: 6.0, 
    wage: '₹600/day', 
    phone: '+91 98954 88990', 
    initial: 'M',
    skills: ['Cleaning'],
    matchedSkill: 'Cleaning'
  },

  { 
    id: 40, 
    name: 'Sudhakaran P.', 
    category: 'Carpenter', 
    rating: 4.8, 
    reviewsCount: 31, 
    distance: 4.5, 
    wage: '₹850/day', 
    phone: '+91 94475 99001', 
    initial: 'S',
    skills: ['Carpenter'],
    matchedSkill: 'Carpenter'
  },
  { 
    id: 41, 
    name: 'Balaraman', 
    category: 'Carpenter', 
    rating: 4.7, 
    reviewsCount: 24, 
    distance: 8.0, 
    wage: '₹800/day', 
    phone: '+91 98466 00112', 
    initial: 'B',
    skills: ['Carpenter'],
    matchedSkill: 'Carpenter'
  },

  { 
    id: 50, 
    name: 'Unnikrishnan', 
    category: 'Painter', 
    rating: 4.8, 
    reviewsCount: 36, 
    distance: 5.0, 
    wage: '₹850/day', 
    phone: '+91 97457 11223', 
    initial: 'U',
    skills: ['Painter'],
    matchedSkill: 'Painter'
  },
  { 
    id: 52, 
    name: 'Murugan T.', 
    category: 'Painter', 
    rating: 4.7, 
    reviewsCount: 20, 
    distance: 7.2, 
    wage: '₹800/day', 
    phone: '+91 97457 99887', 
    initial: 'M',
    skills: ['Painter'],
    matchedSkill: 'Painter'
  },
  { 
    id: 51, 
    name: 'Karthik R.', 
    category: 'Gardening', 
    rating: 4.8, 
    reviewsCount: 27, 
    distance: 4.2, 
    wage: '₹750/day', 
    phone: '+91 94463 33445', 
    initial: 'K',
    skills: ['Gardening'],
    matchedSkill: 'Gardening'
  },
  { 
    id: 20, 
    name: 'Gopalan K.', 
    category: 'Farm Work', 
    rating: 4.9, 
    reviewsCount: 60, 
    distance: 4.1, 
    wage: '₹850/day', 
    phone: '+91 94460 44556', 
    initial: 'G',
    avatar: '/images/workers/gopalan.jpg',
    skills: ['Farm Work'],
    matchedSkill: 'Farm Work'
  },
  { 
    id: 21, 
    name: 'Chandran V.', 
    category: 'Farm Work', 
    rating: 4.7, 
    reviewsCount: 33, 
    distance: 6.8, 
    wage: '₹800/day', 
    phone: '+91 94460 77889', 
    initial: 'C',
    skills: ['Farm Work'],
    matchedSkill: 'Farm Work'
  },
  { 
    id: 60, 
    name: 'Satheesh Kumar', 
    category: 'Mechanic', 
    rating: 4.7, 
    reviewsCount: 25, 
    distance: 3.8, 
    wage: '₹250/hr', 
    phone: '+91 94478 55667', 
    initial: 'S',
    skills: ['Mechanic'],
    matchedSkill: 'Mechanic'
  },
  { 
    id: 70, 
    name: 'Parvathy Amma', 
    category: 'Cooking', 
    rating: 4.9, 
    reviewsCount: 72, 
    distance: 5.2, 
    wage: '₹700/day', 
    phone: '+91 98469 77889', 
    initial: 'P',
    avatar: '/images/workers/parvathy.jpg',
    skills: ['Cooking'],
    matchedSkill: 'Cooking'
  },
  { 
    id: 80, 
    name: 'Shaji Mathew', 
    category: 'Transport', 
    rating: 4.8, 
    reviewsCount: 41, 
    distance: 6.1, 
    wage: '₹900/trip', 
    phone: '+91 94472 88990', 
    initial: 'S',
    skills: ['Transport'],
    matchedSkill: 'Transport'
  },
  { 
    id: 90, 
    name: 'Ramanathan', 
    category: 'Animal Care', 
    rating: 4.8, 
    reviewsCount: 39, 
    distance: 4.6, 
    wage: '₹600/day', 
    phone: '+91 97451 99001', 
    initial: 'R',
    skills: ['Animal Care'],
    matchedSkill: 'Animal Care'
  },
  { 
    id: 95, 
    name: 'Muthuvel K.', 
    category: 'General Labour', 
    rating: 4.7, 
    reviewsCount: 28, 
    distance: 3.9, 
    wage: '₹800/day', 
    phone: '+91 94950 11223', 
    initial: 'M',
    skills: ['General Labour'],
    matchedSkill: 'General Labour'
  },
  { 
    id: 98, 
    name: 'Khadeeja M.', 
    category: 'Tailor', 
    rating: 4.9, 
    reviewsCount: 54, 
    distance: 2.5, 
    wage: '₹200/piece', 
    phone: '+91 98952 22334', 
    initial: 'K',
    skills: ['Tailor'],
    matchedSkill: 'Tailor'
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
      { workerId: 2, status: 'inactive' },
      { workerId: 3, status: 'inactive' }
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
      { workerId: 20, status: 'accepted' }
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
      { workerId: 12, status: 'pending' }
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
