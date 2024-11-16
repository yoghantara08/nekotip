module {
  public type User = {
    id : Principal;
    username : Text;
    name : Text;
    bio : Text;
    isCreator : Bool;
    profilePic : ?Text;
    bannerPic : ?Text;
    socials : Socials;
    categories : ?[Category];
    followers : [Principal];
    following : [Principal];
    createdAt : Int;
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
    createdAt : Int;
    likes : [Principal];
    comments : [(Principal, Text)];
  };

  public type Transaction = {
    id : Text;
    from : Principal;
    to : Principal;
    amount : Nat;
    transactionType : TransactionType;
    contentId : ?Text; // null if type #donation
    comment : ?Text; // null if type #contentPurchase
    timestamp : Int;
  };

  public type TransactionType = {
    #donation;
    #contentPurchase;
  };

  public type Error = {
    #NotFound;
    #AlreadyExists;
    #NotAuthorized;
    #InsufficientFunds;
    #InvalidInput;
  };
};
