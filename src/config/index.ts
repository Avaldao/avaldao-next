
import { mainnet, arbitrum, celo, celoAlfajores, polygon, polygonAmoy, AppKitNetwork, rootstock, rootstockTestnet } from '@reown/appkit/networks'

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "b56e18d47c72ab683b10814fe9495694" // this is a public projectId only to use on localhost

if (!projectId) {
  throw new Error('Project ID is not defined')
}

export const networks = [
  rootstock,
  mainnet,
  arbitrum,
  celo,
  celoAlfajores,
  polygon,
  polygonAmoy,
  rootstockTestnet
] as [AppKitNetwork, ...AppKitNetwork[]]


export const jwtSecret = process.env.JWT_SECRET;



export const ROOTSTOCK_NETWORKS = {
  mainnet: {
    chainId: "0x1E", // 30
    chainName: "Rootstock Mainnet",
    rpcUrls: ["https://public-node.rsk.co"],
    nativeCurrency: {
      name: "Rootstock Bitcoin",
      symbol: "RBTC",
      decimals: 18,
    },
    blockExplorerUrls: ["https://explorer.rsk.co"],
  },
  testnet: {
    chainId: "0x1F", // 31
    chainName: "Rootstock Testnet",
    rpcUrls: ["https://public-node.testnet.rsk.co"],
    nativeCurrency: {
      name: "Testnet Rootstock Bitcoin",
      symbol: "tRBTC",
      decimals: 18,
    },
    blockExplorerUrls: ["https://explorer.testnet.rsk.co"],
  },
};

export const CONTRACTS_VERSION = process.env.AVALDAO_CONTRACTS_VERSION ?? "1";