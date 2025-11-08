export function OkResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status: status,
    headers: { "Content-Type": "application/json" },
  });
}
/* 
import { ForbiddenPermissionError, ForbiddenRoleError, NotAuthenticatedError } from "@/errors/auth-errors";
import { DuplicateKeyError } from "@/errors/business-error";

export type ApiError =
  | "NotAuthenticatedError"
  | "ForbiddenPermissionError"
  | "ForbiddenRoleError"; */

// errorHandler.ts
export function handleError(err: unknown): Response {
  console.log(err);
  const headers = { "Content-Type": "application/json" };

  // Handle known authentication/permission errors
/*   if (err instanceof NotAuthenticatedError) {
    return new Response(
      JSON.stringify({ name: "NotAuthenticatedError", message: "Not authenticated" }),
      { status: 401, headers }
    );
  }

  if (err instanceof ForbiddenPermissionError) {
    return new Response(
      JSON.stringify({ name: "ForbiddenPermissionError", message: err.message, missing: err.requiredPermission }),
      { status: 403, headers }
    );
  }
  if (err instanceof ForbiddenRoleError) {
    return new Response(
      JSON.stringify({ name: "ForbiddenRoleError", message: err.message, missing: err.requiredRole }),
      { status: 403, headers }
    );
  }


  if (err instanceof DuplicateKeyError) {
    return new Response(
      JSON.stringify({ 
        message: err.message || "Internal Server Error",
        errorType: "DuplicateKeyError",
        entity: err.entity,
        field: err.field  
      }),
      { status: 500, headers }
    );
  }
 */
  // Handle generic Error objects
  if (err instanceof Error) {
    return new Response(
      JSON.stringify({ message: err.message || "Internal Server Error" }),
      { status: 500, headers }
    );
  }

  // Handle non-Error thrown values
  return new Response(
    JSON.stringify({ message: "Internal Server Error" }),
    { status: 500, headers }
  );
}
