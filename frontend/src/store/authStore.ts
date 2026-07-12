import { create } from 'zustand';

interface AuthState {
  token: string | null;
  role: string | null;
  setToken: (token: string) => void;
  setRole: (role: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  role: localStorage.getItem('role'),
  setToken: (token) => {
    localStorage.setItem('token', token);
    set({ token });
  },
  setRole: (role) => {
    localStorage.setItem('role', role);
    set({ role });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    set({ token: null, role: null });
  },
}));
