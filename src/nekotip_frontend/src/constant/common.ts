import { canisterId as CANISTER_ID_INTERNET_IDENTITY } from '../../../declarations/internet_identity';
import { canisterId as CANISTER_ID_BACKEND } from '../../../declarations/nekotip_backend';

export const DFX_NETWORK = import.meta.env.VITE_DFX_NETWORK || 'local';

export const INTERNET_IDENTITY_URL =
  DFX_NETWORK === 'local'
    ? `http://${CANISTER_ID_INTERNET_IDENTITY}.localhost:4943/`
    : `https://identity.ic0.app`;

export const BACKEND_CANISTER_ID = CANISTER_ID_BACKEND || '';

export const CATEGORIES = [
  'Cosplay',
  'Streaming',
  'Gaming',
  'Art',
  'Entertainment',
  'Commisions',
  'Music',
  'Writing',
  'Cooking',
  'Tech',
  'Fashion',
  'Photography',
  'Travel',
  'DIY',
  'Education',
  'Lifestyle',
  'News',
  'Other',
];
