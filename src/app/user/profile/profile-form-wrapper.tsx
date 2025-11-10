"use client";

import { SessionProvider, useSession } from "next-auth/react";
import ProfileForm from "./profile-form";

export default function ProfileFormWrapper() {

  return (
    <SessionProvider>
      <_ProfileForm />
    </SessionProvider>
  )
}

function _ProfileForm() {
  const { data: session, status, update } = useSession();

  if (status === "authenticated") {
    return (
      <ProfileForm
        key={new Date().getTime()}
        user={session?.user}
        update={update}

      />
    )
  }

}