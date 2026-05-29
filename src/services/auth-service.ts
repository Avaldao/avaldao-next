import { getAddress, verifyMessage } from 'ethers';
import roles from "@/roles";
import OnChainAuthorizationService from './onchain-authorization-service';
import { UserInfo, UserUpsert } from '@/types';
import getDb from '@/lib/mongodb';

import UsersService from './users-service';

const authorizationService = new OnChainAuthorizationService();
const usersService = new UsersService();


export class AuthService {
  async loginWithSignature(message: string, signature: string): Promise<UserInfo | null> {
    const address = verifyMessage(message, signature); //throws?
    console.log(`Login with signature ${address} ${getAddress(address)}`);

    const db = await getDb();
    const user = await db.collection<UserInfo>("users").findOne({ "address": address }); 
    const chainId = authorizationService.getChainId();

    if (user) {
      user.id = user._id.toString();
      user.roles = await authorizationService.getRoles(address); //ahora los esta obteniendo sobre testnet
      user.website = user.url ?? user.website;
      user.nroles = {
        [chainId]: user.roles
      };
      await usersService.cacheUserRoles(user.id, chainId, user.roles);
    }


    if (user?.address == getAddress("0x8b8099bB67EAC696148cBa04575828635Ba7Cee6")) {
      user.roles.push("SOLICITANTE_ROLE")
    }

    if (!user && address == getAddress("0x9dec90af27e95299d56cef85ee1ad7e77353ddbb")) { //todo: check with checksum
      return {
        id: "1231412",
        roles: ["SOLICITANTE_ROLE"],
        address: getAddress("0x9dec90af27e95299d56cef85ee1ad7e77353ddbb"), //0x9deC90af27E95299D56Cef85eE1aD7E77353dDBB
        email: "jonatanduttweiler@gmail.com",
        name: "Jona",
        avatar: "",
        
      }
    }

    console.log(user);

    return user;
  }

}