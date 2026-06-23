"use client";

import { SessionProvider } from "next-auth/react";
import ProfileForm from "./profile-form";
import { ProfileUser } from "@/services/users-service";
import { LanguageProvider } from "@/context/LanguageContext";
import { Language } from "@/translations";

export default function ProfileFormWrapper({ profile, language }: { profile: ProfileUser, language: Language }) {

  return (
    <SessionProvider>
      <LanguageProvider initialLanguage={language}>
        <ProfileForm
          key={new Date().getTime()}
          user={profile}
        />
      </LanguageProvider>
    </SessionProvider>
  )
}