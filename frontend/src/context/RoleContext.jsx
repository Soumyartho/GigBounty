/**
 * RoleContext — ties role (poster | acceptor) to the Pera Wallet address.
 * Fetches from backend on wallet connect. Caches in localStorage per address.
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const RoleContext = createContext(null);

const cacheKey = (address) => `gigbounty_role_${address}`;

export function RoleProvider({ children, walletAddress }) {
  const [role, setRoleState] = useState(null);
  const [loading, setLoading] = useState(false);

  // When wallet changes, load role from cache or backend
  useEffect(() => {
    if (!walletAddress) {
      setRoleState(null);
      return;
    }

    // Try localStorage cache first (instant)
    const cached = localStorage.getItem(cacheKey(walletAddress));
    if (cached === 'poster' || cached === 'acceptor') {
      setRoleState(cached);
      // Sync quietly from backend in background (don't block)
      api.getWalletRole(walletAddress)
        .then(({ role: r }) => {
          if (r === 'poster' || r === 'acceptor') {
            setRoleState(r);
            localStorage.setItem(cacheKey(walletAddress), r);
          }
        })
        .catch(() => {});
      return;
    }

    // No cache — try backend, fall back gracefully
    setLoading(true);
    api.getWalletRole(walletAddress)
      .then(({ role: r }) => {
        if (r === 'poster' || r === 'acceptor') {
          setRoleState(r);
          localStorage.setItem(cacheKey(walletAddress), r);
        } else {
          setRoleState(null);
        }
      })
      .catch(() => {
        // Backend unavailable — just show role selector
        setRoleState(null);
      })
      .finally(() => setLoading(false));
  }, [walletAddress]);

  const setRole = useCallback(async (newRole) => {
    if (!walletAddress) return;
    // ✅ Set locally FIRST — instant feedback, works even if backend is down
    localStorage.setItem(cacheKey(walletAddress), newRole);
    setRoleState(newRole);
    // Sync to backend in background (don't block on failure)
    api.setWalletRole(walletAddress, newRole)
      .catch((err) => console.warn('Role sync to backend failed (demo mode?):', err));
  }, [walletAddress]);

  const clearRole = useCallback(() => {
    if (walletAddress) localStorage.removeItem(cacheKey(walletAddress));
    setRoleState(null);
  }, [walletAddress]);

  return (
    <RoleContext.Provider value={{ role, setRole, clearRole, loading }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error('useRole must be used inside RoleProvider');
  return ctx;
}
