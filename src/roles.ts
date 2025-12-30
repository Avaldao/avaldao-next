//Como asigno nuevos desde el smart contract?

const adminContractAddress = process.env.ADMIN_CONTRACT_ADDRESS;
const avaldaoContractAddress = process.env.AVALDAO_CONTRACT_ADDRESS;


export const ADMIN_ROLE = {
  value: "ADMIN_ROLE",
  hash: "0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775",
  label: "Admin",
}

export const AVALDAO_ROLE = {
   value: "AVALDAO_ROLE",
  hash: "0x6fe48ba75814b08c0dddc279841efe9da58be3efa246107d47304a151682bb53",
  label: "Avaldao",
}

const roles = [{
  value: "ADMIN_ROLE",
  hash: "0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775",
  label: "Admin",
  app: adminContractAddress //Should be based on env, not depends on role
},
{
  value: "AVALDAO_ROLE",
  hash: "0x6fe48ba75814b08c0dddc279841efe9da58be3efa246107d47304a151682bb53",
  label: "Avaldao",
  app: avaldaoContractAddress
},
{
  value: "SOLICITANTE_ROLE",
  hash: "0xfb35233533db5c7fd0b9bddd918dc9ee7dc650bcb29116685e303e733d8351bb",
  label: "Solicitante",
  app: avaldaoContractAddress
},
{
  value: "COMERCIANTE_ROLE",
  hash: "0xf95d0e1c3ba95ce4614532f244d16b0981be4cfc6964c018cf3b9e6d860c5c6e",
  label: "Comerciante",
  app: avaldaoContractAddress
},
{
  value: "AVALADO_ROLE",
  hash: "0x780a0ec41e5ee507f458f09f4a20097a58d10125acb87277c67891025e16cef6",
  label: "Avalado",
  app: avaldaoContractAddress
}]

export default roles;

export type Role =
  | "ADMIN_ROLE"
  | "AVALDAO_ROLE"
  | "SOLICITANTE_ROLE"
  | "COMERCIANTE_ROLE"
  | "AVALADO_ROLE";


/* 


reduced abis? blockchain/contracts/avaldao/admin.abi.ts
const web3 = require("web3");
const config = require("../../../config/config");

//Leer roles desde el config?
const ADMIN_ROLE = "ADMIN_ROLE";
const AVALDAO_ROLE = "AVALDAO_ROLE";
const SOLICITANTE_ROLE = "SOLICITANTE_ROLE";
const COMERCIANTE_ROLE = "COMERCIANTE_ROLE";
const AVALADO_ROLE = "AVALADO_ROLE";

const roles = config.roles;

module.exports = {
  AVALDAO_ROLE,
  SOLICITANTE_ROLE,
  COMERCIANTE_ROLE,
  AVALADO_ROLE,
  roles
}


  const contract = require("./admin-contract");
const { roles } = require("./roles");

async function getRoles(address) { //Needs contract
  const userRoles = [];

  for (const rol of roles) {

    console.log(`Consultando rol ${rol.value} de usuario ${address}. Admin: ${contract.options.address}`)

    const hasUserRole = await contract.methods.hasUserRole(
      address,
      rol.app, //debe ser una direccion nomas
      rol.hash).call();

    console.log(`Rol ${rol.value} de usuario ${address}: ${hasUserRole}.`);

    if (hasUserRole) {
      userRoles.push(rol.value);
    }
  }

  return userRoles;
}//returns array of roles

module.exports = getRoles; */
