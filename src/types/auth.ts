export interface User {
  id: number;
  name: string;
  lastname: string;
  email: string;
  email_verified_at: string | null;
  documents_submitted_at: string | null;
  documents_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface SignupResponse {
  message: string;
  user: User;
}

export interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export interface VerificationResponse {
  message: string;
}

export interface DocumentSubmissionResponse {
  message: string;
}
