import Principal "mo:base/Principal";
import Nat32 "mo:base/Nat32";
import Text "mo:base/Text";
import Prim "mo:⛔";

module UserService {
  // ADD USER

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
};
