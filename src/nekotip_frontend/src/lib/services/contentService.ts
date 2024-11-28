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
