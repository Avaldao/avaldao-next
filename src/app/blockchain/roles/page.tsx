import Page from "@/components/layout/page";
import OnChainAuthorizationService from "@/services/onchain-authorization-service";

export default async function BlockchainLab() {

  const service = new OnChainAuthorizationService();
  //await service.hasRole("0x42378fEad5534DbAFf26E7Fc10d24Cb9C6648b1e", "ADMIN_ROLE"); //admin acdi, has role admin
  /* 
  await service.hasRole("0x81519F8C093959db4A79D8364addad12dD9E853A", "SOLICITANTE_ROLE"); //comerciante - solicitante */

  //0x9048F048d6b9Bb99Df1ad1121400e05802F9Ce9d solicitante?
  await service.hasRole("0x9048F048d6b9Bb99Df1ad1121400e05802F9Ce9d", "SOLICITANTE_ROLE"); //solicitante
  await service.hasRole("0x81519F8C093959db4A79D8364addad12dD9E853A", "COMERCIANTE_ROLE"); //solicitante
  //yo 0xf719105A079fB340AF7e6D826dEAa7C008E7671E ninguem

  const roles = await service.getRoles("0x42378fEad5534DbAFf26E7Fc10d24Cb9C6648b1e");
  console.log(roles)

  return (
    <Page>

    </Page>
  )

}