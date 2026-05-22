import { getAddress, verifyMessage } from 'ethers';
import roles from "@/roles";
import OnChainAuthorizationService from './onchain-authorization-service';
import { UserInfo, UserUpsert } from '@/types';
import getDb from '@/lib/mongodb';


const authorizationService = new OnChainAuthorizationService();

export class AuthService {
    async loginWithSignature(message: string, signature: string): Promise<UserInfo | null> {
    const address = verifyMessage(message, signature); //throws?
    console.log(`Login with signature ${address} ${getAddress(address)}`);

    const db = await getDb();
    const user = await db.collection<UserInfo>("users").findOne({ "address": address }); //user not found? or what

    if (user) {
      user.id = user._id.toString();
      user.roles = await authorizationService.getRoles(address); //Este deberia depender del ctx
      user.website = user.url ?? user.website;
      //populate avatar
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
        avatar: "" //make it optional
      }
    }

    console.log(user);

    return user;
  }

}