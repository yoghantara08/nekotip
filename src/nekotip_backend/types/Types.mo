import HashMap "mo:base/HashMap";

module {
  public type User = {
    id : Principal;
    username : Text;
    name : Text;
    bio : Text;
    profilePic : ?Text;
    bannerPic : ?Text;
    socials : Socials;
    categories : ?[Category];
    followers : [Principal];
    following : [Principal];
    referralCode : Text;
    referredBy : ?Principal;
    walletBalance : [(Text, Nat)];
    createdAt : Int;
  };

  public type Users = HashMap.HashMap<Principal, User>;

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

  public type Category = {
    #Animation;
    #Art;
    #Blogging;
    #ComicsAndCartoons;
    #Commissions;
    #Community;
    #Cosplay;
    #DanceAndTheatre;
    #Design;
    #DrawingAndPainting;
    #Education;
    #FoodAndDrink;
    #Gaming;
    #HealthAndFitness;
    #Lifestyle;
    #Money;
    #Music;
    #News;
    #Other;
    #Photography;
    #Podcast;
    #ScienceAndTech;
    #Social;
    #Software;
    #Streaming;
    #Translator;
    #VideoAndFilm;
    #Writing;
  };

  public type Content = {
    id : Text;
    creatorId : Principal;
    title : Text;
    description : Text;
    price : Nat;
    contentHash : Text;
    isExclusive : Bool;
    createdAt : Int;
    likes : [Principal];
    comments : [Comment];
    thumbnailHash : ?Text;
    category : Category;
    unlockedBy : [Principal];
  };

  // public type Contents

  public type Comment = {
    id : Text;
    userId : Principal;
    content : Text;
    timestamp : Int;
    replies : [Comment];
    likes : [Principal];
  };

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

  public type Error = {
    #NotFound;
    #AlreadyExists;
    #NotAuthorized;
    #InsufficientFunds;
    #InvalidInput;
    #InvalidTransaction;
    #ContentNotAvailable;
    #InvalidReferralCode;
    #SystemError;
  };

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
