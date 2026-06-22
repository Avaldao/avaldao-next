import SideImageLayout from "@/components/layout/side-image-layout";
import ActivateAccountClient from "./activate-account-client";
import { getLanguageCookie } from "@/lib/cookies";

export default async function ActivateAccountPage({ params }: { params: Promise<{ token?: string }> }) {
  const { token } =  await params;
  const language = await getLanguageCookie();

  return (
    <SideImageLayout>
      <ActivateAccountClient
        language={language}
        token={token!}
      />
    </SideImageLayout>
  );
}