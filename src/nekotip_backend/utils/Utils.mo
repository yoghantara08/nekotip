import Prim "mo:prim";
import Principal "mo:base/Principal";
import Int "mo:base/Int";
import Nat32 "mo:base/Nat32";
import Text "mo:base/Text";
import Time "mo:base/Time";

module {
  public func substr(t : Text, i : Nat, j : Nat) : Text {
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

  public func generateUUID(userPrincipal : Principal, content : Text) : Text {
    let principalText = Principal.toText(userPrincipal);
    let timestamp = Int.toText(Time.now());
    let contentHash = Nat32.toText(Text.hash(content));

    let combined = principalText # timestamp # contentHash;
    let finalHash = Text.hash(combined);
    return Nat32.toText(finalHash);
  };

  public func calculatePlatformFee(amount : Nat) : Nat {
    return (amount * 5) / 100;
  };

  public func calculateReferralPayout(amount : Nat) : Nat {
    return amount / 2;
  };
};
