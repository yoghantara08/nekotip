import HashMap "mo:base/HashMap";

module {
  public type Users = HashMap.HashMap<Principal, User>;
  public type Contents = HashMap.HashMap<Text, Content>;
  public type Transactions = HashMap.HashMap<Text, Transaction>;

  public type User = {
    id : Principal;
    username : Text;
    referralCode : Text;
    depositAddress : Text;
    followers : [Principal];
    following : [Principal];
    createdAt : Int;

    bio : ?Text;
    socials : ?Socials;
    name : ?Text;
    profilePic : ?Text;
    bannerPic : ?Text;
    referredBy : ?Principal;
    categories : ?[Category];
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
    likes : [Principal];
    comments : [Comment];
    thumbnailHash : ?Text;
    category : Category;
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
