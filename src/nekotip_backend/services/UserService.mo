import Principal "mo:base/Principal";
import Nat32 "mo:base/Nat32";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Error "mo:base/Error";
import Array "mo:base/Array";
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
    referralCode : ?Text,
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
    for ((id, user) in users.entries()) {
      if (Text.equal(user.username, username)) {
        // If the username matches but belongs to a different user, throw an error
        if (id != userId) {
          throw Error.reject("USERNAME_TAKEN: The username '" # username # "' is already in use.");
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
          var referredBy : ?Principal = null;

          // Handle referral
          switch (referralCode) {
            case null {};
            case (?code) {
              referredBy := findUserByReferralCode(users, code);
            };
          };

          // Generate referral code
          let newReferralCode = await generateReferral(userId);
          let createdAt = getMilliseconds(Time.now());

          let newUser : Types.User = {
            id = userId;
            username = username;
            referralCode = newReferralCode;
            depositAddress = depositAddress;
            followers = [];
            following = [];
            referrals = [];
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

          // Update referrer's referrals if applicable
          switch (referredBy) {
            case null {};
            case (?refId) {
              updateReferrerReferrals(users, refId, userId);
            };
          };

          newUser;
        };
      };
    } catch (_err) {
      throw Error.reject("System error occurred during authentication");
    };
  };

  // UPDATE USER PROFILE
  public func updateUserProfile(
    users : Types.Users,
    userId : Principal,
    updateData : Types.UserUpdateData,
  ) : async Types.User {
    // Check if principal is valid
    if (Principal.isAnonymous(userId)) {
      throw Error.reject("Anonymous principals are not allowed");
    };

    switch (users.get(userId)) {
      case (null) {
        throw Error.reject("User not found!");
      };
      case (?user) {
        let username = switch (updateData.username) {
          case (null) { user.username };
          case (?newUsername) {
            if (Text.size(newUsername) < 3 or Text.size(newUsername) > 20) {
              throw Error.reject("Username must be between 3 and 20 characters");
            };

            if (newUsername != user.username) {
              for ((id, existingUser) in users.entries()) {
                if (id != userId and Text.equal(existingUser.username, newUsername)) {
                  throw Error.reject("USERNAME_TAKEN: The username '" # newUsername # "' is already in use.");
                };
              };
            };
            newUsername;
          };
        };

        let bio = switch (updateData.bio) {
          case (null) { user.bio };
          case (?newBio) {
            if (Text.size(newBio) > 500) {
              throw Error.reject("Bio must be 500 characters or less");
            };
            ?newBio;
          };
        };

        let socials = switch (updateData.socials) {
          case (null) { user.socials };
          case (?newSocials) { ?newSocials };
        };

        let name = switch (updateData.name) {
          case (null) { user.name };
          case (?newName) { ?newName };
        };

        let profilePic = switch (updateData.profilePic) {
          case (null) { user.profilePic };
          case (?newProfilePic) { ?newProfilePic };
        };

        let bannerPic = switch (updateData.bannerPic) {
          case (null) { user.bannerPic };
          case (?newBannerPic) { ?newBannerPic };
        };

        let categories = switch (updateData.categories) {
          case (null) { user.categories };
          case (?newCategories) { ?newCategories };
        };

        let updatedUser : Types.User = {
          id = user.id;
          referralCode = user.referralCode;
          depositAddress = user.depositAddress;
          followers = user.followers;
          following = user.following;
          createdAt = user.createdAt;
          referredBy = user.referredBy;
          referrals = user.referrals;

          // UPDATE FIELD
          username = username;
          bio = bio;
          socials = socials;
          name = name;
          profilePic = profilePic;
          bannerPic = bannerPic;
          categories = categories;
        };

        users.put(userId, updatedUser);
        return updatedUser;
      };
    };
  };

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

  private func findUserByReferralCode(users : Types.Users, code : Text) : ?Principal {
    for ((id, user) in users.entries()) {
      if (user.referralCode == code) {
        return ?id;
      };
    };
    null;
  };

  private func updateReferrerReferrals(users : Types.Users, referrerId : Principal, newUserId : Principal) {
    switch (users.get(referrerId)) {
      case (?referrer) {
        let updatedReferrer = {
          referrer with
          referrals = Array.append(referrer.referrals, [newUserId])
        };
        users.put(referrerId, updatedReferrer);
      };
      case null {};
    };
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
