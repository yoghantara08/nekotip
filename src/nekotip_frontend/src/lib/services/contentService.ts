import { Principal } from '@dfinity/principal';

import { _SERVICE } from '../../../../declarations/nekotip_backend/nekotip_backend.did';

export const fetchCreatorContentPreview = async (
  actor: _SERVICE,
  creatorId: Principal,
  setContents: any,
) => {
  try {
    const contents = await actor.getCreatorContentPreview(
      creatorId ?? Principal.fromText(''),
    );

    setContents(contents ?? []);
  } catch (error) {
    console.error('Error fetching content:', error);
  }
};

export const fetchAllContentPreview = async (
  actor: _SERVICE,
  setContents: any,
) => {
  try {
    const contents = await actor.getAllContentPreviews();

    setContents(contents ?? []);
  } catch (error) {
    console.error('Error fetching content:', error);
  }
};
