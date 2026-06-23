import StaffLayout from "@/components/ui/layout/staff-layout";
import { guardPage } from "@/lib/auth/page-guards";
import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  await guardPage(["ADMIN_ROLE"]);
  return <StaffLayout>{children}</StaffLayout>;
}
