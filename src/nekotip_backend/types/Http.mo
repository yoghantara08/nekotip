module {

  // Common Types

  // Optional: Type for handling timestamps
  public type Timestamp = Nat64;

  // 1. Type that describes the Request arguments for an HTTPS outcall
  // See: https://internetcomputer.org/docs/current/references/ic-interface-spec/#ic-http_request
  public type HttpRequestArgs = {
    url : Text;
    max_response_bytes : ?Nat64;
    headers : [HttpHeader];
    body : ?[Nat8];
    method : HttpMethod;
    transform : ?TransformRawResponseFunction;
  };

  public type HttpHeader = {
    name : Text;
    value : Text;
  };

  public type HttpMethod = {
    #get;
    #post;
    #head;
  };

  public type HttpResponsePayload = {
    status : Nat;
    headers : [HttpHeader];
    body : [Nat8];
  };

  // 2. Types for HTTPS outcall transform functionality

  // 2.1 Transform function type
  public type TransformRawResponseFunction = {
    function : shared query TransformArgs -> async HttpResponsePayload;
    context : Blob;
  };

  // 2.2 Arguments for the transform function
  public type TransformArgs = {
    response : HttpResponsePayload;
    context : Blob;
  };

  // Simplified payload type for Canister HTTP responses
  public type CanisterHttpResponsePayload = {
    status : Nat;
    headers : [HttpHeader];
    body : [Nat8];
  };

  public type TransformContext = {
    function : shared query TransformArgs -> async HttpResponsePayload;
    context : Blob;
  };

  // 3. Declaring the IC management canister which we use to make the HTTPS outcall
  public type IC = actor {
    http_request : HttpRequestArgs -> async HttpResponsePayload;
  };
};
