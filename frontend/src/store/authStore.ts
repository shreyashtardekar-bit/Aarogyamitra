import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  username: string;
  email: string;
  full_name: string | null;
  age: number | null;
  gender: string | null;
  height: number | null;
  current_weight: number | null;
  target_weight: number | null;
  fitness_level: string | null;
  fitness_goal: string | null;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User) => void;
  updateUser: (user: Partial<User>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
      updateUser: (updatedFields) => 
        set((state) => ({ 
          user: state.user ? { ...state.user, ...updatedFields } : null 
        })),
      logout: () => {
        localStorage.removeItem('token'); // In case other parts rely on this specifically
        set({ token: null, user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
