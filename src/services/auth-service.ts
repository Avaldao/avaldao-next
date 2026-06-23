import 'server-only';
import { getAddress, verifyMessage } from 'ethers';
import roles from "@/roles";
import OnChainAuthorizationService from './onchain-authorization-service';
import { UserInfo, UserUpsert } from '@/types';
import getDb from '@/lib/mongodb';
import UsersService from './users-service';


export class AuthService {


  async loginWithCredentials(email: string, password: string): Promise<UserInfo | null> {
    const db = await getDb();
    const user = await db.collection<UserInfo>("users").findOne({ 
      "email": email , 
      "emailVerified": true, 
      "authMethods": { $in: ["email"] } 
    });
    
    if (user && user.password != undefined) {
      //check password hash
      const isPasswordValid = await UsersService.verifyUserPassword(user.password, password);
      if (!isPasswordValid) {
        throw new Error("INVALID_CREDENTIALS");
      }

      user.id = user._id.toString();
      user.website = user.url ?? user.website;

      if(user.address){
        const mainnetRoles = await (new OnChainAuthorizationService(30)).getRoles(user.address);
        const testnetRoles = await (new OnChainAuthorizationService(31)).getRoles(user.address);
  
        user.roles = mainnetRoles;
        user.nroles = {
          30: mainnetRoles,
          31: testnetRoles
        };
  
        await (new UsersService()).cacheUserRoles(user.id, 30, mainnetRoles);
        await (new UsersService()).cacheUserRoles(user.id, 31, testnetRoles);
      }


    } else {
      throw new Error("USER_NOT_FOUND");
    }

    return user;
  } 

  async loginWithSignature(message: string, signature: string): Promise<UserInfo | null> {
    const usersService = new UsersService();
    const address = verifyMessage(message, signature); 

    const db = await getDb();
    const user = await db.collection<UserInfo>("users").findOne({ "address": address });
    const chainId = new OnChainAuthorizationService().getChainId();

    if (user) {
      user.id = user._id.toString();
      user.website = user.url ?? user.website;
      
      const mainnetRoles = await (new OnChainAuthorizationService(30)).getRoles(address);
      const testnetRoles = await (new OnChainAuthorizationService(31)).getRoles(address);

      if(chainId == 30){
        user.roles = mainnetRoles;
      } else if(chainId == 31){
        user.roles = testnetRoles;
      } else {
        user.roles = [];
      }
      
      user.nroles = {
        30: mainnetRoles,
        31: testnetRoles
      };

      await usersService.cacheUserRoles(user.id, 30, mainnetRoles);
      await usersService.cacheUserRoles(user.id, 31, testnetRoles);

    } else {
      throw new Error("USER_NOT_FOUND");
    }

    /*     if (!user && address == getAddress("0x9dec90af27e95299d56cef85ee1ad7e77353ddbb")) { //todo: check with checksum
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
     */
    return user;
  }

}