import { Contract, ContractRunner } from "ethers";
import adminAbi from "@/blockchain/contracts/avaldao/admin.abi";

export interface RoleRef {
  hash: string;
  app: string;
}

/**
 * Agrega y/o quita roles de un address mediante setUserRoles del contrato admin.
 * El runner debe ser un signer con ADMIN_ROLE conectado a la red del contrato.
 * Sin dependencias de servidor: se usa tanto desde el cliente como desde servicios.
 */
export function setUserRoles(
  runner: ContractRunner,
  adminAddress: string,
  userAddress: string,
  rolesToAdd: RoleRef[],
  rolesToRemove: RoleRef[]
) {
  const admin = new Contract(adminAddress, adminAbi, runner);
  return admin.setUserRoles(
    userAddress,
    rolesToAdd.map(r => r.hash),
    rolesToAdd.map(r => r.app),
    rolesToRemove.map(r => r.hash),
    rolesToRemove.map(r => r.app),
    { gasLimit: BigInt(500_000) }
  );
}
