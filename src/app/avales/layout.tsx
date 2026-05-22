import Page from "@/components/layout/page";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Page>
      <div className="mt-5 mb-15">
        {children}
      </div>
    </Page>
  );
}
