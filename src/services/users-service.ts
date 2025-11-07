import getDb from '@/lib/mongodb';
import roles from "@/roles";
import { verifyMessage } from 'ethers';

interface UserInfo {
  id: string;
  address: string;
  email: string;
  infoCid?: string;
  name: string;
  avatar: string;
  roles: string[];
}


class UsersService {

  async loginWithSignature(message: string, signature: string): Promise<UserInfo> {
    const address = verifyMessage(message, signature); //throws?

    //search user by address


    //alternatively get roles
    const user: UserInfo = {
      id:"asd",
      address: "0x8b8099bB67EAC696148cBa04575828635Ba7Cee6",
      name: "Jonatan Duttweiler",
      avatar: "",
      email: "jonatanduttweiler@gmail.com",
      infoCid: "/ipfs/QmVf8SB5we2pT7M518MGP8H1BqkvfBrpzEMWrzfAaXVuLb",
      roles: roles, //TODO: get from the smart contract
    }

    return new Promise((resolve) => {
      if (address == "0x8b8099bB67EAC696148cBa04575828635Ba7Cee6") {
        return resolve(user);
      }
    });
  }


  async getUserByAddress(address: string): Promise<UserInfo> {

    //Veamos de hacer la consulta directamente a la base de mongo si podemos
    /* const db = await getDb();
    const users = await db.collection("users").find({}).toArray();

    console.log(users); */
    //Para los roles usaba una consulta al smart contract 


    const user: UserInfo = {
      id: "asd",
      address: "0x8b8099bB67EAC696148cBa04575828635Ba7Cee6",
      name: "Jonatan Duttweiler",
      avatar: "",
      email: "jonatanduttweiler@gmail.com",
      infoCid: "/ipfs/QmVf8SB5we2pT7M518MGP8H1BqkvfBrpzEMWrzfAaXVuLb",
      roles: roles, //TODO: get from the smart contract
     
    }

    return new Promise((resolve) => {
      if (address == "0x8b8099bB67EAC696148cBa04575828635Ba7Cee6") {
        return resolve(user);
      }
    });
  }



}


export default UsersService;