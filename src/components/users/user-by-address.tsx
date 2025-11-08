"use client";


import { shortenAddress } from "@/utils";
import { UserInfo } from "@/types";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function UserByAddress({ address }: { address: string }) {
  const [user, setUser] = useState<UserInfo>();
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchUserInfo();
  }, [address])


  async function fetchUserInfo() {
    try {
      setLoading(true);
      console.log("Fetch user info")
      const response = await fetch(`/api/users?address=${address}`);
      if (response.ok) {
        const user_ = await response.json() as UserInfo;
        setUser(user_);
        setLoading(false);


        if (user_.infoCid) {
          const response = await fetch(`https://ipfs.io${user_?.infoCid}`);
          const data = await response.json();
          if (data?.avatarCid) {
            setImageUrl(`https://ipfs.io${data.avatarCid}`);
          }
        }



      }
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false);
    }

  }

  /* Loading state with animate-pulse */

  return (
    loading ? <div></div> :
      user ? (
        <div className="flex items-center gap-x-2" >
          <div className="min-w-12 shrink-0">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt="Avatar"
              width={120}
              height={120}
              className="rounded-full w-12 h-12 object-cover aspect-square shrink-0 object-center"
            />
          )}
          </div>
          <div>
            {user.name}
          </div>
        </div>
      ) : <div>{shortenAddress(address)}</div>
  )

}