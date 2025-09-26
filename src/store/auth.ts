export type AuthStep = 'register' | 'verify' | 'documents' | 'login' | 'done';

import { create } from 'zustand';

interface AuthState {
  email: string;
  step: AuthStep;
  setEmail: (email: string) => void;
  setStep: (step: AuthStep) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  email: '',
  step: 'register',
  setEmail: (email: string) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('email', email);
    }
    set({ email });
  },
  setStep: (step: AuthStep) => set({ step }),
}));
