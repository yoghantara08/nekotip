import Types "../types/Types";
import Result "mo:base/Result";
import Option "mo:base/Option";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Error "mo:base/Error";
import Nat64 "mo:base/Nat64";
import Nat "mo:base/Nat";
import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Order "mo:base/Order";
import Int "mo:base/Int";

import IcpLedger "canister:icp_ledger_canister";
import UserService "UserService";
import Utils "../utils/Utils";

module {
  // CREATE DONATION TRANSACTION
  public func createDonateTx(
    transactions : Types.Transactions,
    users : Types.Users,
    from : Principal,
    to : Principal,
    amount : Nat,
    supportComment : ?Text,
  ) : async Result.Result<Types.Transaction, Text> {
    let sender = users.get(from);
    let recipient = users.get(to);
    let balance = await UserService.getAccountBalance(from);

    // Validate input
    if (Principal.isAnonymous(from)) {
      return #err("Anonymous principals cannot make donations");
    };

    // Check valid user
    switch (sender, recipient) {
      case (null, _) { return #err("Sender not found") };
      case (_, null) { return #err("Recipient not found") };
      case (?toUser, ?_fromUser) {

        // Check sender balance
        if (balance < amount) {
          return #err("Insufficient ICP balance");
        };

        var platformFee = Utils.calculatePlatformFee(amount);
        var referralFee = 0;
        if (toUser.referredBy != null) {
          referralFee := Utils.calculateReferralPayout(platformFee);
          platformFee -= referralFee;
        };
        let netAmount = Nat.sub(amount, platformFee);

        // Generate unique transaction ID
        let transactionId = Utils.generateUUID(from, Option.get(supportComment, "0"));

        // Create transaction record
        let newTransaction : Types.Transaction = {
          id = transactionId;
          from = from;
          to = to;
          amount = netAmount;
          transactionType = #donation;
          txStatus = #pending;
          contentId = null;
          supportComment = supportComment;
          platformFee = platformFee;
          referralFee = ?referralFee;
          timestamp = Time.now();
        };

        // Store transaction
        transactions.put(transactionId, newTransaction);

        #ok(newTransaction);
      };
    };
  };

  // FINALIZE THE DONATE TRANSACTION AFTER FRONTEND TRANSFER COMPLETE
  // change status, update user balance and track referrals, update platform balance
  public func finalizeDonateTx(
    transactions : Types.Transactions,
    users : Types.Users,
    userBalances : Types.UserBalances,
    platformBalance : Types.PlatformBalance,
    transactionId : Text,
    status : Types.TxStatus,
  ) : async Result.Result<Types.Transaction, Text> {
    switch (transactions.get(transactionId)) {
      case (null) { #err("Transaction not found") };
      case (?transaction) {
        if (transaction.txStatus == #completed or transaction.txStatus == #failed) {
          return #err("Transaction already processed");
        };

        // Update transaction status
        let updatedTransaction = {
          transaction with
          txStatus = status;
        };
        transactions.put(transactionId, updatedTransaction);

        switch (status) {
          case (#completed) {
            try {
              // Update recipient balance
              ignore updateUserBalance(userBalances, transaction.to, transaction.amount, #add);

              // Update platform balance
              ignore updatePlatformBalance(
                platformBalance,
                transaction.amount,
                transaction.platformFee,
                transaction.referralFee,
                #add,
              );

              // Handle referral payment if exists
              switch (transaction.referralFee, users.get(transaction.to)) {
                case (null, _) {};
                case (_, null) {};
                case (?refFee, ?toUser) {
                  switch (toUser.referredBy) {
                    case (null) {};
                    case (?referrer) {
                      ignore updateUserBalance(userBalances, referrer, refFee, #add);
                    };
                  };
                };
              };

              #ok(updatedTransaction);
            } catch (e) {
              // Revert transaction status if any balance update fails
              let failedTx = {
                transaction with
                txStatus = #failed;
              };
              transactions.put(transactionId, failedTx);
              #err("Failed to process transaction: " # Error.message(e));
            };
          };
          case (#failed) {
            #ok(updatedTransaction);
          };
          case (#pending) {
            #err("Cannot update to pending status");
          };
        };
      };
    };
  };

  // CREATE CONTENT UNLOCK TRANSACTION
  public func createContentUnlockTx(
    transactions : Types.Transactions,
    contents : Types.Contents,
    users : Types.Users,
    from : Principal,
    contentId : Text,
    amount : Nat,
  ) : async Result.Result<Types.Transaction, Text> {

    // Validate input
    if (Principal.isAnonymous(from)) {
      return #err("Anonymous principals cannot unlock content");
    };

    let sender = users.get(from);
    let balance = await UserService.getAccountBalance(from);

    // Get content and validate
    switch (contents.get(contentId), sender) {
      case (null, _) { return #err("Content not found") };
      case (_, null) { return #err("Sender not found") };
      case (?content, ?sender) {
        // Check if content is already unlocked
        let isUnlocked = Array.find<Principal>(
          content.unlockedBy,
          func(p) { Principal.equal(p, from) },
        );
        if (isUnlocked != null) {
          return #err("Content already unlocked");
        };

        // Check sender balance
        if (balance < amount) {
          return #err("Insufficient ICP balance");
        };

        var platformFee = Utils.calculatePlatformFee(amount);
        var referralFee = 0;
        // Check if content creator has a referrer
        switch (users.get(content.creatorId)) {
          case (?creator) {
            if (creator.referredBy != null) {
              referralFee := Utils.calculateReferralPayout(platformFee);
              platformFee -= referralFee;
            };
          };
          case (null) { return #err("Content creator not found") };
        };

        let netAmount = Nat.sub(amount, platformFee);

        // Generate transaction ID
        let transactionId = Utils.generateUUID(from, contentId);

        // Create transaction record
        let newTransaction : Types.Transaction = {
          id = transactionId;
          from = sender.id;
          to = content.creatorId;
          amount = netAmount;
          transactionType = #contentPurchase;
          txStatus = #pending;
          contentId = ?contentId;
          supportComment = null;
          platformFee = platformFee;
          referralFee = ?referralFee;
          timestamp = Time.now();
        };

        // Store transaction
        transactions.put(transactionId, newTransaction);
        #ok(newTransaction);
      };
    };
  };

  // FINALIZE THE CONTENT UNLOCK TRANSACTION AFTER FRONTEND TRANSFER COMPLETE
  public func finalizeContentUnlockTx(
    transactions : Types.Transactions,
    contents : Types.Contents,
    users : Types.Users,
    userBalances : Types.UserBalances,
    platformBalance : Types.PlatformBalance,
    transactionId : Text,
    status : Types.TxStatus,
  ) : async Result.Result<Types.Transaction, Text> {
    switch (transactions.get(transactionId)) {
      case (null) { #err("Transaction not found") };
      case (?transaction) {
        if (transaction.txStatus == #completed or transaction.txStatus == #failed) {
          return #err("Transaction already processed");
        };

        // Update transaction status
        let updatedTransaction = {
          transaction with
          txStatus = status;
        };
        transactions.put(transactionId, updatedTransaction);

        switch (transaction.contentId) {
          case (null) { return #err("Invalid content transaction") };
          case (?contentId) {
            switch (status) {
              case (#completed) {
                try {
                  // Update creator's balance
                  ignore updateUserBalance(userBalances, transaction.to, transaction.amount, #add);

                  // Update platform balance
                  ignore updatePlatformBalance(
                    platformBalance,
                    transaction.amount,
                    transaction.platformFee,
                    transaction.referralFee,
                    #add,
                  );

                  // Handle referral payment if exists
                  switch (transaction.referralFee, users.get(transaction.to)) {
                    case (null, _) {};
                    case (_, null) {};
                    case (?refFee, ?toUser) {
                      switch (toUser.referredBy) {
                        case (null) {};
                        case (?referrer) {
                          ignore updateUserBalance(userBalances, referrer, refFee, #add);
                        };
                      };
                    };
                  };

                  // Update content's unlockedBy array
                  switch (contents.get(contentId)) {
                    case (null) { return #err("Content not found") };
                    case (?content) {
                      let updatedContent = {
                        content with
                        unlockedBy = Array.append(content.unlockedBy, [transaction.from]);
                        updatedAt = ?Time.now();
                      };
                      contents.put(contentId, updatedContent);
                    };
                  };

                  #ok(updatedTransaction);
                } catch (e) {
                  // Revert transaction status if any update fails
                  let failedTx = {
                    transaction with
                    txStatus = #failed;
                  };
                  transactions.put(transactionId, failedTx);
                  #err("Failed to process transaction: " # Error.message(e));
                };
              };
              case (#failed) {
                #ok(updatedTransaction);
              };
              case (#pending) {
                #err("Cannot update to pending status");
              };
            };
          };
        };
      };
    };
  };

  public func withdraw(
    transactions : Types.Transactions,
    userBalances : Types.UserBalances,
    platformBalance : Types.PlatformBalance,
    userId : Principal,
    amount : Nat64,
  ) : async Result.Result<Types.Transaction, Text> {
    // Validate amount
    if (amount == 0) {
      return #err("Withdrawal amount must be greater than 0");
    };

    // Check minimum withdrawal amount (e.g., 0.01 ICP = 10_000 e8s)
    if (amount < 10_000) {
      return #err("Withdrawal amount must be at least 0.01 ICP");
    };

    // Check maximum withdrawal amount
    let maxWithdrawal : Nat64 = 1_000_000_000_000; // 10,000 ICP
    if (amount > maxWithdrawal) {
      return #err("Withdrawal amount exceeds maximum limit");
    };

    // Check if user has any pending withdrawals
    for ((_, tx) in transactions.entries()) {
      if (tx.from == userId and tx.transactionType == #withdrawal and tx.txStatus == #pending) {
        return #err("User has a pending withdrawal");
      };
    };

    // Check withdrawal frequency (e.g., last withdrawal timestamp)
    let lastWithdrawal = getLastWithdrawal(userId, transactions);
    switch (lastWithdrawal) {
      case (?tx) {
        let timeSinceLastWithdrawal = Time.now() - tx.timestamp;
        let minimumTimeBetweenWithdrawals = 1_800_000_000_000; // 30 minutes in nanoseconds
        if (timeSinceLastWithdrawal < minimumTimeBetweenWithdrawals) {
          return #err("Please wait before making another withdrawal");
        };
      };
      case (null) {};
    };

    // Check if user has sufficient balance
    switch (userBalances.get(userId)) {
      case (null) { #err("User has no balance") };
      case (?balance) {
        let totalAmount = amount + 10_000;
        if (balance.balance < Nat64.toNat(totalAmount)) {
          return #err("Insufficient balance (including transaction fees)");
        };

        let txId = Utils.generateUUID(userId, "withdrawal");
        let withdrawalTx : Types.Transaction = {
          id = txId;
          from = userId;
          to = userId;
          amount = Nat64.toNat(amount);
          transactionType = #withdrawal;
          txStatus = #pending;
          contentId = null;
          supportComment = null;
          platformFee = 0;
          referralFee = null;
          timestamp = Time.now();
        };

        transactions.put(txId, withdrawalTx);

        try {
          // First update the balances before making the transfer
          // This ensures we don't transfer funds if balance updates fail

          // 1. Update user balance
          let balanceResult = updateUserBalance(
            userBalances,
            userId,
            Nat64.toNat(totalAmount),
            #sub,
          );

          switch (balanceResult) {
            case (#err(e)) {
              // If balance update fails, mark transaction as failed
              let failedTx = {
                withdrawalTx with
                txStatus = #failed;
              };
              transactions.put(txId, failedTx);
              return #err("Failed to update user balance: " # e);
            };
            case (#ok()) {
              // 2. Substract from platform balance
              let platformBalanceResult = updatePlatformBalance(
                platformBalance,
                Nat64.toNat(totalAmount),
                0,
                null,
                #sub,
              );

              switch (platformBalanceResult) {
                case (#err(e)) {
                  // If platform balance update fails, revert user balance
                  ignore updateUserBalance(
                    userBalances,
                    userId,
                    Nat64.toNat(totalAmount),
                    #add,
                  );

                  let failedTx = {
                    withdrawalTx with
                    txStatus = #failed;
                  };
                  transactions.put(txId, failedTx);
                  return #err("Failed to update platform balance: " # e);
                };
                case (#ok()) {
                  // 3. Only proceed with transfer after all balance updates are successful
                  let transferResult = await transfer(amount, userId);

                  switch (transferResult) {
                    case (#ok(_blockIndex)) {
                      // Transfer successful, update transaction status
                      let completedTx = {
                        withdrawalTx with
                        txStatus = #completed;
                      };
                      transactions.put(txId, completedTx);
                      #ok(completedTx);
                    };
                    case (#err(e)) {
                      // Transfer failed, need to rollback all balance changes

                      // Rollback user balance
                      ignore updateUserBalance(
                        userBalances,
                        userId,
                        Nat64.toNat(totalAmount),
                        #add,
                      );

                      // Rollback platform balance (add back the balance)
                      ignore updatePlatformBalance(
                        platformBalance,
                        Nat64.toNat(totalAmount),
                        0,
                        null,
                        #add,
                      );

                      let failedTx = {
                        withdrawalTx with
                        txStatus = #failed;
                      };
                      transactions.put(txId, failedTx);
                      #err("Transfer failed, changes rolled back: " # e);
                    };
                  };
                };
              };
            };
          };
        } catch (e) {
          // For unexpected errors, attempt to rollback any changes
          ignore updateUserBalance(
            userBalances,
            userId,
            Nat64.toNat(totalAmount),
            #add,
          );

          ignore updatePlatformBalance(
            platformBalance,
            Nat64.toNat(totalAmount),
            0,
            null,
            #add,
          );

          let failedTx = {
            withdrawalTx with
            txStatus = #failed;
          };
          transactions.put(txId, failedTx);
          #err("Unexpected error, changes rolled back: " # Error.message(e));
        };
      };
    };
  };

  // Get all donations received by a user
  public func getReceivedDonations(
    transactions : Types.Transactions,
    userId : Principal,
  ) : [Types.Transaction] {
    let txArr = Buffer.Buffer<Types.Transaction>(0);

    for ((_, tx) in transactions.entries()) {
      if (tx.to == userId and tx.transactionType == #donation and tx.txStatus == #completed) {
        txArr.add(tx);
      };
    };

    let sorted = Array.sort<Types.Transaction>(
      Buffer.toArray(txArr),
      func(a : Types.Transaction, b : Types.Transaction) : Order.Order {
        Int.compare(b.timestamp, a.timestamp);
      },
    );
    sorted;
  };

  // Get all donations given by a user
  public func getGivenDonations(
    transactions : Types.Transactions,
    userId : Principal,
  ) : [Types.Transaction] {
    let txArr = Buffer.Buffer<Types.Transaction>(0);

    for ((_, tx) in transactions.entries()) {
      if (tx.from == userId and tx.transactionType == #donation and tx.txStatus == #completed) {
        txArr.add(tx);
      };
    };

    let sorted = Array.sort<Types.Transaction>(
      Buffer.toArray(txArr),
      func(a : Types.Transaction, b : Types.Transaction) : Order.Order {
        Int.compare(b.timestamp, a.timestamp);
      },
    );
    sorted;
  };

  // Get all withdrawals by a user
  public func getWithdrawals(
    transactions : Types.Transactions,
    userId : Principal,
  ) : [Types.Transaction] {
    let txArr = Buffer.Buffer<Types.Transaction>(0);

    for ((_, tx) in transactions.entries()) {
      if (tx.from == userId and tx.transactionType == #withdrawal) {
        txArr.add(tx);
      };
    };

    let sorted = Array.sort<Types.Transaction>(
      Buffer.toArray(txArr),
      func(a : Types.Transaction, b : Types.Transaction) : Order.Order {
        Int.compare(b.timestamp, a.timestamp);
      },
    );
    sorted;
  };

  // Get all referral earnings for a user
  public func getReferralEarnings(
    transactions : Types.Transactions,
    userId : Principal,
  ) : [Types.Transaction] {
    let txArr = Buffer.Buffer<Types.Transaction>(0);

    for ((_, tx) in transactions.entries()) {
      if (tx.to == userId and tx.transactionType == #referralPayout and tx.txStatus == #completed) {
        txArr.add(tx);
      };
    };

    let sorted = Array.sort<Types.Transaction>(
      Buffer.toArray(txArr),
      func(a : Types.Transaction, b : Types.Transaction) : Order.Order {
        Int.compare(b.timestamp, a.timestamp);
      },
    );
    sorted;
  };

  // UTILS
  // UPDATE USER TRACKED BY PLATFORM BALANCE
  private func updateUserBalance(
    userBalances : Types.UserBalances,
    userId : Principal,
    amount : Nat,
    updateType : { #add; #sub },
  ) : Result.Result<(), Text> {
    let currentBalance = userBalances.get(userId);

    switch (currentBalance, updateType) {
      case (null, #sub) {
        #err("User has no balance");
      };
      case (?balance, #sub) {
        if (balance.balance < amount) {
          #err("Insufficient balance");
        } else {
          let updatedBalance = {
            id = balance.id;
            balance = Nat.sub(balance.balance, amount);
          };
          userBalances.put(userId, updatedBalance);
          // Log the withdrawal event
          #ok();
        };
      };
      case (null, #add) {
        let newBalance = {
          id = userId;
          balance = amount;
        };
        userBalances.put(userId, newBalance);
        #ok();
      };
      case (?balance, #add) {
        let updatedBalance = {
          id = balance.id;
          balance = balance.balance + amount;
        };
        userBalances.put(userId, updatedBalance);
        #ok();
      };
    };
  };

  // UPDATE PLATFORM BALANCE
  private func updatePlatformBalance(
    platformBalance : Types.PlatformBalance,
    total : Nat,
    platformFee : Nat,
    referralFee : ?Nat,
    updateType : { #add; #sub },
  ) : Result.Result<(), Text> {
    let referralPayout = switch (referralFee) {
      case (?amount) amount;
      case (null) 0;
    };
    let totalAfterReferralPayout = Nat.sub(total, referralPayout);

    if (referralPayout > platformFee) {
      return #err("Referral payout cannot be greater than the total platform fee");
    };

    if (updateType == #add) {
      // Normal operation
      let newBalance = platformBalance.balance + totalAfterReferralPayout;
      let newTotalFees = platformBalance.totalFees + platformFee;
      let newReferralPayouts = platformBalance.referralPayouts + referralPayout;

      // Check for overflow
      if (
        newBalance < platformBalance.balance or
        newTotalFees < platformBalance.totalFees or
        newReferralPayouts < platformBalance.referralPayouts
      ) {
        return #err("Overflow detected");
      };

      platformBalance.balance := newBalance;
      platformBalance.totalFees := newTotalFees;
      platformBalance.referralPayouts := newReferralPayouts;
    } else if (updateType == #sub) {
      // Rollback operation
      let revertedBalance = Nat.sub(platformBalance.balance, totalAfterReferralPayout);
      let revertedTotalFees = Nat.sub(platformBalance.totalFees, total);
      let revertedReferralPayouts = Nat.sub(platformBalance.referralPayouts, referralPayout);

      // Check for underflow
      if (
        revertedBalance > platformBalance.balance or
        revertedTotalFees > platformBalance.totalFees or
        revertedReferralPayouts > platformBalance.referralPayouts
      ) {
        return #err("Underflow detected during rollback");
      };

      platformBalance.balance := revertedBalance;
      platformBalance.totalFees := revertedTotalFees;
      platformBalance.referralPayouts := revertedReferralPayouts;
    };

    #ok();
  };

  // Helper function to get user's last withdrawal transaction
  private func getLastWithdrawal(userId : Principal, transactions : Types.Transactions) : ?Types.Transaction {
    var lastWithdrawal : ?Types.Transaction = null;
    var lastTimestamp : Int = 0;

    for ((_, tx) in transactions.entries()) {
      if (tx.from == userId and tx.transactionType == #withdrawal and tx.txStatus == #completed) {
        if (tx.timestamp > lastTimestamp) {
          lastTimestamp := tx.timestamp;
          lastWithdrawal := ?tx;
        };
      };
    };
    lastWithdrawal;
  };

  // ICP transfer function
  private func transfer(amount : Nat64, to : Principal) : async Result.Result<IcpLedger.BlockIndex, Text> {
    let transferArgs : IcpLedger.TransferArgs = {
      memo = 0;
      amount = { e8s = amount };
      fee = { e8s = 10_000 };
      from_subaccount = null;
      to = Principal.toLedgerAccount(to, null);
      created_at_time = null;
    };

    try {
      let transferResult = await IcpLedger.transfer(transferArgs);
      switch (transferResult) {
        case (#Err(transferError)) {
          return #err("Couldn't transfer funds: " # debug_show (transferError));
        };
        case (#Ok(blockIndex)) { return #ok(blockIndex) };
      };
    } catch (error : Error) {
      return #err("Reject message: " # Error.message(error));
    };
  };
};
