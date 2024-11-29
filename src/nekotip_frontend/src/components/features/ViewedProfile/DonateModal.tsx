import React, { useCallback, useEffect, useState } from 'react';

import Button from '@/components/ui/Button/Button';
import { CustomInput } from '@/components/ui/Input/CustomInput';
import ModalCustom from '@/components/ui/Modal/ModalCustom';
import useICP from '@/hooks/useICP';
import useUser from '@/hooks/useUser';
import { convertToE8s, convertToICP } from '@/lib/utils';
import { useAuthManager } from '@/store/AuthProvider';

import { User } from '../../../../../declarations/nekotip_backend/nekotip_backend.did';

interface DonateModalProps {
  to: User;
  supportComment: string;
  isOpen: boolean;
  onClose: () => void;
  fetchSupporters: () => Promise<void>;
  setSupportComment: React.Dispatch<React.SetStateAction<string>>;
}

const DonateModal = ({
  isOpen,
  onClose,
  supportComment,
  to,
  fetchSupporters,
  setSupportComment,
}: DonateModalProps) => {
  const { actor } = useAuthManager();
  const { transferICP } = useICP();
  const { getICPBalance } = useUser();

  const [amount, setAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [balance, setBalance] = useState('0');

  useEffect(() => {
    getICPBalance().then((result) => {
      setBalance(convertToICP(parseInt(result.toString())).toString());
    });
  }, [getICPBalance]);

  const resetModal = useCallback(() => {
    setAmount(0);
    setIsLoading(false);
    onClose();
    setSupportComment('');
  }, [onClose, setSupportComment]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setAmount(isNaN(value) ? 0 : value);
  };

  const validateDonation = () => {
    if (!actor) {
      alert('Please connect your wallet');
      return false;
    }
    if (amount <= 0) {
      alert('Donation amount must be greater than 0');
      return false;
    }

    return true;
  };

  const handleDonation = async () => {
    // Validate inputs before proceeding
    if (!validateDonation() || !actor) return;

    setIsLoading(true);

    try {
      const amountInE8s = BigInt(convertToE8s(amount));

      // Create donation transaction
      const donateTxResult = await actor.createDonateTx(to.id, amountInE8s, [
        supportComment,
      ]);

      if ('ok' in donateTxResult) {
        // Transfer ICP to the user's canister
        const transferResult = await transferICP(
          donateTxResult.ok.to,
          amountInE8s,
        );

        if (transferResult) {
          // Finalize donation transaction
          const updateBalanceResult = await actor.finalizeDonateTx(
            donateTxResult.ok.id,
            { completed: null },
          );

          if ('ok' in updateBalanceResult) {
            alert('Donation successful!');
            await fetchSupporters();
            resetModal();
            return;
          } else {
            throw new Error(updateBalanceResult.err);
          }
        } else {
          throw new Error('Failed to transfer ICP');
        }
      } else {
        throw new Error(donateTxResult.err);
      }
    } catch (error) {
      console.error('Donation error:', error);
      alert(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalCustom
      title={`Support ${to.name}`}
      isOpen={isOpen}
      onClose={resetModal}
      className="max-w-[600px]"
      disableClose={isLoading}
    >
      <div className="space-y-4 p-4">
        <div>
          <label
            htmlFor="donationAmount"
            className="block text-lg font-medium text-subtext"
          >
            Donation Amount (ICP)
          </label>
          {balance && (
            <p className="mb-3 text-subtext">Your balance: {balance} ICP</p>
          )}
          <CustomInput
            id="donationAmount"
            type="number"
            value={amount > 0 ? amount : ''}
            onChange={handleAmountChange}
            placeholder="Enter donation amount"
            min="0"
            step="0.1"
          />
        </div>

        <div className="mt-4 flex justify-end space-x-2">
          <Button
            onClick={handleDonation}
            disabled={isLoading || amount <= 0 || amount > parseFloat(balance)}
            variant="secondary"
            className="w-full"
          >
            {isLoading ? 'Processing...' : 'Donate'}
          </Button>
        </div>
      </div>
    </ModalCustom>
  );
};

export default DonateModal;
