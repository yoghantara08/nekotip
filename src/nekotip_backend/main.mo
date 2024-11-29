import IC "ic:aaaaa-aa";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Cycles "mo:base/ExperimentalCycles";
import Blob "mo:base/Blob";
import Debug "mo:base/Debug";

import UserService "services/UserService";
import ContentService "services/ContentService";
import TransactionService "services/TransactionService";
import Types "types/Types";
import Ledger "canister:icp_ledger_canister";

actor NekoTip {
  private var users : Types.Users = HashMap.HashMap(0, Principal.equal, Principal.hash);
  private var contents : Types.Contents = HashMap.HashMap(0, Text.equal, Text.hash);
  private var transactions : Types.Transactions = HashMap.HashMap(0, Text.equal, Text.hash);
  private var userBalances : Types.UserBalances = HashMap.HashMap(0, Principal.equal, Principal.hash);

  private stable var usersEntries : [(Principal, Types.User)] = [];
  private stable var contentsEntries : [(Text, Types.Content)] = [];
  private stable var transactionsEntries : [(Text, Types.Transaction)] = [];
  private stable var userBalancesEntries : [(Principal, Types.UserBalance)] = [];
  private stable var platformBalance : Types.PlatformBalance = {
    var balance : Nat = 0;
    var totalFees : Nat = 0;
    var referralPayouts : Nat = 0;
  };

  public func getPlatformICPBalance() : async Nat {
    let canisterAccount = {
      owner = Principal.fromActor(NekoTip);
      subaccount = null;
    };
    return await Ledger.icrc1_balance_of(canisterAccount);
  };

  // PREUPGRADE & POSTUPGRADE
  system func preupgrade() {
    usersEntries := Iter.toArray(users.entries());
    contentsEntries := Iter.toArray(contents.entries());
    transactionsEntries := Iter.toArray(transactions.entries());
    userBalancesEntries := Iter.toArray(userBalances.entries());
  };

  system func postupgrade() {
    users := HashMap.fromIter<Principal, Types.User>(usersEntries.vals(), 0, Principal.equal, Principal.hash);
    contents := HashMap.fromIter<Text, Types.Content>(contentsEntries.vals(), 0, Text.equal, Text.hash);
    transactions := HashMap.fromIter<Text, Types.Transaction>(transactionsEntries.vals(), 0, Text.equal, Text.hash);
    userBalances := HashMap.fromIter<Principal, Types.UserBalance>(userBalancesEntries.vals(), 0, Principal.equal, Principal.hash);
    usersEntries := [];
    contentsEntries := [];
    transactionsEntries := [];
    userBalancesEntries := [];
  };

  public shared (msg) func whoami() : async Principal {
    msg.caller;
  };

  // USERS ENDPOINT ======================================
  // AUTHENTICATE USER
  public shared (msg) func authenticateUser(
    username : Text,
    depositAddress : Text,
    referralCode : ?Text,
  ) : async Result.Result<Types.User, Text> {
    return UserService.authenticateUser(users, msg.caller, username, depositAddress, referralCode);
  };

  // UPDATE USER PROFILE
  public shared (msg) func updateUserProfile(updateData : Types.UserUpdateData) : async Result.Result<Types.User, Text> {
    return UserService.updateUserProfile(users, msg.caller, updateData);
  };

  // GET USERS
  public query func getUsers() : async [Types.User] {
    return Iter.toArray(users.vals());
  };

  // GET USER BY ID
  public query func getUserById(userId : Principal) : async ?Types.User {
    return users.get(userId);
  };

  // GET USER BY USERNAME
  public query func getUserByUsername(username : Text) : async ?Types.User {
    return UserService.getUserByUsername(users, username);
  };

  // FOLLOW/UNFOLLOW USER
  public shared (msg) func toggleFollow(targetFollow : Principal) : async Result.Result<Text, Text> {
    return UserService.toggleFollow(users, msg.caller, targetFollow);
  };

  // GET FOLLOWERS
  public shared (msg) func getFollowers() : async [Types.User] {
    return UserService.getFollowers(users, msg.caller);
  };

  // GET FOLLOWING
  public shared (msg) func getFollowing() : async [Types.User] {
    return UserService.getFollowing(users, msg.caller);
  };

  // GET REFERRALS
  public shared (msg) func getReferrals() : async [Types.User] {
    return UserService.getReferrals(users, msg.caller);
  };

  // GET ACCOUNT ICP BALANCE
  public shared (msg) func getAccountBalance() : async Nat {
    return await UserService.getAccountBalance(msg.caller);
  };

  // GET CREDIT BALANCE
  public shared (msg) func getCreditBalance() : async Types.UserBalance {
    return UserService.getCreditBalance(userBalances, msg.caller);
  };

  // CONTENT ENDPOINT ======================================
  // POST CONTENT
  public shared (msg) func postContent(
    title : Text,
    description : Text,
    tier : Types.ContentTier,
    thumbnail : Text,
    contentImages : [Text],
  ) : async Result.Result<Types.Content, Text> {
    return ContentService.postContent(contents, msg.caller, title, description, tier, thumbnail, contentImages);
  };

  // GET ALL CONTENT PREVIEWS (Timeline/Feed/Discover)
  public shared query func getAllContentPreviews() : async [Types.ContentPreview] {
    return ContentService.getAllContentPreviews(contents);
  };

  // GET CREATOR CONTENT PREVIEWS
  public shared query func getCreatorContentPreview(creatorId : Principal) : async [Types.ContentPreview] {
    return ContentService.getCreatorContentPreview(contents, creatorId);
  };

  // GET CREATOR CONTENT LIST
  public shared (msg) func getCreatorContentList(creatorId : Principal) : async [Result.Result<Types.Content, Types.ContentPreview>] {
    return ContentService.getCreatorContent(contents, msg.caller, creatorId);
  };

  // GET CONTENT DETAILS
  public shared (msg) func getContentDetails(contentId : Text) : async Result.Result<Types.Content, ?Types.ContentPreview> {
    return ContentService.getContentDetails(contents, msg.caller, contentId);
  };

  // GET PURCHASED CONTENT PREVIEWS LIST
  public shared (msg) func getPurchasedContentPreviews() : async [Types.ContentPreview] {
    return ContentService.getPurchasedContentPreviews(transactions, contents, msg.caller);
  };

  // LIKE/UNLIKE CONTENT (TOGGLE LIKE)
  public shared (msg) func toggleLike(contentId : Text) : async Result.Result<Types.Content, Text> {
    return ContentService.toggleLike(contents, msg.caller, contentId);
  };

  // POST COMMENT
  public shared (msg) func postComment(contentId : Text, comment : Text) : async Result.Result<Types.Comment, Text> {
    return ContentService.addComment(contents, msg.caller, contentId, comment);
  };

  // GET COMMENTS
  public shared (msg) func getContentComments(contentId : Text) : async Result.Result<[Types.Comment], Text> {
    return ContentService.getContentComments(contents, msg.caller, contentId);
  };

  // DELETE CONTENT
  public shared (msg) func deleteContent(contentId : Text) : async Result.Result<(), Text> {
    return ContentService.deleteContent(contents, msg.caller, contentId);
  };

  // DELETE COMMENT
  public shared (msg) func deleteComment(contentId : Text, commentId : Text) : async Result.Result<Types.Content, Text> {
    return ContentService.deleteComment(contents, msg.caller, contentId, commentId);
  };

  // TRANSACTION ENDPOINT ======================================
  // CREATE DONATION TX
  public shared (msg) func createDonateTx(to : Principal, amount : Nat, supportComment : ?Text) : async Result.Result<Types.Transaction, Text> {
    return await TransactionService.createDonateTx(transactions, users, msg.caller, to, amount, supportComment);
  };

  // COMPLETE DONATE TRANSACTION AFTER SUCCESSFULL TRANSFER
  public shared func finalizeDonateTx(transactionId : Text, status : Types.TxStatus) : async Result.Result<Types.Transaction, Text> {
    return await TransactionService.finalizeDonateTx(transactions, users, userBalances, platformBalance, transactionId, status);
  };

  // CREATE CONTENT UNLOCK TX
  public shared (msg) func createContentUnlockTx(contentId : Text, amount : Nat) : async Result.Result<Types.Transaction, Text> {
    return await TransactionService.createContentUnlockTx(transactions, contents, users, msg.caller, contentId, amount);
  };

  // COMPLETE CONTENT UNLOCK TRANSACTION AFTER SUCCESSFULL TRANSFER
  public shared func finalizeContentUnlockTx(transactionId : Text, status : Types.TxStatus) : async Result.Result<Types.Transaction, Text> {
    return await TransactionService.finalizeContentUnlockTx(transactions, contents, users, userBalances, platformBalance, transactionId, status);
  };

  // WITHDRAW USER BALANCE
  public shared (msg) func withdraw(amount : Nat) : async Result.Result<Types.Transaction, Text> {
    return await TransactionService.withdraw(transactions, userBalances, platformBalance, msg.caller, amount);
  };

  // GET RECEIVED DONATIONS LIST
  public shared query func getReceivedDonations(userId : Principal) : async [Types.Transaction] {
    return TransactionService.getReceivedDonations(transactions, userId);
  };

  // GET GIVEN DONATIONS LIST
  public shared query (msg) func getGivenDonations() : async [Types.Transaction] {
    return TransactionService.getGivenDonations(transactions, msg.caller);
  };

  // GET WITHDRAWALS LIST
  public shared query (msg) func getWithdrawals() : async [Types.Transaction] {
    return TransactionService.getWithdrawals(transactions, msg.caller);
  };

  // GET REFERRAL EARNINGS LISST
  public shared query (msg) func getReferralEarnings() : async [Types.Transaction] {
    return TransactionService.getReferralEarnings(transactions, msg.caller);
  };

  // GET PLATFORM BALANCE
  public func getPlatformBalance() : async Nat {
    platformBalance.balance;
  };

  public func getPlatformTotalFees() : async Nat {
    platformBalance.totalFees;
  };

  public func getPlatformReferralPayouts() : async Nat {
    platformBalance.referralPayouts;
  };

  // GET ICP USD RATE
  public func getIcpUsdRate() : async Text {
    let host : Text = "api.coingecko.com";
    let url = "https://" # host # "/api/v3/simple/price?ids=internet-computer&vs_currencies=usd";

    let request_headers = [
      { name = "User-Agent"; value = "icp-price-feed" },
      { name = "Accept"; value = "application/json" },
    ];

    let http_request : IC.http_request_args = {
      url = url;
      max_response_bytes = ?2048;
      headers = request_headers;
      body = null;
      method = #get;
      transform = ?{
        function = transform;
        context = Blob.fromArray([]);
      };
    };

    Cycles.add<system>(230_949_972_000);

    let http_response : IC.http_request_result = await IC.http_request(http_request);

    Debug.print(debug_show (http_response));

    let decoded_text : Text = switch (Text.decodeUtf8(http_response.body)) {
      case (null) { "No value returned" };
      case (?y) { y };
    };

    decoded_text;
  };

  public query func transform({
    context : Blob;
    response : IC.http_request_result;
  }) : async IC.http_request_result {

    let _context_array : [Nat8] = Blob.toArray(context);

    {
      response with headers = []; // not intersted in the headers
    };
  };

};
