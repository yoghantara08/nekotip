import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '@/components/ui/Button/Button';
import ModalCustom from '@/components/ui/Modal/ModalCustom';
import useICP from '@/hooks/useICP';
import useUser from '@/hooks/useUser';
import {
  convertToE8s,
  convertToICP,
  convertUsdToIcp,
  getDollarValueFromTier,
} from '@/lib/utils';
import { useAuthManager } from '@/store/AuthProvider';

interface UnlockContentModalProps {
  contentId: string;
  isOpen: boolean;
  onClose: () => void;
  tier: string;
  thumbnail: string;
  title: string;
}

const UnlockContentModal: React.FC<UnlockContentModalProps> = ({
  contentId,
  isOpen,
  onClose,
  tier,
  thumbnail,
  title,
}) => {
  const { actor } = useAuthManager();
  const { transferICP, icpPrice } = useICP();
  const { getICPBalance } = useUser();
  const navigate = useNavigate();

  const [balance, setBalance] = useState<string>('0');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const usdAmount = getDollarValueFromTier(tier);
  const icpAmount = convertUsdToIcp(usdAmount, icpPrice);

  useEffect(() => {
    getICPBalance().then((result) => {
      setBalance(convertToICP(parseInt(result.toString())).toString());
    });
  }, [getICPBalance]);

  const handleUnlock = async () => {
    if (!actor) return;

    try {
      setIsLoading(true);
      const amountInE8s = BigInt(convertToE8s(icpAmount));

      // Create unlock content transaction
      const unlockTxResult = await actor.createContentUnlockTx(
        contentId,
        amountInE8s,
      );

      if ('ok' in unlockTxResult) {
        // Transfer ICP to the user's canister
        const transferResult = await transferICP(
          unlockTxResult.ok.to,
          amountInE8s,
        );

        if (transferResult) {
          // Finalize unlock content transaction
          const updateBalanceResult = await actor.finalizeContentUnlockTx(
            unlockTxResult.ok.id,
            { completed: null },
          );

          if ('ok' in updateBalanceResult) {
            navigate(`/creator/content/${contentId}`);
            return;
          } else {
            throw new Error(updateBalanceResult.err);
          }
        } else {
          throw new Error('Failed to transfer ICP');
        }
      } else {
        throw new Error(unlockTxResult.err);
      }
    } catch (error) {
      console.error('Unlock content error:', error);
      alert(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalCustom
      title={`Unlock Exclusive Content`}
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[600px] text-subtext"
      disableClose={isLoading}
    >
      <div className="px-4 py-3">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="font-medium text-muted-foreground">
            Unlock Price: <span className="text-lg">${usdAmount}</span> or{' '}
            <span className="text-lg">{icpAmount} ICP</span>
          </p>
        </div>

        <img
          src={thumbnail}
          alt={title}
          className="mb-4 max-h-36 w-full rounded-lg object-cover"
        />

        <Button
          variant="secondary"
          className="mb-3 w-full"
          shadow={false}
          disabled={parseFloat(balance) < icpAmount || isLoading}
          onClick={handleUnlock}
        >
          {isLoading ? (
            'Unlocking...'
          ) : (
            <>Pay with ICP (Balance: {parseFloat(balance).toFixed(2)} ICP)</>
          )}
        </Button>
      </div>
    </ModalCustom>
  );
};

export default UnlockContentModal;
