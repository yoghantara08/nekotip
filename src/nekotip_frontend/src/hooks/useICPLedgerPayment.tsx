import { HttpAgent } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import { AccountIdentifier, LedgerCanister } from '@dfinity/ledger-icp';
import { Principal } from '@dfinity/principal';

import { DFX_NETWORK } from '@/constant/common';

const useICPLedgerPayment = () => {
  const transferICP = async (
    recipientPrincipal: Principal, // Destination canister
    amount: bigint, // Amount in e8s (1 ICP = 100,000,000 e8s)
  ) => {
    try {
      const authClient = await AuthClient.create();
      const isAuthenticated = await authClient.isAuthenticated();

      if (!isAuthenticated) {
        throw new Error('User not authenticated');
      }

      const identity = authClient.getIdentity();

      const agent = await HttpAgent.create({
        identity,
        shouldFetchRootKey: DFX_NETWORK === 'local',
        verifyQuerySignatures: false,
      });

      // Create a Ledger Canister instance
      const ledger = LedgerCanister.create({
        agent: agent,
        canisterId: Principal.fromText('ryjl3-tyaaa-aaaaa-aaaba-cai'), // Ledger Canister ID
      });

      const accountIdentifier = AccountIdentifier.fromPrincipal({
        principal: recipientPrincipal,
        subAccount: undefined,
      });

      const transactionFee = await ledger.transactionFee();

      if (!transactionFee) {
        throw new Error('Failed to get transaction fee');
      }

      // Perform the transfer
      const transferResult = await ledger.transfer({
        to: accountIdentifier,
        amount: amount,
        fee: transactionFee,
        memo: 0n, // Optional memo field
      });

      console.log('Transfer result:', transferResult);
      return transferResult;
    } catch (error) {
      console.error('Transfer failed:', error);
      throw error;
    }
  };

  return { transferICP };
};

export default useICPLedgerPayment;
