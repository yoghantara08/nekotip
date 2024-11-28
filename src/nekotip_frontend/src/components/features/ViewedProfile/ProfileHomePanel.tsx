import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Button from '@/components/ui/Button/Button';
import { CustomTextarea } from '@/components/ui/Input/CustomTextarea';
import { useAuthManager } from '@/store/AuthProvider';

import {
  Transaction,
  User,
} from '../../../../../declarations/nekotip_backend/nekotip_backend.did';

import DonateModal from './DonateModal';
import SupportMessage from './SupportMessage';

// public type Transaction = {
//   id : Text;
//   from : Principal;
//   to : Principal;
//   amount : Nat;
//   transactionType : TransactionType;
//   txStatus : TxStatus;
//   contentId : ?Text;
//   supportComment : ?Text;
//   platformFee : Nat;
//   referralFee : ?Nat;
//   timestamp : Int;
// };

const ProfileHomePanel = ({ viewedUser }: { viewedUser: User }) => {
  const { actor } = useAuthManager();

  const [supportComment, setSupportComment] = useState('');
  const [supporters, setSupporters] = useState<Transaction[]>([]);
  const [openDonateModal, setOpenDonateModal] = useState(false);

  const validSocials = Object.entries(viewedUser.socials).filter(
    ([, value]) => value.length > 0,
  );

  useEffect(() => {
    const fetchSupporters = async () => {
      try {
        if (!actor) return;
        const result = await actor.getReceivedDonations(viewedUser.id);

        if (result && supporters.length === 0) {
          setSupporters(result);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchSupporters();
  }, [actor, supporters.length, viewedUser.id]);

  return (
    <div className="flex flex-col justify-between gap-6 md:flex-row">
      <div className="w-full">
        <CustomTextarea
          placeholder="Support message"
          value={supportComment}
          onChange={(e) => setSupportComment(e.target.value)}
          maxLength={200}
          textareaClassName="h-[100px] text-sm md:text-base"
        />
        <Button
          variant="secondary"
          className="mt-3 w-full"
          shadow={false}
          onClick={() => setOpenDonateModal(true)}
          disabled={supportComment.length === 0}
        >
          Send Support
        </Button>
        <div className="mt-7 flex flex-wrap gap-6 md:mt-9">
          {supporters.length > 0 &&
            supporters.map((support) => (
              <SupportMessage key={support.id} support={support} />
            ))}
        </div>
      </div>
      <div className="w-full max-w-[500px] md:space-y-6">
        <div className="hidden md:block">
          <h3 className="text-lg font-semibold text-title">About</h3>
          <div className="mt-2 text-caption">
            <span>{viewedUser.bio[0] || 'This user has no bio yet.'}</span>
          </div>
          <Link
            to={`/explore/${viewedUser.categories.toLocaleString().toLowerCase()}`}
            className="mt-4 block w-fit rounded-lg border px-4 py-2 font-medium hover:bg-mainAccent/30"
          >
            {viewedUser.categories}
          </Link>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-title">Socials & Links</h3>
          <div className="mt-3 space-y-2">
            {validSocials.map(([key, value]) => (
              <div
                key={key}
                className="flex items-center gap-2 rounded-md border px-4 py-2"
              >
                {key}: {value[0]}
              </div>
            ))}
          </div>
        </div>
      </div>

      <DonateModal
        to={viewedUser}
        isOpen={openDonateModal}
        onClose={() => setOpenDonateModal(false)}
        supportComment={supportComment}
      />
    </div>
  );
};

export default ProfileHomePanel;
