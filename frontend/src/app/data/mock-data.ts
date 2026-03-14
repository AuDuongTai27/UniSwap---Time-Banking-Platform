// Chỉ còn interfaces và categories — không còn data cứng

export interface User {
  id: number;
  email: string;
  name: string;
  age: number;
  status: string;
  avatar: string;
  rating: number;
  total_reviews: number;
  credits_earned: number;
  credits_spent: number;
  skills_offered: string[];
  skills_needed: string[];
  bio: string;
  is_verified: boolean;
}

export interface Service {
  id: number;
  user_id: number;
  title: string;
  description: string;
  category: string;
  credits_per_hour: number;
  duration: number;
  total_credits: number;
  image: string;
  // Joined fields từ backend
  provider_name: string;
  provider_avatar: string;
  provider_rating: number;
  provider_total_reviews: number;
}

export interface Booking {
  id: number;
  service_id: number;
  provider_id: number;
  requester_id: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  scheduled_date: string;
  message: string;
  credits_amount: number;
  created_at: string;
  // Joined fields
  service_title: string;
  service_image: string;
  service_category: string;
  other_user_name: string;
  other_user_avatar: string;
}

export interface Review {
  id: number;
  booking_id: number;
  reviewer_id: number;
  reviewed_user_id: number;
  rating: number;
  comment: string;
  created_at: string;
  reviewer_name: string;
  reviewer_avatar: string;
}

export const categories = [
  'All',
  'Academic Tutoring',
  'Tech & Programming',
  'Language',
  'Design & Creative',
  'Career & Professional',
  'Life Skills',
];