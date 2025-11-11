import { formatEther, JsonRpcProvider, Wallet } from "ethers";

export const networks = {
  celoSepolia: "https://forno.celo-sepolia.celo-testnet.org"
};


export class BlockchainGateway {
  public provider;
  public signer;

  constructor(rpcUrl: string) { //Tambien podriamos recibir un signer o una pk
    this.provider = new JsonRpcProvider(rpcUrl);
    this.signer = new Wallet(process.env.PRIVATE_KEY!, this.provider); //Esto probablemente sea distinto, porque las tx las voy a enviar con la wallet del usuario conectado
    //Es mas parecido a lo de forestmaker, igual tenemos código para eso. Por ahora asignemos roles admin a mi usuario para poder 
    //asignar roles
    
    this.printInfo();
  }

  private async printInfo() {
    console.log(`Blockchain gateway initialize with address: ${this.signer.address}. Balance: ${formatEther(await this.provider.getBalance(this.signer.address))} CELO`);
  }

  async getBalance(address: string) {
    return await this.provider.getBalance(address);
  }

  async sendTransaction(txData: any) {
    // sign + send transaction logic  
  }



  // you can also wrap contract calls here
}