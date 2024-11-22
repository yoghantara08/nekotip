import Types "../types/Types";
import Result "mo:base/Result";
import Option "mo:base/Option";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Utils "../Utils/Utils";
import UserService "UserService";
import Error "mo:base/Error";
import Nat64 "mo:base/Nat64";
import Nat "mo:base/Nat";
import Array "mo:base/Array";
import IcpLedger "canister:icp_ledger_canister";

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
              let _ = updateUserBalance(userBalances, transaction.to, transaction.amount, #add);

              // Update platform balance
              let _ = updatePlatformBalance(
                platformBalance,
                transaction.platformFee,
                transaction.referralFee,
              );

              // Handle referral payment if exists
              switch (transaction.referralFee, users.get(transaction.to)) {
                case (null, _) {};
                case (_, null) {};
                case (?refFee, ?toUser) {
                  switch (toUser.referredBy) {
                    case (null) {};
                    case (?referrer) {
                      let _ = updateUserBalance(userBalances, referrer, refFee, #add);
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
                  let _ = updateUserBalance(userBalances, transaction.to, transaction.amount, #add);

                  // Update platform balance
                  let _ = updatePlatformBalance(
                    platformBalance,
                    transaction.platformFee,
                    transaction.referralFee,
                  );

                  // Handle referral payment if exists
                  switch (transaction.referralFee, users.get(transaction.to)) {
                    case (null, _) {};
                    case (_, null) {};
                    case (?refFee, ?toUser) {
                      switch (toUser.referredBy) {
                        case (null) {};
                        case (?referrer) {
                          let _ = updateUserBalance(userBalances, referrer, refFee, #add);
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

  // UPDATE USER TRACKED BY PLATFORM BALANCE
  private func updateUserBalance(
    userBalances : Types.UserBalances,
    userId : Principal,
    amount : Nat,
    updateType : { #add; #withdraw },
  ) : Result.Result<(), Text> {
    let currentBalance = userBalances.get(userId);

    switch (currentBalance, updateType) {
      case (null, #withdraw) {
        #err("User has no balance");
      };
      case (?balance, #withdraw) {
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
    fee : Nat,
    referralFee : ?Nat,
  ) : Result.Result<(), Text> {
    let refFeeAmount = switch (referralFee) {
      case (?amount) amount;
      case (null) 0;
    };

    if (refFeeAmount > fee) {
      return #err("Referral fee cannot be greater than the total fee");
    };

    let newBalance = platformBalance.balance + (Nat.sub(fee, refFeeAmount));
    let newTotalFees = platformBalance.totalFees + fee;
    let newReferralPayouts = platformBalance.referralPayouts + refFeeAmount;

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

    #ok();
  };

  // ICP transfer function
  public func transfer(amount : Nat64, to : Principal) : async Result.Result<IcpLedger.BlockIndex, Text> {
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

  // WITHDRAW

  // GET SUPPORT GIVEN (DONATION LIST)

  // GET TRANSACTION LIST
};
