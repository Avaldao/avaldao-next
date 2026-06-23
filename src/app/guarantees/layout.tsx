import StaffLayout from "@/components/ui/layout/staff-layout";
import { getCurrentUser } from "@/lib/auth/authorization";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  try {
    await getCurrentUser();
  } catch {
    redirect("/auth/login");
  }
  return <StaffLayout>{children}</StaffLayout>;
}
