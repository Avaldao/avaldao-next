import "server-only";

import { Role } from "@/roles";
import { getServerSession, Session } from "next-auth";
import { authOptions } from ".";
import UsersModel from "@/lib/db/models/user-model";
import { Permission, resolvePermissions, STAFF_CHAIN_ID } from "./staff-roles";

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

  // Los roles por red viven en nroles; roles es un array plano.
  const userRoles = session.user.nroles?.[30] || [];

  const requiredRolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  const hasRequiredRole = requiredRolesArray.some(role => userRoles.includes(role));

  if (!hasRequiredRole) {
    throw new UnauthorizedError("The current user doesn't have any of the required roles: " + requiredRolesArray.join(", "));
  }

  return session;
}


/**
 * Permisos de backoffice del usuario de la sesión. Los roles offchain se leen de la DB en cada
 * llamada (no del JWT) para que revocar un rol tenga efecto inmediato.
 */
export async function getPermissions(session: Session): Promise<Permission[]> {
  const user = await UsersModel.findById(session.user.id).select("staffRoles").lean();
  const mainnetRoles = session.user.nroles?.[STAFF_CHAIN_ID] || [];
  return resolvePermissions(user?.staffRoles ?? [], mainnetRoles);
}

/** Como `requireRoles`, pero chequea un permiso de backoffice (roles offchain u onchain en mainnet). */
export async function requirePermission(permission: Permission) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new UnauthenticatedError("No user session found");
  }

  const permissions = await getPermissions(session);
  if (!permissions.includes(permission)) {
    throw new UnauthorizedError("The current user doesn't have the required permission: " + permission);
  }

  return session;
}

/** Si el usuario de la sesión tiene un permiso de backoffice, sin lanzar errores. */
export async function hasPermission(session: Session, permission: Permission) {
  return (await getPermissions(session)).includes(permission);
}
