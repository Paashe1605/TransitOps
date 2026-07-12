import { create } from 'zustand';

interface AuthState {
  token: str | null;
  role: str | null;
  setToken: (token: str) => void;
  setRole: (role: str) => void;
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
