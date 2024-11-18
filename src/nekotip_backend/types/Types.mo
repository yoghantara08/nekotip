import HashMap "mo:base/HashMap";

module {
  public type Users = HashMap.HashMap<Principal, User>;
  public type Contents = HashMap.HashMap<Text, Content>;
  public type Transactions = HashMap.HashMap<Text, Transaction>;

  // USER TYPES
  public type User = {
    id : Principal;
    username : Text;
    depositAddress : Text;
    referralCode : Text;
    followers : [Principal];
    following : [Principal];
    referrals : [Principal];
    createdAt : Int;

    bio : ?Text;
    socials : ?Socials;
    name : ?Text;
    profilePic : ?Text;
    bannerPic : ?Text;
    referredBy : ?Principal;
    categories : ?[Text];
  };

  public type UserUpdateData = {
    username : ?Text;
    bio : ?Text;
    socials : ?Socials;
    name : ?Text;
    profilePic : ?Text;
    bannerPic : ?Text;
    categories : ?[Text];
    isCreator : ?Bool;
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

  // CONTENT TYPES
  public type Content = {
    id : Text;
    creatorId : Principal;
    title : Text;
    description : Text;
    price : Nat;
    contentHash : Text;
    isExclusive : Bool;
    likes : [Principal];
    comments : [Comment];
    thumbnailHash : ?Text;
    category : [Text];
    unlockedBy : [Principal];
    createdAt : Int;
    updatedAt : ?Int;
  };

  public type Comment = {
    id : Text;
    commenter : Principal;
    contentId : Text;
    text : Text;
    createdAt : Int;
    updatedAt : ?Int;
  };

  // TRANSACTION TYPES
  public type Transaction = {
    id : Text;
    from : Principal;
    to : Principal;
    amount : Nat;
    transactionType : TransactionType;
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

  // STATISTIC TYPES
  public type PlatformStats = {
    totalUsers : Nat;
    totalCreators : Nat;
    totalContent : Nat;
    totalTransactions : Nat;
    totalVolume : Nat;
    platformFees : Nat;
    referralPayouts : Nat;
  };
};
