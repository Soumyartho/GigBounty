/**
 * RoleContext — session-first role system.
 * Flow: Choose role FIRST → then connect wallet → session locked until disconnect.
 * Role is stored in localStorage immediately (no wallet needed to pick).
 * On wallet connect, role syncs to backend.
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const RoleContext = createContext(null);

const SESSION_ROLE_KEY = 'gigbounty_session_role';
const walletRoleKey = (addr) => `gigbounty_role_${addr}`;

export function RoleProvider({ children, walletAddress }) {
  const [role, setRoleState] = useState(() => {
    // On mount, check if there's a session role already picked
    return localStorage.getItem(SESSION_ROLE_KEY) || null;
  });
  const [loading, setLoading] = useState(false);

  // When wallet connects and role exists, sync to backend
  useEffect(() => {
    if (!walletAddress || !role) return;

    // Sync current session role to backend (fire-and-forget)
    api.setWalletRole(walletAddress, role)
      .catch(() => {});
  }, [walletAddress, role]);

  /**
   * Set role — works without wallet. Stores immediately.
   */
  const setRole = useCallback((newRole) => {
    if (newRole !== 'poster' && newRole !== 'acceptor') return;
    localStorage.setItem(SESSION_ROLE_KEY, newRole);
    setRoleState(newRole);

    // If wallet is already connected, sync to backend too
    if (walletAddress) {
      api.setWalletRole(walletAddress, newRole)
        .catch((err) => console.warn('Role sync failed:', err));
    }
  }, [walletAddress]);

  /**
   * Clear role — resets session. Called on wallet disconnect or manual switch.
   */
  const clearRole = useCallback(() => {
    localStorage.removeItem(SESSION_ROLE_KEY);
    if (walletAddress) localStorage.removeItem(walletRoleKey(walletAddress));
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
