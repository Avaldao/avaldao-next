import Image from "next/image";

export default async function IPFSUserAvatar({ username, infoCid }: { username: string, infoCid?: string }) {

  let image;
  let emptyProfile = false;

  try {
    const response = await fetch(`https://ipfs.io${infoCid}`);
    const data = await response.json(); //en algunos va a funcionar y en otros no
    if (data?.avatarCid) {
      const imageUrl = `https://ipfs.io${data.avatarCid}`;
      const imageResponse = await fetch(imageUrl, {
        method: 'HEAD',
        signal: AbortSignal.timeout(5000)
      });
      if (imageResponse.ok) {
        image = (
          <Image
            src={imageUrl}
            alt="Avatar"
            width={120}
            height={120}
            className="rounded-full w-10 h-10 object-cover aspect-square shrink-0 object-center"

          />
        );
      } else {
        console.log(imageResponse);
        emptyProfile = true;
      }
    } else {
      emptyProfile = true;
    }

  } catch (err) {
    emptyProfile = true;
    /*     console.log(err); */
  }


  return (
    <div>
      {emptyProfile ? (
        <div className={`
        w-10 h-10 
        flex items-center justify-center 
        rounded-full
        bg-linear-to-br 
          from-violet-800
          to-violet-400
          text-white
          text-heading
          font-medium
        
        `}>
          {username.charAt(0).toUpperCase()}
        </div>
      ) : image}
    </div>
  )
}