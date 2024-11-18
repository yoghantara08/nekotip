import Types "types/Types";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
import Buffer "mo:base/Buffer";
import Array "mo:base/Array";
import Result "mo:base/Result";
import UserService "services/UserService";

actor class NekoTip() = this {

  private var users : Types.Users = HashMap.HashMap(0, Principal.equal, Principal.hash);
  private stable var usersEntries : [(Principal, Types.User)] = [];

  // PREUPGRADE & POSTUPGRADE
  system func preupgrade() {
    usersEntries := Iter.toArray(users.entries());
  };

  system func postupgrade() {
    users := HashMap.fromIter<Principal, Types.User>(usersEntries.vals(), 0, Principal.equal, Principal.hash);
    usersEntries := [];
  };

  // USERS ENDPOINT ======================================
  // AUTHENTICATE USER
  public shared (msg) func authenticateUser(
    username : Text,
    depositAddress : Text,
    referralCode : ?Text,
  ) : async Types.User {
    return await UserService.authenticateUser(users, msg.caller, username, depositAddress, referralCode);
  };

  // UPDATE USER PROFILE
  public shared (msg) func updateUserProfile(updateData : Types.UserUpdateData) : async Types.User {
    return await UserService.updateUserProfile(users, msg.caller, updateData);
  };

  // GET USERS
  public query func getUsers() : async [Types.User] {
    return Iter.toArray(users.vals());
  };

  // GET USER BY ID
  public query func getUserById(userId : Principal) : async ?Types.User {
    return users.get(userId);
  };

  // FOLLOW/UNFOLLOW USER
  public shared (msg) func toggleFollow(targetFollow : Principal) : async Result.Result<Text, Text> {
    await UserService.toggleFollow(users, msg.caller, targetFollow);
  };

  // GET FOLLOWERS
  public query func getFollowers(userId : Principal) : async [Types.User] {
    switch (users.get(userId)) {
      case (null) { [] };
      case (?_user) {
        let followers = Buffer.Buffer<Types.User>(0);
        for ((_, otherUser) in users.entries()) {
          if (Array.indexOf(userId, otherUser.following, Principal.equal) != null) {
            followers.add(otherUser);
          };
        };
        Buffer.toArray(followers);
      };
    };
  };

  // GET FOLLOWING
  public query func getFollowing(userId : Principal) : async [Types.User] {
    switch (users.get(userId)) {
      case (null) { [] };
      case (?user) {
        let following = Buffer.Buffer<Types.User>(0);
        for (followedId in user.following.vals()) {
          switch (users.get(followedId)) {
            case (null) {};
            case (?followedUser) {
              following.add(followedUser);
            };
          };
        };
        Buffer.toArray(following);
      };
    };
  };

  // GET REFERRALS
  public query func getReferrals(userId : Principal) : async [Types.User] {
    switch (users.get(userId)) {
      case (null) { [] };
      case (?_user) {
        let referrals = Buffer.Buffer<Types.User>(0);
        for ((_, otherUser) in users.entries()) {
          switch (otherUser.referredBy) {
            case (null) {};
            case (?referrerId) {
              if (Principal.equal(referrerId, userId)) {
                referrals.add(otherUser);
              };
            };
          };
        };
        Buffer.toArray(referrals);
      };
    };
  };

  // GET ACCOUNT ICP BALANCE
  public shared (msg) func getAccountBalance() : async Nat {
    return await UserService.getAccountBalance(msg.caller);
  };

  // CONTENT ENDPOINT ======================================

  // TRANSACTION ENDPOINT ======================================
};
