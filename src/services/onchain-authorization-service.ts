import 'server-only';
import ContractsFactory from "@/blockchain/contracts";
import roles, { Role } from "@/roles";
import { Contract, Signer } from "ethers";
import { setUserRoles } from "@/blockchain/roles-admin";

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
    const role_ = roles[this.chainId].find(r => r.value === role);
    if (!role_) throw new Error(`Invalid role value: ${role}`);

    const result = await this.admin.hasUserRole(address, role_.app, role_.hash);
    return result;
  }

  async getRoles(address: string): Promise<Role[]> {
    
    const userRoles = [];
    for (const role of roles[this.chainId]) {
      if (await this.admin.hasUserRole(address, role.app, role.hash)) {
        userRoles.push(role);
      }
    }

    console.log(`User roles: ${address} on ${this.chainId}`, userRoles.map(r => r.value));

    return userRoles.map(role => role.value) as Role[];
  }


  /**
   * Agrega y/o quita roles de un address a través del contrato admin (setUserRoles).
   * Requiere un signer cuya cuenta tenga ADMIN_ROLE y esté conectado a la misma red del servicio.
   * Devuelve la transacción enviada; el caller decide cómo esperar la confirmación.
   */
  async assignRole(
    signer: Signer,
    address: string,
    rolesToAdd: Role[] = [],
    rolesToRemove: Role[] = []
  ) {
    if (!rolesToAdd.length && !rolesToRemove.length) {
      throw new Error("No roles to add or remove");
    }

    const resolve = (role: Role) => {
      const role_ = roles[this.chainId].find(r => r.value === role);
      if (!role_) throw new Error(`Invalid role value: ${role}`);
      return role_;
    };

    const toAdd = rolesToAdd.map(resolve);
    const toRemove = rolesToRemove.map(resolve);

    return setUserRoles(signer, await this.admin.getAddress(), address, toAdd, toRemove);
  }


}