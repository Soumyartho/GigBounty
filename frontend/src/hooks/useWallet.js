import { useState, useCallback, useEffect, useRef } from 'react';
import { PeraWalletConnect } from '@perawallet/connect';

// Singleton wallet instance
const peraWallet = new PeraWalletConnect();

export default function useWallet() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const reconnectChecked = useRef(false);

  // Check for existing session on mount
  useEffect(() => {
    if (reconnectChecked.current) return;
    reconnectChecked.current = true;

    peraWallet.reconnectSession()
      .then((accounts) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          peraWallet.connector?.on('disconnect', handleDisconnect);
        }
      })
      .catch(() => {
        // No existing session
      });
  }, []);

  const handleDisconnect = useCallback(() => {
    setWalletAddress(null);
  }, []);

  const connect = useCallback(async () => {
    setConnecting(true);
    try {
      const accounts = await peraWallet.connect();

      if (accounts && accounts.length > 0) {
        setWalletAddress(accounts[0]);
        peraWallet.connector?.on('disconnect', handleDisconnect);
        return accounts[0];
      }
    } catch (error) {
      // User closed modal or Pera unavailable — fall back to mock
      if (error?.data?.type === 'CONNECT_MODAL_CLOSED') {
        console.log('User closed Pera modal');
        throw error;
      }

      console.warn('Pera Wallet not available, using mock wallet');
      const mockAddr = generateMockAlgoAddress();
      setWalletAddress(mockAddr);
      return mockAddr;
    } finally {
      setConnecting(false);
    }
  }, [handleDisconnect]);

  const disconnect = useCallback(async () => {
    try {
      await peraWallet.disconnect();
    } catch (err) {
      // Ignore disconnect errors
    }
    setWalletAddress(null);
  }, []);

  /**
   * Sign a transaction using Pera Wallet
   * @param {import('algosdk').Transaction[]} txns - Array of transactions to sign
   * @returns {Uint8Array[]} Signed transaction bytes
   */
  const signTransactions = useCallback(async (txns) => {
    const txGroups = txns.map((txn) => ({
      txn,
      signers: [walletAddress],
    }));

    const signedTxns = await peraWallet.signTransaction([txGroups]);
    return signedTxns;
  }, [walletAddress]);

  return {
    walletAddress,
    connecting,
    connect,
    disconnect,
    signTransactions,
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
