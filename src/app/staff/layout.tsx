import StaffLayout from "@/components/ui/layout/staff-layout";
import { guardPermission } from "@/lib/auth/page-guards";
import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  await guardPermission("users:read");
  return <StaffLayout>{children}</StaffLayout>;
}
