import Principal "mo:base/Principal";
import Nat32 "mo:base/Nat32";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Error "mo:base/Error";
import Prim "mo:prim";
import ledger "canister:icp_ledger_canister";
import Types "../types/Types";

module {
  // LOGIN/REGISTER
  public func authenticateUser(
    users : Types.Users,
    userId : Principal,
    username : Text,
    depositAddress : Text,
  ) : async Types.User {

    // Input validation
    if (Text.size(username) < 3 or Text.size(username) > 20) {
      throw Error.reject("Username must be between 3 and 20 characters");
    };

    if (Text.size(depositAddress) == 0) {
      throw Error.reject("Deposit address cannot be empty");
    };

    // Check if principal is valid
    if (Principal.isAnonymous(userId)) {
      throw Error.reject("Anonymous principals are not allowed");
    };

    // Check if username already exists
    for ((_, user) in users.entries()) {
      if (Text.equal(user.username, username)) {
        // Only throw error if it's a new user trying to use existing username
        switch (users.get(userId)) {
          case null {
            throw Error.reject("Username already exists");
          };
          case (?existingUser) {
            // If same user is authenticating again, this is fine
            if (existingUser.id != userId) {
              throw Error.reject("Username already exists");
            };
          };
        };
      };
    };

    try {
      switch (users.get(userId)) {
        // If user exists, return their data
        case (?existingUser) {
          existingUser;
        };
        // If user doesn't exist, create new user
        case null {
          // Generate referral code
          let referralCode = await generateReferral(userId);
          let createdAt = getMilliseconds(Time.now());

          let newUser : Types.User = {
            id = userId;
            username = username;
            referralCode = referralCode;
            depositAddress = depositAddress;
            followers = [];
            following = [];
            createdAt = createdAt;
            bio = null;
            socials = null;
            name = null;
            profilePic = null;
            bannerPic = null;
            referredBy = null;
            categories = null;
          };

          // Add new user to the hashmap
          users.put(userId, newUser);
          newUser;
        };
      };
    } catch (_err) {
      throw Error.reject("System error occurred during authentication");
    };
  };

  // EDIT PROFILE

  // CHANGE PROFILE PICTURE

  // CHANGE BANNER PICTURE

  // UPDATE SOCIALS

  // UPDATE CATEGORY

  // GET USERS

  // GET USER BY PRINCIPAL ID

  // FOLLOW/UNFOLLOW USER

  // GET FOLLOWERS

  // GET FOLLOWING

  // GET REFERRALS

  // GET ICP BALANCE
  public func getAccountBalance(principalId : Principal) : async Nat {
    let balance = await ledger.icrc1_balance_of({
      owner = principalId;
      subaccount = null;
    });
    return balance;
  };

  // UTILS
  public func generateReferral(principal : Principal) : async Text {
    let principalText = Principal.toText(principal);
    let hashedText = Nat32.toText(Text.hash(principalText));
    let referral = extract(hashedText, 0, 8);

    return referral;
  };

  private func extract(t : Text, i : Nat, j : Nat) : Text {
    let size = t.size();
    if (i == 0 and j == size) return t;
    assert (j <= size);
    let cs = t.chars();
    var r = "";
    var n = i;
    while (n > 0) {
      ignore cs.next();
      n -= 1;
    };
    n := j;
    while (n > 0) {
      switch (cs.next()) {
        case null { assert false };
        case (?c) { r #= Prim.charToText(c) };
      };
      n -= 1;
    };
    return r;
  };

  private func getMilliseconds(time : Int) : Int {
    return time / 1_000_000;
  };
};
