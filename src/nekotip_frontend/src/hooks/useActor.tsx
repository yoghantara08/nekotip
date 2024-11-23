import { Actor, HttpAgent, Identity } from '@dfinity/agent';

import { BACKEND_CANISTER_ID, DFX_NETWORK } from '@/constant/common';

import { idlFactory } from '../../../declarations/nekotip_backend';
import { _SERVICE } from '../../../declarations/nekotip_backend/nekotip_backend.did';

const useActor = () => {
  const canisterId = BACKEND_CANISTER_ID;

  const getAnonymousActor = async () => {
    const agent = await HttpAgent.create();

    return Actor.createActor(idlFactory, {
      agent,
      canisterId,
    }) as unknown as _SERVICE;
  };

  const getAuthenticatedActor = async (identity: Identity) => {
    const agent = await HttpAgent.create({
      identity,
      shouldFetchRootKey: DFX_NETWORK === 'local',
    });

    return Actor.createActor(idlFactory, {
      agent,
      canisterId,
    }) as unknown as _SERVICE;
  };

  return { getAnonymousActor, getAuthenticatedActor };
};

export default useActor;
