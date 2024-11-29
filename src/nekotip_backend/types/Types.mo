import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";

module {
  public type Users = HashMap.HashMap<Principal, User>;
  public type Contents = HashMap.HashMap<Text, Content>;
  public type Transactions = HashMap.HashMap<Text, Transaction>;
  public type UserBalances = HashMap.HashMap<Principal, UserBalance>;

  // USER TYPES
  public type User = {
    id : Principal;
    username : Text;
    depositAddress : Text;
    referralCode : Text;
    followers : [Principal];
    following : [Principal];
    referrals : [Principal];
    categories : [Text];
    socials : Socials;
    createdAt : Int;

    bio : ?Text;
    name : ?Text;
    profilePic : ?Text;
    bannerPic : ?Text;
    referredBy : ?Principal;
  };

  public type UserUpdateData = {
    username : ?Text;
    name : ?Text;
    bio : ?Text;
    profilePic : ?Text;
    bannerPic : ?Text;
    socials : ?Socials;
    categories : ?[Text];
  };

  public type Socials = {
    twitter : ?Text;
    instagram : ?Text;
    tiktok : ?Text;
    youtube : ?Text;
    discord : ?Text;
    twitch : ?Text;
    website : ?Text;
    facebook : ?Text;
  };

  public type UserBalance = {
    id : Principal;
    balance : Nat;
  };

  // CONTENT TYPES
  public type Content = {
    id : Text;
    creatorId : Principal;
    title : Text;
    description : Text;
    tier : ContentTier;
    thumbnail : Text;
    contentImages : [Text];
    likes : [Principal];
    comments : [Comment];
    unlockedBy : [Principal];
    createdAt : Int;
    updatedAt : ?Int;
  };

  public type ContentTier = {
    #Free;
    #Tier1; // $30
    #Tier2; // $15
    #Tier3; // $5
  };

  public type Comment = {
    id : Text;
    commenter : Principal;
    contentId : Text;
    text : Text;
    createdAt : Int;
    updatedAt : ?Int;
  };

  public type ContentPreview = {
    id : Text;
    creatorId : Principal;
    title : Text;
    description : Text;
    tier : ContentTier;
    thumbnail : Text;
    likesCount : Nat;
    commentsCount : Nat;
    unlockedBy : [Principal];
    createdAt : Int;
  };

  // TRANSACTION TYPES
  public type Transaction = {
    id : Text;
    from : Principal;
    to : Principal;
    amount : Nat;
    transactionType : TransactionType;
    txStatus : TxStatus;
    contentId : ?Text;
    supportComment : ?Text;
    platformFee : Nat;
    referralFee : ?Nat;
    timestamp : Int;
  };

  public type TransactionType = {
    #donation;
    #contentPurchase;
    #withdrawal;
    #referralPayout;
    #platformFee;
  };

  public type TxStatus = {
    #pending;
    #completed;
    #failed;
  };

  // PLATFORM TYPES
  public type PlatformBalance = {
    var balance : Nat;
    var totalFees : Nat;
    var referralPayouts : Nat;
  };
};
