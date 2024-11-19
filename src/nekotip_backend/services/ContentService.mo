import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Text "mo:base/Text";
import Result "mo:base/Result";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Utils "../Utils/Utils";
import Types "../types/Types";

module {
  // POST CONTENT
  public func postContent(
    contents : Types.Contents,
    caller : Principal,
    title : Text,
    description : Text,
    tier : Types.ContentTier,
    thumbnail : Text,
    contentImages : [Text],
    categories : [Text],
  ) : async Result.Result<Types.Content, Text> {

    if (Principal.isAnonymous(caller)) {
      return #err("Anonymous principals cannot post content");
    };

    let contentId = Utils.generateUUID(caller, description);

    let newContent : Types.Content = {
      id = contentId;
      creatorId = caller;
      title = title;
      description = description;
      tier = tier;
      thumbnail = thumbnail;
      contentImages = contentImages;
      categories = categories;
      likes = [];
      comments = [];
      unlockedBy = [];
      createdAt = Time.now();
      updatedAt = null;
    };

    contents.put(contentId, newContent);
    #ok(newContent);
  };

  // Get content details with access control
  public func getContentDetails(
    contents : Types.Contents,
    caller : Principal,
    contentId : Text,
  ) : async Result.Result<Types.Content, ?Types.ContentPreview> {
    switch (contents.get(contentId)) {
      case (?content) {
        if (hasAccess(content, caller)) {
          #ok(content);
        } else {
          #err(?toContentPreview(content));
        };
      };
      case (null) { #err(null) };
    };
  };

  // Get creator's content (full content for owned content, previews for others)
  public func getCreatorContent(
    contents : Types.Contents,
    caller : Principal,
    creatorId : Principal,
  ) : async [Result.Result<Types.Content, Types.ContentPreview>] {
    Iter.toArray(
      Iter.map(
        Iter.filter(
          contents.vals(),
          func(content : Types.Content) : Bool {
            content.creatorId == creatorId;
          },
        ),
        func(content : Types.Content) : Result.Result<Types.Content, Types.ContentPreview> {
          if (hasAccess(content, caller)) {
            #ok(content);
          } else {
            #err(toContentPreview(content));
          };
        },
      )
    );
  };

  // EDIT CONTENT
  // DELETE CONTENT
  // POST COMMENT
  // LIKE/UNLIKE CONTENT
  // GET COMMENTS
  // EDIT COMMENT
  // DELETE COMMENT
  // GET ALL CONTENT
  // GET CREATOR CONTENT LIST
  // GET CONTENT BY ID

  // UTILS
  private func _getPriceFromTier(tier : Types.ContentTier) : Nat {
    switch (tier) {
      case (#Free) { 0 };
      case (#Tier1) { 30_00000000 }; // $30
      case (#Tier2) { 15_00000000 }; // $15
      case (#Tier3) { 5_00000000 }; // $5
    };
  };

  // Helper function to convert Content to ContentPreview
  private func toContentPreview(content : Types.Content) : Types.ContentPreview {
    {
      id = content.id;
      creatorId = content.creatorId;
      title = content.title;
      description = content.description;
      tier = content.tier;
      thumbnail = content.thumbnail;
      categories = content.categories;
      likesCount = content.likes.size();
      commentsCount = content.comments.size();
    };
  };

  // Helper function to check if user has access to content
  private func hasAccess(content : Types.Content, user : Principal) : Bool {
    switch (content.tier) {
      case (#Free) { true };
      case (_) {
        Array.find<Principal>(content.unlockedBy, func(p) { p == user }) != null;
      };
    };
  };
};
