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
import IcpLedger "canister:icp_ledger_canister";

module {
  // Notes: Always check if user has referrer then cut 5% from 5% platform fee and give to referrer
  // DONATION
  public func initiateDonation(
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

        let platformFee = (amount * 5) / 100;
        var referralFee = 0;
        if (toUser.referredBy != null) {
          referralFee := platformFee / 2;
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

  // UNLOCK CONTENT PAYMENT

  // WITHDRAW

  // GET TRANSACTION DETAILS

  // GET TRANSACTION HISTORY BY PRINCIPAL ID

  // TRACK REFERRAL EARNINGS

  // UTILS
  private func _getPriceFromTier(tier : Types.ContentTier) : Nat {
    switch (tier) {
      case (#Free) { 0 };
      case (#Tier1) { 30 };
      case (#Tier2) { 15 };
      case (#Tier3) { 5 };
    };
  };

};
