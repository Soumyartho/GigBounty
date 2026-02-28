/**
 * GigBounty — Algorand Service
 * Handles Algod client, transaction building, and submission.
 */

import algosdk from 'algosdk';

// AlgoNode TestNet (free, no token needed)
const ALGOD_SERVER = 'https://testnet-api.algonode.cloud';
const ALGOD_PORT = 443;
const ALGOD_TOKEN = '';

// Escrow wallet address — fetched from backend
let _escrowAddress = null;

/**
 * Get Algod client for TestNet
 */
export function getAlgodClient() {
  return new algosdk.Algodv2(ALGOD_TOKEN, ALGOD_SERVER, ALGOD_PORT);
}

/**
 * Fetch escrow address from backend
 */
export async function getEscrowAddress() {
  if (_escrowAddress) return _escrowAddress;

  try {
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const res = await fetch(`${apiBase}/escrow/info`);
    const data = await res.json();
    _escrowAddress = data.address;
    return _escrowAddress;
  } catch (err) {
    console.warn('Could not fetch escrow address from backend:', err);
    return null;
  }
}

/**
 * Build an unsigned payment transaction (user → escrow)
 * @param {string} senderAddr - User's wallet address
 * @param {number} amountAlgo - Amount in ALGO
 * @returns {algosdk.Transaction} Unsigned transaction
 */
export async function buildEscrowPayment(senderAddr, amountAlgo) {
  const client = getAlgodClient();
  const escrowAddr = await getEscrowAddress();

  if (!escrowAddr) {
    throw new Error('Escrow address not available');
  }

  const suggestedParams = await client.getTransactionParams().do();
  const amountMicroAlgos = Math.floor(amountAlgo * 1_000_000);

  const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: senderAddr,
    to: escrowAddr,
    amount: amountMicroAlgos,
    suggestedParams,
    note: new TextEncoder().encode('GigBounty Escrow Deposit'),
  });

  return txn;
}

/**
 * Submit a signed transaction to the network
 * @param {Uint8Array} signedTxn - Signed transaction bytes
 * @returns {string} Transaction ID
 */
export async function submitTransaction(signedTxn) {
  const client = getAlgodClient();
  const { txId } = await client.sendRawTransaction(signedTxn).do();
  
  // Wait for confirmation
  await algosdk.waitForConfirmation(client, txId, 4);
  
  return txId;
}

/**
 * Get account balance
 * @param {string} address - Algorand address
 * @returns {number} Balance in ALGO
 */
export async function getBalance(address) {
  try {
    const client = getAlgodClient();
    const info = await client.accountInformation(address).do();
    return info.amount / 1_000_000;
  } catch (err) {
    console.warn('Could not fetch balance:', err);
    return null;
  }
}
