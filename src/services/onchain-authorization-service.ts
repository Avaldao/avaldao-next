import ContractsFactory from "@/blockchain/contracts";
import roles, { Role } from "@/roles";
import { Contract } from "ethers";

export default class OnChainAuthorizationService {

  public admin: Contract;
  chainId: number;

  constructor(chainId: number = Number(process.env.DEFAULT_CHAIN_ID!)) {
    this.chainId = chainId;
    this.admin = ContractsFactory.getPermissionsContract(chainId);
  }

  getChainId() {
    return this.chainId;
  }

  async hasRole(address: string, role: Role) {
    const role_ = roles.find(r => r.value === role);
    if (!role_) throw new Error(`Invalid role value: ${role}`);

    const result = await this.admin.hasUserRole(address, role_.app, role_.hash);
    return result;
  }

  async getRoles(address: string): Promise<Role[]> {
    const userRoles = [];
    for (const role of roles) {
      if (await this.admin.hasUserRole(address, role.app, role.hash)) {
        userRoles.push(role);
      }
    }
    return userRoles.map(role => role.value) as Role[];
  }


  assignRole() { } //o roles puede ser plural but we need a signer


}