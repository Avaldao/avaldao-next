module.exports = {
  apps: [
    {
      name: "avaldao",
      script: "server.js",
      cwd: "/home/deploy/avaldao/current",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        NEXTAUTH_URL: "https://avaldao.com",
        NEXTAUTH_SECRET: "d8d74a152205f5c36b29f3bb03547abc5397520867d890b86753b9e4472ca48c",
        JWT_SECRET: "d8d74a152205f5c36b29f3bb03547abc5397520867d890b86753b9e4472ca48c",
        MONGO_DB_USERS: "mongodb+srv://efem-production:YYEEPAJITF7rdT0U@cluster0.e73km.mongodb.net/efem-users-production?appName=Cluster0",

        DEFAULT_CHAIN_ID: "30",

        MAINNET_RPC_URL: "https://rpc.mainnet.rootstock.io/LljCg1DRA1z2fC36O53rbhRCzW6XKd-M",
        TESTNET_RPC_URL: "https://rpc.testnet.rootstock.io/LKUx5KZLhmSdadqjmH0xcUVIhyj5D3-T",

        AVALDAO_CONTRACTS_VERSION: "1",
        ADMIN_CONTRACT_ADDRESS: "0x7D64C1532Efa7bd0d1554b4876d01e8c273fA129",
        AVALDAO_CONTRACT_ADDRESS: "0x6DC9BCDD6fe5822D7E52Ac06E3ae740faa5d57a5",
        VAULT_CONTRACT_ADDRESS: "0x7EBCA6DD2EFF325FfE68B2710F0f537ebc6D1Be9",
        DOC_CONTRACT_ADDRESS: "0xe700691dA7b9851F2F35f8b8182c69c53CcaD9Db",

        TESTNET_ADMIN_CONTRACT_ADDRESS: "0x35e08235457394A1C50dF3C1641BD4996F2EBB5F",
        TESTNET_AVALDAO_CONTRACT_ADDRESS: "0x0185e73DaaC1FBF56f71448477026A6A3Dd39aFE",
        TESTNET_VAULT_CONTRACT_ADDRESS: "0x95Caa33B65e07474F627AaF5D3E23b846489A0D1",
        TESTNET_DOC_CONTRACT_ADDRESS: "0xCB46c0ddc60D18eFEB0E586C17Af6ea36452Dae0",

        USER_AVALDAO_ADDRESS: "0x42378fEad5534DbAFf26E7Fc10d24Cb9C6648b1e",
        TESTNET_USER_AVALDAO_ADDRESS: "0x9dEc90aF27e95299d56CEf85ee1aD7e77353DDBb",

        PINATA_API_KEY: "b7253ea050fa043443f6",
        PINATA_SECRET_API_KEY: "a3f6600611fe6d90ecc8a6b16a23d8c44114757c9ccd493da0c96f526f249464",

        SMTP_SERVER_HOST: "smtp.gmail.com",
        SMTP_SERVER_USERNAME: "avaldao.sgr@gmail.com",
        SMTP_SERVER_PASSWORD: "uwkp gyon getj butp",

        RECAPTCHA_SECRET_KEY: "6LeHdi0tAAAAAC967ltSFKpz9lETwtbB7B9XvWhF",
      },
    },
  ],
};
