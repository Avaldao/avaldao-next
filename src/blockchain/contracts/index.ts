import { Contract, JsonRpcProvider } from "ethers";
import vaultAbi from "./avaldao/vault.abi";
import adminAbi from "./avaldao/admin.abi";
import avaldaoAbi from "./avaldao/avaldao.abi";

interface ContractsAddress {
  rpcUrl: string;
  networkName: string;
  explorerUrl: string;
  avaldao: string;
  vault: string;
  permissions: string;
  tokens?: {
    doc: string;
  };
}
interface ContractsAddresses {
  [key: number]: ContractsAddress;
}

interface NetworkInfo {
  name: string;
  rpcUrl: string;
  explorerUrl: string;
}

export const networks: { [key: number]: NetworkInfo } = {
  30: {
    name: "Rootstock Mainnet",
    rpcUrl: process.env.MAINNET_RPC_URL!,
    explorerUrl: process.env.MAINNET_EXPLORER_URL!,
  },
  31: {
    name: "Rootstock Testnet",
    rpcUrl: process.env.TESTNET_RPC_URL!,
    explorerUrl: process.env.TESTNET_EXPLORER_URL!,
  }
}


export const contractsAddress: ContractsAddresses = {
  30: {
    rpcUrl: process.env.MAINNET_RPC_URL!,
    networkName: process.env.MAINNET_NETWORK_NAME!,
    explorerUrl: process.env.MAINNET_EXPLORER_URL!,
    avaldao: process.env.NEXT_PUBLIC_AVALDAO_CONTRACT_ADDRESS!,
    vault: process.env.NEXT_PUBLIC_VAULT_CONTRACT_ADDRESS!,
    permissions: process.env.NEXT_PUBLIC_AVALDAO_ADMIN_CONTRACT_ADDRESS!,
    tokens: {
      doc: process.env.NEXT_PUBLIC_DOC_CONTRACT_ADDRESS!
    }
  },
  31: {
    rpcUrl: process.env.TESTNET_RPC_URL!,
    networkName: process.env.TESTNET_NETWORK_NAME!,
    explorerUrl: process.env.TESTNET_EXPLORER_URL!,
    avaldao: process.env.NEXT_PUBLIC_TESTNET_AVALDAO_CONTRACT_ADDRESS!,
    vault: process.env.NEXT_PUBLIC_TESTNET_VAULT_CONTRACT_ADDRESS!,
    permissions: process.env.NEXT_PUBLIC_TESTNET_AVALDAO_ADMIN_CONTRACT_ADDRESS!,
    tokens: {
      doc: process.env.NEXT_PUBLIC_TESTNET_DOC_CONTRACT_ADDRESS!
    },
  }
}

export const rpcUrls: { [key: number]: string } = {
  30: process.env.MAINNET_RPC_URL!,
  31: process.env.TESTNET_RPC_URL!,
}

interface NetworkContracts {
  vault: Contract | null;
  permissions: Contract | null;
  avaldao: Contract | null;
}

export default class ContractsFactory {
  static providers: Record<number, JsonRpcProvider> = {};

  static getProvider(chainId: number): JsonRpcProvider {
    if (!this.providers[chainId]) {
      const rpcUrl = rpcUrls[chainId];

      if (!rpcUrl) {
        throw new Error(`RPC URL missing for chain ${chainId}`);
      }

      this.providers[chainId] = new JsonRpcProvider(rpcUrl);
    }

    return this.providers[chainId];
  }


  static contractAddresses: ContractsAddresses = contractsAddress;

  static networkContracts: {
    [key: number]: NetworkContracts
  } = {
      30: {
        vault: null,
        permissions: null,
        avaldao: null,
      },
      31: {
        vault: null,
        permissions: null,
        avaldao: null,
      }
    };

  static getNetworkInfo(chainId: number): ContractsAddress {
    const networkInfo = ContractsFactory.contractAddresses[chainId];
    if (!networkInfo) {
      throw new Error(`No contract information found for chain ID ${chainId}`);
    }
    return networkInfo;

  }

  static getVaultContract(chainId: number = Number(process.env.DEFAULT_CHAIN_ID!)) {
    const vaultAddress = contractsAddress[chainId].vault;
    const provider = ContractsFactory.getProvider(chainId);
    if (!ContractsFactory.networkContracts[chainId].vault) {
      ContractsFactory.networkContracts[chainId].vault = new Contract(vaultAddress, vaultAbi, provider);
    }
    return ContractsFactory.networkContracts[chainId].vault;
  }

  static getPermissionsContract(chainId: number = Number(process.env.DEFAULT_CHAIN_ID!)) {
    const permissionsAddress = contractsAddress[chainId].permissions;
    const provider = ContractsFactory.getProvider(chainId);
    if (!ContractsFactory.networkContracts[chainId].permissions) {
      ContractsFactory.networkContracts[chainId].permissions = new Contract(permissionsAddress, adminAbi, provider);
    }
    return ContractsFactory.networkContracts[chainId].permissions;
  }

  static getAvaldaoContract(chainId: number = Number(process.env.DEFAULT_CHAIN_ID!)) {
    const avaldaoAddress = contractsAddress[chainId].avaldao;
    const provider = ContractsFactory.getProvider(chainId);
    if (!ContractsFactory.networkContracts[chainId].avaldao) {
      ContractsFactory.networkContracts[chainId].avaldao = new Contract(avaldaoAddress, avaldaoAbi, provider);
    }
    return ContractsFactory.networkContracts[chainId].avaldao;
  }

}