import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiRequest, HQ_SESSION_KEY } from '../services/apiClient';
import { useToast } from './ToastContext';

const HqAuthContext = createContext(null);

export function HqAuthProvider({ children }) {
  const toast = useToast();
  const [hqUser, setHqUser] = useState(() => {
    try {
      const raw = localStorage.getItem(HQ_SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [isCheckingAuth, setIsCheckingAuth] = useState(Boolean(hqUser?.token));

  const logout = useCallback(() => {
    localStorage.removeItem(HQ_SESSION_KEY);
    setHqUser(null);
  }, []);

  // Verify token and active status against /api/kfc-users/me on mount
  useEffect(() => {
    let cancelled = false;
    async function verifySession() {
      if (!hqUser?.token) {
        setIsCheckingAuth(false);
        return;
      }
      try {
        const res = await apiRequest('/kfc-users/me');
        if (!cancelled && res?.success && res?.data) {
          const refreshed = { ...hqUser, ...res.data, token: hqUser.token };
          localStorage.setItem(HQ_SESSION_KEY, JSON.stringify(refreshed));
          setHqUser(refreshed);
        }
      } catch (err) {
        if (!cancelled && (err.status === 401 || err.status === 403)) {
          logout();
          toast.error(err.message || 'Session expired. Please sign in again.', 'Access Revoked');
        }
      } finally {
        if (!cancelled) setIsCheckingAuth(false);
      }
    }
    verifySession();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = async ({ username, password }) => {
    if (!username?.trim() || !password) {
      return { success: false, message: 'Username and password are required.' };
    }
    try {
      const res = await apiRequest('/kfc-users/login', {
        method: 'POST',
        body: JSON.stringify({ username: username.trim(), password })
      });
      if (res?.success && res?.data?.token && res?.data?.portal === 'KFC_HQ') {
        localStorage.setItem(HQ_SESSION_KEY, JSON.stringify(res.data));
        setHqUser(res.data);
        toast.success(`Welcome, ${res.data.fullName || res.data.username}!`, 'Signed In');
        return { success: true };
      }
      return { success: false, message: 'Unauthorized portal account.' };
    } catch (err) {
      const msg = err.message || 'Invalid KFC Headquarters credentials.';
      toast.error(msg, 'Authentication Failed');
      return { success: false, message: msg };
    }
  };

  return (
    <HqAuthContext.Provider value={{ hqUser, isCheckingAuth, login, logout }}>
      {children}
    </HqAuthContext.Provider>
  );
}

export function useHqAuth() {
  const ctx = useContext(HqAuthContext);
  if (!ctx) throw new Error('useHqAuth must be used within HqAuthProvider');
  return ctx;
}
