import { Role } from "@/roles";
import { getServerSession, Session } from "next-auth";
import { authOptions } from ".";

export class UnauthenticatedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnauthenticatedError";
  }
} 
export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedError";
  }
}

/* This function can be used in any server component or route handler to protect it based on user roles. It checks if the current user has at least one of the required roles, and if not, it throws an error. If the user is authorized, it returns the session object, which can be used to access user information. */


export async function getCurrentUser(): Promise<Session["user"]>{
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new UnauthenticatedError("No user session found");
  }

  return session.user;
}


export async function requireRoles(requiredRoles: Role | Role[]) {

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new UnauthenticatedError("No user session found");
  }

  const testnetRoles = session.user.roles?.["31"] || [];
  const mainnetRoles = session.user.roles?.["30"] || [];

  const userRoles = mainnetRoles || [];

  const requiredRolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  const hasRequiredRole = requiredRolesArray.some(role => userRoles.includes(role));

  if (!hasRequiredRole) {
    throw new UnauthorizedError("The current user doesn't have any of the required roles: " + requiredRolesArray.join(", "));
  }

  return session;
}