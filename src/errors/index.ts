export class NotAuthenticatedError extends Error {
  constructor(message = "User is not authenticated") {
    super(message);
    this.name = "NotAuthenticatedError";
  }
}

//TODO: include missing role
export class NotAuthorizedError extends Error {
  constructor(message = "User is not authorized") {
    super(message);
    this.name = "NotAuthorizedError";
  }
}
