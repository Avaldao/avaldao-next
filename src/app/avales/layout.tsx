import StaffLayout from "@/components/ui/layout/staff-layout";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return <StaffLayout>{children}</StaffLayout>;
}
