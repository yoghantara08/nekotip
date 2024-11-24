import React from 'react';

import Accordion from '@/components/ui/Accordion/Accordion';

const FAQ = () => {
  const accordionItems = [
    {
      title: 'What is NekoTip?',
      content: (
        <p>
          NekoTip is a blockchain-based donation platform built on the Internet
          Computer Protocol (ICP). It allows fans to support their favorite
          creators by donating, unlocking exclusive content, and earning rewards
          through a referral program.
        </p>
      ),
    },
    {
      title: 'How does NekoTip benefit creators?',
      content: (
        <p>
          NekoTip provides creators with tools to monetize their content
          securely and transparently, connect directly with fans, and track
          financial appreciation. Creators also receive 95% of the
          contributions, with a 5% platform fee applied to support platform
          operations.
        </p>
      ),
    },
    {
      title: 'What makes NekoTip unique?',
      content: (
        <p>
          NekoTip offers secure logins with Internet Identity, transparent
          transactions using the ICP Ledger, and a referral system that rewards
          users for bringing in new fans or creators.
        </p>
      ),
    },
    {
      title: 'Where does my support money go?',
      content: (
        <p>
          All contributions go directly to your creator’s digital wallet, held
          securely within their NekoTip account. They can access these funds at
          any time and withdraw them to any wallet or platform that supports
          crypto transactions.
        </p>
      ),
    },
    {
      title: 'Are there any fees?',
      content: (
        <p>
          NekoTip charges a small service fee of 5% for each transactions to
          support platform maintenance and development. Additionally, standard
          blockchain transaction (gas) fees may apply, depending on the network
          used.
        </p>
      ),
    },
    {
      title: 'How do I unlock exclusive content from creators?',
      content: (
        <p>
          Fans can unlock exclusive content by making a payment using ICP
          tokens. Once unlocked, the content will be available in your Neko
          Vault for future access.
        </p>
      ),
    },
    {
      title: 'How do creators withdraw funds?',
      content: (
        <div>
          <p>
            Creators can withdraw their funds by transferring the balance to
            their personal ICP wallet address.
          </p>
          <p>Simply follow these steps:</p>

          <div className="pl-4">
            <p>1. Navigate to the Wallet section on your creator dashboard.</p>
            <p>2. Enter your ICP wallet address in the withdrawal field.</p>
            <p>3. Specify the amount you'd like to withdraw.</p>
            <p>
              4. Confirm the transaction, and the funds will be securely
              transferred to your wallet.
            </p>
          </div>
          <p className="text-red-400">
            Note: Ensure you use a valid ICP wallet address to avoid transaction
            errors.
          </p>
        </div>
      ),
    },
    {
      title: 'What is the referral program?',
      content: (
        <p>
          The referral program rewards fans and creators for inviting new users
          to NekoTip. For every contribution made by a referred user, you earn
          50% of the platform fee.
        </p>
      ),
    },
    {
      title: 'Is NekoTip secure?',
      content: (
        <p>
          Yes, NekoTip uses Internet Identity for secure logins and the ICP
          Ledger for transparent and tamper-proof transactions.
        </p>
      ),
    },
  ];

  return (
    <div className="flex w-full justify-center">
      <section className="w-full max-w-[1280px] px-4 py-7 md:py-12">
        <div className="mx-auto w-full max-w-[720px]">
          <h1 className="mb-6 text-xl font-bold text-subtext lg:text-2xl">
            Frequently Asked Questions (FAQ)
          </h1>
          <Accordion items={accordionItems} />
        </div>
      </section>
    </div>
  );
};

export default FAQ;
