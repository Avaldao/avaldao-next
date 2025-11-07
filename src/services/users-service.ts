import getDb from '@/lib/mongodb';
import jwt from 'jsonwebtoken';
import roles from "@/roles";

interface UserInfo {
  token: string;
  address: string;
  email: string;
  infoCid?: string;
  name: string;
  avatar: string;
  roles: string[];
}


class UsersService {

  async getUserByAddress(address: string): Promise<UserInfo> {

    //Veamos de hacer la consulta directamente a la base de mongo si podemos
    /* const db = await getDb();
    const users = await db.collection("users").find({}).toArray();

    console.log(users); */
    //Para los roles usaba una consulta al smart contract 

    
    const user: UserInfo = {
      address: "0x8b8099bB67EAC696148cBa04575828635Ba7Cee6",
      name: "Jonatan Duttweiler",
      avatar: "",
      email: "jonatanduttweiler@gmail.com",
      infoCid: "/ipfs/QmVf8SB5we2pT7M518MGP8H1BqkvfBrpzEMWrzfAaXVuLb",
      roles: roles, //TODO: get from the smart contract
      token: ""
    }

    return new Promise((resolve) => {
      if (address == "0x8b8099bB67EAC696148cBa04575828635Ba7Cee6") {
        user.token = jwt.sign(user, process.env.JWT_SECRET!, { expiresIn: '1h' });
        return resolve(user);
      }
    });
  }



}


export default UsersService;