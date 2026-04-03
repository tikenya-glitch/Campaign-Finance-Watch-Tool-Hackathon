// User-related types
export interface User {
  username: string;
  email: string;
  role: string;
  permissions: string[];
  id?: string;
  name?: string;
  phone?: string;
  full_name?: string;
  phone_number?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface UserSession {
  user: User;
  sessionId: string;
}

// Registration types
export interface RegisterData {
  email: string;
  password: string;
  name?: string;
  phone?: string;
}

export interface RegisterResponse {
  user: Omit<User, "status" | "createdAt" | "updatedAt">;
  sessionId: string;
}

// Phone OTP types
export interface PhoneOtpResponse {
  sessionId: string;
}

export interface VerifyPhoneOtpData {
  phoneNumber: string;
  otp: string;
  sessionId: string;
}

export interface VerifyPhoneOtpResponse {
  user: Omit<User, "status" | "createdAt" | "updatedAt">;
  sessionId: string;
}

export interface CompletePhoneSignupData {
  phoneNumber: string;
  sessionId: string;
  name?: string;
  email?: string;
  password?: string;
}

export interface CompletePhoneSignupResponse {
  user: Omit<User, "status" | "createdAt" | "updatedAt">;
}

// Email OTP types
export interface VerifyEmailOtpData {
  email: string;
  otp: string;
}

export interface VerifyEmailOtpResponse {
  user: Omit<User, "status" | "createdAt" | "updatedAt">;
  sessionId: string;
}

export interface ResendEmailOtpData {
  email: string;
}

export interface ResendEmailOtpResponse {
  sessionId: string;
}

// Generic API response type
// Data-related types
export interface County {
  id: number;
  code: string;
  name: string;
  region: string;
  area_sq_km?: number;
  capital?: string;
  current_population?: number;
  created_at: string;
  updated_at: string;
}

export interface Party {
  id: number;
  code: string;
  name: string;
  abbreviation?: string;
  registration_number?: string;
  founding_year?: number;
  ideology?: string;
  headquarters?: string;
  created_at: string;
  updated_at: string;
}

export interface Candidate {
  id: number;
  name: string;
  party_id?: number;
  constituency?: string;
  county?: string;
  seat_type?: string;
  created_at: string;
  updated_at: string;
}

export interface CountyPopulation {
  id: number;
  county_id: number;
  census_year: number;
  population: number;
  growth_rate?: number;
  density_per_sq_km?: number;
  urban_population?: number;
  rural_population?: number;
  male_population?: number;
  female_population?: number;
  households?: number;
  avg_household_size?: number;
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  body: T | null;
}
