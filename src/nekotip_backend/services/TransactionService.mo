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
import Debug "mo:base/Debug";
import IcpLedger "canister:icp_ledger_canister";

module {
  // Notes: Always check if user has referrer then cut 5% from 5% platform fee and give to referrer
  // DONATION
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

        let platformFee = Utils.calculatePlatformFee(amount);
        var referralFee = 0;
        if (toUser.referredBy != null) {
          referralFee := Utils.calculateReferralPayout(platformFee);
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

  // UPDATE TRANSACTION
  // change status, update user balance and track referrals, update platform balance
  public func finalizeDonateTx(
    transactions : Types.Transactions,
    userBalances : Types.UserBalances,
    platformBalance : Types.PlatformBalance,
    transactionId : Text,
    status : Types.TxStatus,
  ) : async Result.Result<Types.Transaction, Text> {
    switch (transactions.get(transactionId)) {
      case (null) {
        #err("Transaction not found");
      };
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
              await updateRecipientBalance(userBalances, transaction.to, transaction.amount);

              // Update platform balance
              await updatePlatformBalance(
                platformBalance,
                transaction.platformFee,
                transaction.referralFee,
              );

              // Handle referral fee if exists
              switch (transaction.referralFee) {
                case (?refFee) {
                  await handleReferralPayment(userBalances, transaction.to, refFee);
                };
                case (null) {};
              };

              #ok(updatedTransaction);
            } catch (e) {
              // Revert transaction status if any balance update fails
              transactions.put(transactionId, transaction);
              #err("Failed to update balances: " # Error.message(e));
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

        let platformFee = Utils.calculatePlatformFee(amount);
        var referralFee = 0;

        // Check if content creator has a referrer
        switch (users.get(content.creatorId)) {
          case (?creator) {
            if (creator.referredBy != null) {
              referralFee := Utils.calculateReferralPayout(platformFee);
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

  // Update content after successful transaction
  public func finalizeContentUnlockTx(
    transactions : Types.Transactions,
    contents : Types.Contents,
    users : Types.Users,
    userBalances : Types.UserBalances,
    platformBalance : Types.PlatformBalance,
    transactionId : Text,
  ) : async Result.Result<Types.Transaction, Text> {
    switch (transactions.get(transactionId)) {
      case (null) { #err("Transaction not found") };
      case (?transaction) {
        if (transaction.txStatus == #completed or transaction.txStatus == #failed) {
          return #err("Transaction already processed");
        };

        switch (transaction.contentId) {
          case (null) { return #err("Invalid content transaction") };
          case (?contentId) {
            try {
              // Update transaction status
              let updatedTransaction = {
                transaction with
                txStatus = #completed;
              };
              transactions.put(transactionId, updatedTransaction);

              // Update creator's balance
              switch (userBalances.get(transaction.to)) {
                case (null) {
                  let newBalance : Types.UserBalance = {
                    id = transaction.to;
                    balance = transaction.amount;
                    donatedBalance = 0;
                    referrerBalance = 0;
                  };
                  userBalances.put(transaction.to, newBalance);
                };
                case (?balance) {
                  let updatedBalance = {
                    balance with
                    balance = balance.balance + transaction.amount;
                  };
                  userBalances.put(transaction.to, updatedBalance);
                };
              };

              // Update platform balance
              platformBalance.balance += (transaction.platformFee - Option.get(transaction.referralFee, 0));
              platformBalance.totalFees += transaction.platformFee;
              platformBalance.referralPayouts += Option.get(transaction.referralFee, 0);

              // Handle referral payment if exists
              switch (transaction.referralFee, contents.get(contentId)) {
                case (null, _) {};
                case (_, null) {};
                case (?refFee, ?content) {
                  switch (users.get(content.creatorId)) {
                    case (?creator) {
                      switch (creator.referredBy) {
                        case (?referrer) {
                          await handleReferralPayment(userBalances, referrer, refFee);
                        };
                        case (null) {};
                      };
                    };
                    case (null) {};
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
            } catch (_e) {
              // Revert transaction status if any update fails
              transactions.put(transactionId, transaction);
              #err("Failed to process transaction: " # Debug.trap("Error processing transaction"));
            };
          };
        };
      };
    };
  };

  // Update recipient's balance
  private func updateRecipientBalance(
    userBalances : Types.UserBalances,
    recipient : Principal,
    amount : Nat,
  ) : async () {
    switch (userBalances.get(recipient)) {
      case (null) {
        let newBalance : Types.UserBalance = {
          id = recipient;
          balance = amount;
          donatedBalance = amount;
          referrerBalance = 0;
        };
        userBalances.put(recipient, newBalance);
      };
      case (?balance) {
        let updatedBalance : Types.UserBalance = {
          balance with
          balance = balance.balance + amount;
          donatedBalance = balance.donatedBalance + amount;
        };
        userBalances.put(recipient, updatedBalance);
      };
    };
  };

  // Update platform balance
  private func updatePlatformBalance(
    platformBalance : Types.PlatformBalance,
    fee : Nat,
    referralFee : ?Nat,
  ) : async () {
    let refFeeAmount = switch (referralFee) {
      case (?amount) amount;
      case (null) 0;
    };

    platformBalance.balance += (fee - refFeeAmount);
    platformBalance.totalFees += fee;
    platformBalance.referralPayouts += refFeeAmount;
  };

  // Handle referral payment
  private func handleReferralPayment(
    userBalances : Types.UserBalances,
    recipientId : Principal,
    referralAmount : Nat,
  ) : async () {
    switch (userBalances.get(recipientId)) {
      case (null) {
        // Create new balance entry for referrer
        let newBalance : Types.UserBalance = {
          id = recipientId;
          balance = referralAmount;
          donatedBalance = 0;
          referrerBalance = referralAmount;
        };
        userBalances.put(recipientId, newBalance);
      };
      case (?balance) {
        // Update existing balance
        let updatedBalance : Types.UserBalance = {
          balance with
          balance = balance.balance + referralAmount;
          referrerBalance = balance.referrerBalance + referralAmount;
        };
        userBalances.put(recipientId, updatedBalance);
      };
    };
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
