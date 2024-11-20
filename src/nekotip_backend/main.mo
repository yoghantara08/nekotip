import Types "types/Types";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
import Result "mo:base/Result";
import Text "mo:base/Text";
import UserService "services/UserService";
import ContentService "services/ContentService";

actor class NekoTip() = this {
  private var users : Types.Users = HashMap.HashMap(0, Principal.equal, Principal.hash);
  private var contents : Types.Contents = HashMap.HashMap<Text, Types.Content>(0, Text.equal, Text.hash);

  private stable var usersEntries : [(Principal, Types.User)] = [];
  private stable var contentsEntries : [(Text, Types.Content)] = [];

  // PREUPGRADE & POSTUPGRADE
  system func preupgrade() {
    usersEntries := Iter.toArray(users.entries());
    contentsEntries := Iter.toArray(contents.entries());
  };

  system func postupgrade() {
    users := HashMap.fromIter<Principal, Types.User>(usersEntries.vals(), 0, Principal.equal, Principal.hash);
    contents := HashMap.fromIter<Text, Types.Content>(contentsEntries.vals(), 0, Text.equal, Text.hash);
    usersEntries := [];
    contentsEntries := [];
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
    return UserService.toggleFollow(users, msg.caller, targetFollow);
  };

  // GET FOLLOWERS
  public shared (msg) func getFollowers() : async [Types.User] {
    return UserService.getFollowers(users, msg.caller);
  };

  // GET FOLLOWING
  public shared (msg) func getFollowing() : async [Types.User] {
    return UserService.getFollowing(users, msg.caller);
  };

  // GET REFERRALS
  public shared (msg) func getReferrals() : async [Types.User] {
    return UserService.getReferrals(users, msg.caller);
  };

  // GET ACCOUNT ICP BALANCE
  public shared (msg) func getAccountBalance() : async Nat {
    return await UserService.getAccountBalance(msg.caller);
  };

  // CONTENT ENDPOINT ======================================
  // POST CONTENT
  public shared (msg) func postContent(
    title : Text,
    description : Text,
    tier : Types.ContentTier,
    thumbnail : Text,
    contentImages : [Text],
    categories : [Text],
  ) : async Result.Result<Types.Content, Text> {
    return ContentService.postContent(contents, msg.caller, title, description, tier, thumbnail, contentImages, categories);
  };

  // GET ALL CONTENT PREVIEWS (Timeline/Feed/Discover)
  public shared query func getAllContentPreviews() : async [Types.ContentPreview] {
    return ContentService.getAllContentPreviews(contents);
  };

  // GET CREATOR CONTENT LIST
  public shared (msg) func getCreatorContentList(creatorId : Principal) : async [Result.Result<Types.Content, Types.ContentPreview>] {
    return ContentService.getCreatorContent(contents, msg.caller, creatorId);
  };

  // GET CONTENT DETAILS
  public shared (msg) func getContentDetails(contentId : Text) : async Result.Result<Types.Content, ?Types.ContentPreview> {
    return ContentService.getContentDetails(contents, msg.caller, contentId);
  };

  // LIKE/UNLIKE CONTENT (TOGGLE LIKE)
  public shared (msg) func toggleLike(contentId : Text) : async Result.Result<Types.Content, Text> {
    return ContentService.toggleLike(contents, msg.caller, contentId);
  };

  // POST COMMENT
  public shared (msg) func postComment(contentId : Text, comment : Text) : async Result.Result<Types.Comment, Text> {
    return ContentService.addComment(contents, msg.caller, contentId, comment);
  };

  // GET COMMENTS
  public shared (msg) func getContentComments(contentId : Text) : async Result.Result<[Types.Comment], Text> {
    return ContentService.getContentComments(contents, msg.caller, contentId);
  };

  // DELETE CONTENT
  public shared (msg) func deleteContent(contentId : Text) : async Result.Result<(), Text> {
    return ContentService.deleteContent(contents, msg.caller, contentId);
  };

  // DELETE COMMENT
  public shared (msg) func deleteComment(contentId : Text, commentId : Text) : async Result.Result<Types.Content, Text> {
    return ContentService.deleteComment(contents, msg.caller, contentId, commentId);
  };

  // TRANSACTION ENDPOINT ======================================
};
