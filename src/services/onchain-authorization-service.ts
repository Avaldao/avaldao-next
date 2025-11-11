/* Podemos tener un enum para roles, recordar que pasamos el hash de keccak */

import adminAbi from "@/blockchain/contracts/avaldao/admin.abi";
import roles, { Role } from "@/roles";
import { Contract, JsonRpcProvider } from "ethers";

const rpcUrl = process.env.RPC_URL;
const deployedAt = process.env.ADMIN_CONTRACT_ADDRESS!;

export default class OnChainAuthorizationService {
  public provider;
  public admin: Contract;

  constructor() {
    this.provider = new JsonRpcProvider(rpcUrl);
    this.admin = new Contract(deployedAt, adminAbi, this.provider);
  }

  async hasRole(address: string, role: Role) {
    const role_ = roles.find(r => r.value === role);
    if (!role_) throw new Error(`Invalid role value: ${role}`);

    const result = await this.admin.hasUserRole(address, role_.app, role_.hash);
    console.log(result);
    return result;
  }

  async getRoles(address: string) {
    const userRoles = [];
    for (const role of roles) {
      if (await this.admin.hasUserRole(address, role.app, role.hash)) {
        userRoles.push(role);
      }
    }
    return userRoles.map(role => role.value);
  }


  assignRole() { } //o roles puede ser plural but we need a signer


}