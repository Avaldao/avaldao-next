"use client";

import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";

export default function ConnectedAddressInput() {
  const { data } = useSession();


  return (
    <Input
      readOnly
      value={data?.user.address}

    />
  )
}