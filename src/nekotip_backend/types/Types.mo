// types/Types.mo
module {
  public type User = {
    id : Principal;
    username : Text;
    name : Text;
    isCreator : Bool;
    profilePic : ?Text;
    bannerPic : ?Text;
    followers : [Principal];
    following : [Principal];
    createdAt : Int;
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
    contentId : ?Text; // null if #donation type
    transactionType : TransactionType;
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
