"use server";

import avaldaoAbi from "@/blockchain/contracts/avaldao/avaldao.abi";
import { authOptions } from "@/lib/auth";
import OnChainAuthorizationService from "@/services/onchain-authorization-service";
import { Contract, JsonRpcProvider } from "ethers";
import { getServerSession } from "next-auth";

export default async function checkRoles() {
  const session = await getServerSession(authOptions);
  const authorizationService = new OnChainAuthorizationService(31);
  const chainId = authorizationService.getChainId();

  console.log("Checking roles for chainId:", chainId);
  const roles = await authorizationService.getRoles("0xdEC19efEEf1962D82FfAA3FC8C9A8064BF5Bbe3c");
  console.log("Roles for address", session.user.address, ":", roles);

}