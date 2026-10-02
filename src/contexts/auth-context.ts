'use client';

import { createContext } from 'react';
import type { ApiException } from '@/apis/core/api-error';
import type { IUser } from '@/models';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated' | 'error';

export interface AuthContextValue {
  user: IUser | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  isUnauthenticated: boolean;
  isLoading: boolean;
  isLoggingOut: boolean;
  isFetching: boolean;
  isAdmin: boolean;
  error: ApiException | null;
  refresh: () => Promise<IUser>;
  reset: () => void;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
