import getDb from '@/lib/mongodb';
import roles from "@/roles";
import { UserInfo, UserUpsert } from '@/types';
import { verifyMessage } from 'ethers';
import { ObjectId } from 'mongodb';



class UsersService {

  async loginWithSignature(message: string, signature: string): Promise<UserInfo | null> {
    const address = verifyMessage(message, signature); //throws?

    //search user by address
    const db = await getDb();
    const user = await db.collection<UserInfo>("users").findOne({ "address": address });

    console.log(user);

    if (user) {
      user.roles = roles; //TODO: read from smart contract
      user.id = user._id.toString();
      user.website = user.url ?? user.website;
      //populate avatar
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
  async getUser(id: string): Promise<UserInfo | null> {
    const db = await getDb();
    return db.collection<UserInfo>("users").findOne({ "_id": new ObjectId(id) });
  }
  //TODO: CRITICAL make it available only to admin users
  async getUserByAddress(address: string): Promise<UserInfo | null> {
    const db = await getDb();
    return db.collection<UserInfo>("users").findOne({ "address": address });
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

    const update: Record<string,any> = {
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
        { $set: update }
      );
    console.log(user)

  }
}


export default UsersService;