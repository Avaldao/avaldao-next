import { NextRequest, NextResponse } from "next/server";
import { Contract, JsonRpcProvider } from "ethers";
import ContractsFactory from "@/blockchain/contracts";
import avalAbi from "@/blockchain/contracts/avaldao/aval.abi";
import AvaldaoPlatformStatusModel from "@/lib/db/models/avaldao-platform-status-model";
import "@/lib/mongodb";
import AvalesService from "@/services/avales-service";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const chainId = Number(req.nextUrl.searchParams.get("chainId") ?? 30);

  if (chainId !== 30 && chainId !== 31) {
    return NextResponse.json({ error: "Invalid chainId" }, { status: 400 });
  }

  // Return cached snapshot if it's less than 60 seconds old and not stale
  const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
  const fresh = await AvaldaoPlatformStatusModel.findOne({
    chainId,
    fetchedAt: { $gte: oneMinuteAgo },
    stale: false,
  })
    .sort({ fetchedAt: -1 })
    .lean();

  if (fresh) {
    return NextResponse.json({ ...fresh, _id: String(fresh._id), cached: true });
  }

  // Fetch fresh data from blockchain
  try {
    const network = ContractsFactory.getNetworkInfo(chainId);
    const provider = new JsonRpcProvider(network.rpcUrl);
    const vaultContract = ContractsFactory.getVaultContract(chainId);
    const avaldaoContract = ContractsFactory.getAvaldaoContract(chainId);

    const [balanceResponse, avalIds] = await Promise.all([
      vaultContract!.getTokenBalance(network.tokens!.doc),
      avaldaoContract!.getAvalIds() as Promise<string[]>,
    ]);

    const fundBalanceDOC = Number(balanceResponse.amountFiat);
    const nowSecs = Math.floor(Date.now() / 1000);
    const ONCHAIN_VIGENTE = 3;

    const avalService = new AvalesService();

    const avalesData = await Promise.all(
      avalIds.map(async (id) => {
        try {
          const address: string = await avaldaoContract!.getAvalAddress(id);
          if (!address || address === "0x0000000000000000000000000000000000000000") {
            return null;
          }

          const avalContract = new Contract(address, avalAbi, provider);
          const solicitanteAddress: string = await avalContract.solicitante();


          const [onchainStatus, cuotasCantidad, reclamosLength, montoFiatRaw, summary] = await Promise.all([
            avalContract.status().then(Number),
            avalContract.cuotasCantidad().then(Number),
            avalContract.getReclamosLength().then(Number),
            avalContract.montoFiat().then(Number),
            avalService.getAvalSummary(id, solicitanteAddress),
          ]);

          const montoFiat = montoFiatRaw ? (montoFiatRaw / 100) : 0;
          const proyecto = summary?.proyecto || "";
          const solicitante = summary?.solicitante ?? { name: null, address: null };

          let lastCuotaTimestamp = 0;
          let unlockableCuotasCount = 0;
          let openReclamosCount = 0;

          const [cuotasResult, reclamosResult] = await Promise.all([
            cuotasCantidad > 0
              ? Promise.all(
                Array.from({ length: cuotasCantidad }, (_, i) =>
                  avalContract.cuotas(i).then((r: { timestampDesbloqueo: bigint; status: bigint }) => ({
                    timestampDesbloqueo: Number(r.timestampDesbloqueo),
                    status: Number(r.status),
                  }))
                )
              )
              : Promise.resolve([]),
            reclamosLength > 0
              ? Promise.all(
                Array.from({ length: reclamosLength }, (_, i) =>
                  avalContract.reclamos(i).then((r: { status: bigint }) => Number(r.status))
                )
              )
              : Promise.resolve([]),
          ]);

          if (cuotasResult.length > 0) {
            lastCuotaTimestamp = Math.max(...cuotasResult.map((c) => c.timestampDesbloqueo));
            unlockableCuotasCount = onchainStatus === ONCHAIN_VIGENTE
              ? cuotasResult.filter(
                  (c) => c.status === 0 && c.timestampDesbloqueo < nowSecs
                ).length
              : 0;
          }

          openReclamosCount = reclamosResult.filter((s) => s === 0).length;

          return {
            id,
            proyecto,
            solicitante,
            address,
            onchainStatus,
            montoFiat,
            cuotasCantidad,
            lastCuotaTimestamp,
            unlockableCuotasCount,
            openReclamosCount
          };
        } catch {
          return null;
        }
      })
    );

    const avales = avalesData.filter(
      (a): a is NonNullable<typeof a> => a !== null
    );

    const ONCHAIN_FINALIZADO = 4;

    const totalVigentes = avales.filter((a) => a.onchainStatus === ONCHAIN_VIGENTE).length;
    const totalFinalizados = avales.filter((a) => a.onchainStatus === ONCHAIN_FINALIZADO).length;
    const totalUnlockableCuotas = avales.reduce((s, a) => s + a.unlockableCuotasCount, 0);

    const snapshot = await AvaldaoPlatformStatusModel.create({
      chainId,
      fetchedAt: new Date(),
      stale: false,
      fundBalanceDOC,
      avales,
      totalUnlockableCuotas,
      totalVigentes,
      totalFinalizados,
    });

    return NextResponse.json({
      ...snapshot.toObject(),
      _id: String(snapshot._id),
      cached: false,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const chainId = Number(req.nextUrl.searchParams.get("chainId") ?? 30);

  await AvaldaoPlatformStatusModel.updateMany(
    { chainId, stale: false },
    { $set: { stale: true } }
  );

  return NextResponse.json({ success: true });
}
