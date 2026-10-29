/**
 * Roles offchain de la plataforma (backoffice). Viven en MongoDB, en `User.staffRoles`,
 * y no dependen de ninguna red. Son independientes de los roles onchain (`@/roles`) y
 * de `platformRoles` (lo que el usuario declara al registrarse).
 *
 * Este módulo no importa nada de servidor para poder usarse también desde componentes cliente.
 */

export type StaffRole = "USER_VIEWER" | "USER_REVIEWER" | "USER_ADMIN" | "AVAL_VIEWER" | "AVAL_CREATOR" | "DASHBOARD_VIEWER";

export type Permission =
  | "users:read"     // ver el listado y el detalle de usuarios
  | "users:review"   // verificar, rechazar o suspender la identidad de un usuario
  | "users:manage"   // crear usuarios y reenviar mails de activación
  | "users:roles"    // asignar roles offchain a otros usuarios
  | "users:delete"   // eliminar usuarios
  | "avales:read"    // ver todos los avales de todas las redes
  | "avales:create"  // crear avales (solicitar una garantía)
  | "dashboard:read"; // ver el dashboard de la plataforma (estado del fondo y de los avales)

export const STAFF_ROLES: StaffRole[] = ["USER_VIEWER", "USER_REVIEWER", "USER_ADMIN", "AVAL_VIEWER", "AVAL_CREATOR", "DASHBOARD_VIEWER"];

export const STAFF_ROLE_PERMISSIONS: Record<StaffRole, Permission[]> = {
  USER_VIEWER: ["users:read"],
  USER_REVIEWER: ["users:read", "users:review"],
  USER_ADMIN: ["users:read", "users:review", "users:manage", "users:roles", "users:delete"],
  AVAL_VIEWER: ["avales:read"],
  AVAL_CREATOR: ["avales:create"],
  DASHBOARD_VIEWER: ["dashboard:read"],
};

const ALL_PERMISSIONS: Permission[] = ["users:read", "users:review", "users:manage", "users:roles", "users:delete", "avales:read", "avales:create", "dashboard:read"];

/** Red cuyos roles onchain dan permisos de staff (Rootstock Mainnet). */
export const STAFF_CHAIN_ID = 30;

export function isStaffRole(value: unknown): value is StaffRole {
  return typeof value === "string" && (STAFF_ROLES as string[]).includes(value);
}

/**
 * Permisos efectivos de un usuario a partir de sus roles offchain y sus roles onchain en mainnet.
 * - ADMIN_ROLE onchain en mainnet: todos los permisos.
 * - AVALDAO_ROLE onchain en mainnet: solo lectura de usuarios (el acceso que ya tenía).
 * - SOLICITANTE_ROLE en `platformRoles` (lo que el usuario declara al registrarse): crear avales.
 */
export function resolvePermissions(
  staffRoles: readonly string[] = [],
  mainnetRoles: readonly string[] = [],
  platformRoles: readonly string[] = [],
): Permission[] {
  const permissions = new Set<Permission>();

  if (mainnetRoles.includes("ADMIN_ROLE")) {
    ALL_PERMISSIONS.forEach(p => permissions.add(p));
  }
  if (mainnetRoles.includes("AVALDAO_ROLE")) {
    permissions.add("users:read");
  }
  if (platformRoles.includes("SOLICITANTE_ROLE")) {
    permissions.add("avales:create");
  }
  for (const role of staffRoles) {
    if (isStaffRole(role)) STAFF_ROLE_PERMISSIONS[role].forEach(p => permissions.add(p));
  }

  return [...permissions];
}
