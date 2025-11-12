import getDb from '@/lib/mongodb';
import roles from "@/roles";
import { UserInfo, UserUpsert } from '@/types';
import { verifyMessage } from 'ethers';
import { ObjectId } from 'mongodb';
import OnChainAuthorizationService from '@/services/onchain-authorization-service';



const authorizationService = new OnChainAuthorizationService();

class UsersService {

  async loginWithSignature(message: string, signature: string): Promise<UserInfo | null> {
    const address = verifyMessage(message, signature); //throws?

    const db = await getDb();
    const user = await db.collection<UserInfo>("users").findOne({ "address": address });

    if (user) {
      user.id = user._id.toString();
      user.roles = await authorizationService.getRoles(address);
      user.website = user.url ?? user.website;
      //populate avatar
    }

    if(user?.address == "0x8b8099bB67EAC696148cBa04575828635Ba7Cee6"){
      user.roles.push("SOLICITANTE_ROLE")
    }


    return user;
  }


  //TODO: CRITICAL make it available only to admin users
  async getAll(): Promise<UserInfo[]> {
    const db = await getDb();
    const users = await db.collection<UserInfo>("users").find({}).toArray();

    return users.map(user => ({
      ...user,
      id: user._id.toString(), // Convertir ObjectId a string
      roles: []
    }));
  }


  //TODO: CRITICAL make it available only to admin users
  async getUser(id: string, options: { resolveInfoCid: boolean }): Promise<UserInfo | null> {

    const db = await getDb();
    const user = await db.collection<UserInfo>("users").findOne({ "_id": new ObjectId(id) });
    if (user) {
      user.id = user._id.toString();
      user.roles = await authorizationService.getRoles(user.address);
      user.website = user.url ?? user.website;

      //resolve infocid
      if (!user.avatar && options.resolveInfoCid && user.infoCid) {
        try {
          const response = await fetch(`https://ipfs.io${user.infoCid}`);
          const data = await response.json();
          if (data.avatarCid) {
            user.avatar = `https://ipfs.io${data.avatarCid}`
          }
        } catch (err) {
          console.log(err);
        }
      }
  }

    return user;
  }
  //TODO: CRITICAL make it available only to admin users
  async getUserByAddress(address: string): Promise < UserInfo | null > {
  const db = await getDb();
  const user = await db.collection<UserInfo>("users").findOne({ "address": address });
  if(user) {
    user.roles = await authorizationService.getRoles(user.address);
    user.id = user._id.toString();
    user.website = user.url ?? user.website;
  }

    return user;
}



  async updateProfile(data: UserUpsert) {

  let pinataResponse;
  //Procesar data.avatar, ahi podriamos ver desde el front si se modifico o no
  if (data.avatar) {
    //subir el archivo a IPFS, y despues decirle a pinata que lo pinee

    // Convert the uploaded File into a Blob or readable stream
    const fileBuffer = Buffer.from(await data.avatar.arrayBuffer());
    const pinataData = new FormData();
    pinataData.append("file", new Blob([fileBuffer]), data.avatar.name);

    // Use fetch instead of axios
    const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        pinata_api_key: process.env.PINATA_API_KEY!,
        pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY!,
      },
      body: pinataData,
    });

    if (response.ok) {
      pinataResponse = await response.json();
    }
  }



  const db = await getDb();

  const update: Record<string, any> = {
    email: data.email,
    name: data.name,
    url: data.website,
    website: data.website
  };

  if (pinataResponse?.IpfsHash) {
    update.avatar = `https://ipfs.io/ipfs/${pinataResponse.IpfsHash}`;
  }




  const user = await db.collection<UserInfo>("users")
    .findOneAndUpdate(
      { _id: new ObjectId(data.id) },
      { $set: update },
      { returnDocument: "after" }
    );

  return {
    avatar: update.avatar,
    ...user
  }

}
}


export default UsersService;