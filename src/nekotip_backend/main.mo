import Types "types/Types";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
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

  // USERS ENDPOINT
  public shared (msg) func authenticateUser(
    username : Text,
    depositAddress : Text,
  ) : async Types.User {
    return await UserService.authenticateUser(users, msg.caller, username, depositAddress);
  };

  public shared (msg) func getAccountBalance() : async Nat {
    return await UserService.getAccountBalance(msg.caller);
  };

  // CONTENT ENDPOINT

  // TRANSACTION ENDPOINT
};
