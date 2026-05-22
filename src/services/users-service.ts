import getDb from '@/lib/mongodb';
import { UserInfo, UserUpsert } from '@/types';
import { ObjectId } from 'mongodb';
import { getCurrentUser, requireRoles } from '@/lib/auth/authorization';
import OnChainAuthorizationService from './onchain-authorization-service';


interface UserData {
  address: string;
}

class UsersService {


  //First check is address is already registered
  async registerProfile(request: UserData) {
    console.log(`register user`, request);

    const db = await getDb();
    const exists = await db.collection<UserInfo>("users").findOne({ "address": request.address });
    if (exists) {
      throw new Error("Address already registered");
    } else {
      //  id: string;
      /* address: string;
      email: string;
      infoCid?: string;
      name: string;
      avatar: string;
      roles: string[];
      url?: string; //deprecated
      website?: string;
       */
      /* await db.collection<UserInfo>("users").insertOne({ 


        //pending status

      }); */
    }



    return {};
  }




  
  async getAll(): Promise<UserInfo[]> {
    await requireRoles(["ADMIN_ROLE", "AVALDAO_ROLE"]); 
    
    const db = await getDb();
    const users = await db.collection<UserInfo>("users").find({}).toArray();

    return users.map(user => ({
      ...user,
      id: user._id.toString(), // Convertir ObjectId a string
      roles: []
    }));
  }


  //TODO: CRITICAL make it available only to admin users
  async getUser(id: string, options?: { resolveInfoCid: boolean }): Promise<UserInfo | null> {

    const db = await getDb();
    const user = await db.collection<UserInfo>("users").findOne({ "_id": new ObjectId(id) });
    if (user) {
      user.id = user._id.toString();
      console.log(`Fetching roles using chainid? ${process.env.DEFAULT_CHAIN_ID}`);
      const authorizationService = new OnChainAuthorizationService();
      user.roles = await authorizationService.getRoles(user.address);
      user.website = user.url ?? user.website;

      //resolve infocid
      if (!user.avatar && options?.resolveInfoCid && user.infoCid) {
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
  
  async getUserByAddress(address: string): Promise<UserInfo | null> {
    const requester = await getCurrentUser();
    //Esta funcion se usa en el formulario de aval. Al momento de completar un address hace un lookup por address
    //para mostrar el nombre y el avatar.

    //La linea anterior asegura que solo personas autenticadas pueden hacer ese lookup, 
    // pero no restringe que cualquier usuario pueda hacer lookup de cualquier address. 
    // Esto podria ser un problema de privacidad? En teoria el address es publico, 
    // pero el hecho de que puedas asociarlo a un nombre y avatar hace que sea mas sensible. 
    // Por ahora lo dejo asi, pero es algo para tener en cuenta.

    const db = await getDb();
    const user = await db.collection<UserInfo>("users").findOne({ "address": address });
    if (user) {
      const authorizationService = new OnChainAuthorizationService();
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