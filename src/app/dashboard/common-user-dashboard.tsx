import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UnauthenticatedError } from "@/lib/auth/authorization";
import AvalesService from "@/services/avales-service";
import { Aval } from "@/types";
import { AvalStatusChip } from "@/components/avaldao/avales/aval-status-chip";
import { contractsAddress } from "@/blockchain/contracts";
import { ConnectWalletBannerWrapper } from "@/components/connect-wallet-banner";
import LanguageWrapper from "@/components/LanguageWrapper";
import { getLanguageCookie } from "@/lib/cookies";
import { format } from "date-fns";
import { LayoutDashboard, ChevronRight, FileCheck } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Buenos días";
  if (hour < 19) return "Buenas tardes";
  return "Buenas noches";
}

function formatDate() {
  return new Date().toLocaleDateString("es-AR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const NetworkChip = ({ chainId }: { chainId: Aval["chainId"] }) => {
  const isMainnet = chainId === 30;
  const networkName = contractsAddress[chainId]?.networkName ?? `Chain ${chainId}`;
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
        isMainnet ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
      )}
    >
      {networkName}
    </span>
  );
};

function MisAvalesTable({ avales }: { avales: Aval[] }) {
  if (avales.length === 0) {
    return (
      <div className="rounded-xl border border-slate-100 bg-slate-50 py-12 text-center">
        <FileCheck className="mx-auto mb-3 h-8 w-8 text-slate-300" />
        <p className="text-sm font-medium text-slate-500">No participás en ningún aval todavía</p>
        <p className="mt-1 text-xs text-slate-400">Cuando participes en un aval, aparecerá aquí</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-100 shadow-sm">
      <table className="min-w-full divide-y divide-gray-100">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Fecha</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Proyecto</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Red</th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Monto</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Estado</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {avales.map((aval) => (
            <tr key={aval._id} className="transition-colors hover:bg-slate-50">
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                {format(new Date(aval.createdAt), "dd/MM/yyyy")}
              </td>
              <td className="px-4 py-3">
                <p className="text-sm font-medium text-slate-800 truncate max-w-xs">{aval.proyecto}</p>
                <p className="mt-0.5 text-xs text-gray-400 line-clamp-1">{aval.objetivo}</p>
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <NetworkChip chainId={aval.chainId} />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-semibold text-slate-600">
                ${(aval.montoFiat / 100).toFixed(2)}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <AvalStatusChip status={aval.status} variant="compact" />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-center">
                <Link
                  href={`/avales/${aval._id}`}
                  className="inline-flex items-center justify-center rounded-lg bg-secondary p-1.5 text-white transition-colors hover:bg-secondary-accent"
                  title="Ver detalles"
                >
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function CommonUserDashboard() {
  const session = await getServerSession(authOptions);
  const language = await getLanguageCookie();
  const firstName = session?.user?.name?.split(" ")[0] ?? "";
  const hasAddress = !!session?.user?.address;

  let avales: Aval[] = [];
  try {
    avales = await new AvalesService().getAvales();
  } catch (err) {
    if (!(err instanceof UnauthenticatedError)) {
      console.error(err);
    }
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Greeting */}
      <div className="border-b border-slate-100 pb-6">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
            <LayoutDashboard className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-slate-400">
              {formatDate()}
            </p>
            <h1 className="mt-0.5 text-2xl font-bold text-slate-800">
              {getGreeting()}{firstName ? `, ${firstName}` : ""}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Plataforma Avaldao · Tu panel personal
            </p>
          </div>
        </div>
      </div>

      {/* Connect Wallet Banner — only rendered if address is not set */}
      {!hasAddress && (
        <LanguageWrapper language={language}>
          <ConnectWalletBannerWrapper />
        </LanguageWrapper>
      )}

      {/* Mis Avales */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-800">Mis Avales</h2>
          <span className="text-xs text-slate-400">{avales.length} aval{avales.length !== 1 ? "es" : ""}</span>
        </div>
        <MisAvalesTable avales={avales} />
      </div>
    </div>
  );
}
