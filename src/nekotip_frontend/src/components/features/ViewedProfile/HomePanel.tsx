import React from 'react';
import { Link } from 'react-router-dom';

import Button from '@/components/ui/Button/Button';
import { CustomTextarea } from '@/components/ui/Input/CustomTextarea';

import { User } from '../../../../../declarations/nekotip_backend/nekotip_backend.did';

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

const HomePanel = ({ user }: { user: User }) => {
  const validSocials = Object.entries(user.socials).filter(
    ([, value]) => value.length > 0,
  );

  return (
    <div className="flex flex-col justify-between gap-6 md:flex-row">
      <div className="w-full">
        <CustomTextarea
          placeholder="Support message"
          maxLength={200}
          textareaClassName="h-[100px] text-sm md:text-base"
        />
        <Button variant="secondary" className="mt-3 w-full" shadow={false}>
          Send Support
        </Button>
        <div className="mt-7 space-y-3 md:mt-9">
          <div className="flex gap-3">
            <img
              src="/images/user-default.svg"
              alt="profilepicture"
              className="size-12 rounded-full border"
            />
            <div className="">
              <div className="flex items-center gap-1">
                <p className="font-semibold">User Name</p>
                <span>has sent</span>
                <span>3 ICP</span>
              </div>
              <p>10 November 2024</p>
              <p className="mt-2 border px-3 py-2 text-sm font-medium shadow-hover md:text-base">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full max-w-[500px] md:space-y-6">
        <div className="hidden md:block">
          <h3 className="text-lg font-semibold text-title">About</h3>
          <div className="mt-2 text-caption">
            <span>{user.bio[0] || 'This user has no bio yet.'}</span>
          </div>
          <Link
            to={`/explore/${user.categories.toLocaleString().toLowerCase()}`}
            className="mt-4 block w-fit rounded-lg border px-4 py-2 font-medium hover:bg-mainAccent/30"
          >
            {user.categories}
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
    </div>
  );
};

export default HomePanel;
