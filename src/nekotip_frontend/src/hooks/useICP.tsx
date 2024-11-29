import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { HttpAgent } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import { AccountIdentifier, LedgerCanister } from '@dfinity/ledger-icp';
import { Principal } from '@dfinity/principal';
import axios from 'axios';

import { DFX_NETWORK } from '@/constant/common';
import { RootState } from '@/store';
import { setIcpPrice } from '@/store/reducers/userSlice';

import { _SERVICE } from '../../../declarations/nekotip_backend/nekotip_backend.did';

const useICP = () => {
  const { icpPrice } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const [isFetchingPrice, setIsFetchingPrice] = useState(false);
  const [lastFetchTimestamp, setLastFetchTimestamp] = useState<number | null>(
    null,
  );

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

  const fetchIcpUsdPriceBackend = useCallback(
    async (actor: _SERVICE) => {
      if (icpPrice || isFetchingPrice) {
        return icpPrice;
      }

      const currentTime = Date.now();
      if (lastFetchTimestamp && currentTime - lastFetchTimestamp < 1000) {
        return icpPrice;
      }

      try {
        setIsFetchingPrice(true);

        const response = await actor.getIcpUsdRate();
        const price = JSON.parse(response)['internet-computer'].usd;

        dispatch(setIcpPrice(price));
        setLastFetchTimestamp(currentTime);

        return price;
      } catch (error) {
        console.error('Failed to fetch ICP price:', error);
        throw error;
      } finally {
        setIsFetchingPrice(false);
      }
    },
    [dispatch, icpPrice, isFetchingPrice, lastFetchTimestamp],
  );

  const fetchIcpUsdPrice = async () => {
    try {
      console.log('Fetching ICP price');

      const response = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price?ids=internet-computer&vs_currencies=usd',
      );
      const price = response.data['internet-computer'].usd;

      dispatch(setIcpPrice(price));

      return price;
    } catch (error) {
      console.error('Failed to fetch ICP price', error);
      return icpPrice;
    }
  };

  return { transferICP, fetchIcpUsdPrice, icpPrice, fetchIcpUsdPriceBackend };
};

export default useICP;
