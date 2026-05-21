import { notFound, redirect } from "next/navigation";
import { requireRoles, UnauthenticatedError, UnauthorizedError } from "./authorization";
import { Role } from "@/roles";


export async function guardPage(requiredRoles: Role[]) {

  try {
    await requireRoles(requiredRoles);
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return notFound();
    }
    if (err instanceof UnauthenticatedError) {
      return redirect("/");
    }

    throw err;
  }

}

export function handleError(err: unknown) {
  if (err instanceof UnauthorizedError) {
    return notFound();
  }
  if (err instanceof UnauthenticatedError) {
    return redirect("/");
  }
}
