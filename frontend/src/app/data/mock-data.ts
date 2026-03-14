// Mock data for UniSwap platform

export interface User {
  id: string;
  name: string;
  age: number;
  status: string;
  avatar: string;
  rating: number;
  totalReviews: number;
  creditsEarned: number;
  creditsSpent: number;
  skillsOffered: string[];
  skillsNeeded: string[];
  bio: string;
  verified: boolean;
}

export interface Service {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  creditsPerHour: number;
  duration: number; // in hours
  totalCredits: number;
  image: string;
}

export interface Booking {
  id: string;
  serviceId: string;
  providerId: string;
  requesterId: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  scheduledDate: string;
  message: string;
  creditsAmount: number;
  createdAt: string;
}

export interface Review {
  id: string;
  bookingId: string;
  reviewerId: string;
  reviewedUserId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// Current logged-in user (Mai's perspective)
export const currentUserId = 'user1';

export const users: User[] = [
  {
    id: 'user1',
    name: 'Mai Nguyen',
    age: 19,
    status: '1st-year Psychology student',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    rating: 4.8,
    totalReviews: 12,
    creditsEarned: 8,
    creditsSpent: 6,
    skillsOffered: ['English Conversation', 'Note-taking', 'Study Scheduling', 'Social Media'],
    skillsNeeded: ['Statistics Tutoring', 'Excel Help', 'Research Methods', 'SPSS'],
    bio: "I don't need charity — I just need a fair way to trade what I can do for what I need.",
    verified: true,
  },
  {
    id: 'user2',
    name: 'Daniel Tran',
    age: 22,
    status: '4th-year Computer Science student',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    rating: 4.9,
    totalReviews: 28,
    creditsEarned: 45,
    creditsSpent: 12,
    skillsOffered: ['Web Development', 'Programming Tutoring', 'Laptop Repair', 'Graphic Design'],
    skillsNeeded: ['Language Tutoring', 'Photography', 'Public Speaking'],
    bio: 'I love helping people — I just want my time to finally count for something.',
    verified: true,
  },
  {
    id: 'user3',
    name: 'Sarah Chen',
    age: 21,
    status: '3rd-year Statistics student',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    rating: 4.7,
    totalReviews: 18,
    creditsEarned: 24,
    creditsSpent: 20,
    skillsOffered: ['Statistics Tutoring', 'Excel Advanced', 'SPSS Training', 'Data Analysis'],
    skillsNeeded: ['Web Design', 'Video Editing', 'Photography'],
    bio: 'Stats doesn\'t have to be scary! Let me help you understand it.',
    verified: true,
  },
  {
    id: 'user4',
    name: 'Alex Kim',
    age: 20,
    status: '2nd-year Business student',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    rating: 4.6,
    totalReviews: 15,
    creditsEarned: 18,
    creditsSpent: 15,
    skillsOffered: ['PowerPoint Design', 'Presentation Skills', 'Excel Basics', 'Resume Writing'],
    skillsNeeded: ['Math Tutoring', 'Programming Basics', 'Fitness Coaching'],
    bio: 'Making presentations that actually look professional.',
    verified: true,
  },
];

export const services: Service[] = [
  {
    id: 'service1',
    userId: 'user2',
    title: 'Web Development Tutoring - React & HTML/CSS',
    description: 'Learn to build modern websites with React. Perfect for beginners! I\'ll help you understand the fundamentals and build your first project.',
    category: 'Tech & Programming',
    creditsPerHour: 2,
    duration: 1.5,
    totalCredits: 3,
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop',
  },
  {
    id: 'service2',
    userId: 'user3',
    title: 'Statistics & Research Methods Tutoring',
    description: 'Struggling with stats? I can help you understand concepts, work through problems, and prepare for exams. SPSS and Excel included.',
    category: 'Academic Tutoring',
    creditsPerHour: 2,
    duration: 1,
    totalCredits: 2,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
  },
  {
    id: 'service3',
    userId: 'user2',
    title: 'Laptop & Software Troubleshooting',
    description: 'Computer problems? Software issues? I can help diagnose and fix most common problems. Quick and reliable service.',
    category: 'Tech & Programming',
    creditsPerHour: 2,
    duration: 1,
    totalCredits: 2,
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=400&fit=crop',
  },
  {
    id: 'service4',
    userId: 'user4',
    title: 'PowerPoint & Presentation Design',
    description: 'Make your presentations stand out! I\'ll help you create professional slides and improve your delivery skills.',
    category: 'Design & Creative',
    creditsPerHour: 1.5,
    duration: 1,
    totalCredits: 1.5,
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=400&fit=crop',
  },
  {
    id: 'service5',
    userId: 'user1',
    title: 'English Conversation Practice',
    description: 'Practice your English speaking skills in a friendly, judgment-free environment. Great for building confidence!',
    category: 'Language',
    creditsPerHour: 1,
    duration: 1,
    totalCredits: 1,
    image: 'https://images.unsplash.com/photo-1543109740-4bdb38fda756?w=800&h=400&fit=crop',
  },
  {
    id: 'service6',
    userId: 'user3',
    title: 'Excel Advanced Functions & Data Analysis',
    description: 'Master Excel formulas, pivot tables, and data visualization. Perfect for business and research students.',
    category: 'Tech & Programming',
    creditsPerHour: 2,
    duration: 1.5,
    totalCredits: 3,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
  },
  {
    id: 'service7',
    userId: 'user4',
    title: 'Resume & Cover Letter Writing',
    description: 'Get your resume noticed by employers. I\'ll help you craft a professional CV and compelling cover letter.',
    category: 'Career & Professional',
    creditsPerHour: 1.5,
    duration: 1,
    totalCredits: 1.5,
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=400&fit=crop',
  },
  {
    id: 'service8',
    userId: 'user2',
    title: 'Graphic Design with Figma & Canva',
    description: 'Learn to create stunning graphics for social media, presentations, and projects. Beginner-friendly!',
    category: 'Design & Creative',
    creditsPerHour: 2,
    duration: 1,
    totalCredits: 2,
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop',
  },
];

export const bookings: Booking[] = [
  {
    id: 'booking1',
    serviceId: 'service2',
    providerId: 'user3',
    requesterId: 'user1',
    status: 'confirmed',
    scheduledDate: '2026-02-05T14:00:00',
    message: 'Hi! I really need help with understanding hypothesis testing and p-values for my upcoming exam.',
    creditsAmount: 2,
    createdAt: '2026-01-28T10:00:00',
  },
  {
    id: 'booking2',
    serviceId: 'service5',
    providerId: 'user1',
    requesterId: 'user2',
    status: 'completed',
    scheduledDate: '2026-01-29T16:00:00',
    message: 'I want to improve my English speaking for an upcoming presentation.',
    creditsAmount: 1,
    createdAt: '2026-01-27T09:00:00',
  },
  {
    id: 'booking3',
    serviceId: 'service5',
    providerId: 'user1',
    requesterId: 'user3',
    status: 'completed',
    scheduledDate: '2026-01-26T15:00:00',
    message: 'Need help preparing for an English interview.',
    creditsAmount: 1,
    createdAt: '2026-01-24T11:00:00',
  },
];

export const reviews: Review[] = [
  {
    id: 'review1',
    bookingId: 'booking2',
    reviewerId: 'user2',
    reviewedUserId: 'user1',
    rating: 5,
    comment: 'Mai was super patient and helpful! Really improved my confidence in speaking English. Highly recommend!',
    createdAt: '2026-01-29T18:00:00',
  },
  {
    id: 'review2',
    bookingId: 'booking3',
    reviewerId: 'user3',
    reviewedUserId: 'user1',
    rating: 5,
    comment: 'Very friendly and encouraging. Great conversation practice!',
    createdAt: '2026-01-26T17:00:00',
  },
];

export const categories = [
  'All',
  'Academic Tutoring',
  'Tech & Programming',
  'Language',
  'Design & Creative',
  'Career & Professional',
  'Life Skills',
];
