import Page from "@/components/layout/page";
import ProfileFormWrapper from "./profile-form-wrapper";
export default async function ProfilePage() {
  return (
    <Page>
      <div className="text-2xl text-slate-800 text-heading mt-1  mb-6 flex space-between">
        User profile
      </div>
      <div className="mb-15">
        <ProfileFormWrapper />
      </div>
    </Page>
  )
}