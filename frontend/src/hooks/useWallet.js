import { useState, useCallback } from 'react';

// Mock wallet for demo purposes
// In production, replace with @perawallet/connect
export default function useWallet() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [connecting, setConnecting] = useState(false);

  const connect = useCallback(async () => {
    setConnecting(true);
    try {
      // Check if PeraWalletConnect is available
      if (typeof window !== 'undefined' && window.PeraWalletConnect) {
        const peraWallet = new window.PeraWalletConnect();
        const accounts = await peraWallet.connect();
        if (accounts && accounts.length > 0) {
          setWalletAddress(accounts[0]);
          return accounts[0];
        }
      } else {
        // Demo mode — generate a mock Algorand address
        const mockAddr = generateMockAlgoAddress();
        setWalletAddress(mockAddr);
        return mockAddr;
      }
    } catch (error) {
      console.error('Wallet connection failed:', error);
      // If user cancelled, still provide demo mode
      if (error?.data?.type === 'CONNECT_MODAL_CLOSED') {
        console.log('User closed wallet modal');
      }
      throw error;
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setWalletAddress(null);
  }, []);

  return {
    walletAddress,
    connecting,
    connect,
    disconnect,
  };
}

function generateMockAlgoAddress() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let result = '';
  for (let i = 0; i < 58; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
