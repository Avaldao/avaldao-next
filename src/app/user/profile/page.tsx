import Page from "@/components/layout/page";
import ProfileFormWrapper from "./profile-form-wrapper";
import { getLanguageCookie } from "@/lib/cookies";
import { translations } from "@/translations";
import { getCurrentUser } from "@/lib/auth/authorization";
import UsersService from "@/services/users-service";
import { redirect } from "next/navigation";


export default async function ProfilePage() {
  const language = await getLanguageCookie();
  const t = (key: string) => translations[key]?.[language] ?? key;
  let profile;

  try {
    const user = await getCurrentUser(); //basic user info from session, throws UnauthenticatedError is not user is logged in
    profile = await new UsersService().getUserProfile(user.id);
    if (!profile) {
      throw new Error("User profile not found");
    }
  } catch (err) {
    redirect("/");
  }




  return (
    <Page>
      <div className="text-2xl text-slate-800 text-heading mt-1  mb-6 flex space-between">
        {t("user.profile")}
      </div>
      <div className="mb-15">
        <ProfileFormWrapper
          profile={profile}
          language={language}
        />
      </div>
    </Page>
  )
}