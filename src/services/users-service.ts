import getDb from '@/lib/mongodb';
import roles from "@/roles";
import { UserInfo } from '@/types';
import { verifyMessage } from 'ethers';
import { ObjectId } from 'mongodb';

class UsersService {

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

  async loginWithSignature(message: string, signature: string): Promise<UserInfo | null> {
    const address = verifyMessage(message, signature); //throws?

    //search user by address
    const db = await getDb();
    const user = await db.collection<UserInfo>("users").findOne({ "address": address });

    if(user){
      user.roles = roles; //TODO: read from smart contract
      user.id = user._id.toString();
    }
    return user;
  }

}


export default UsersService;