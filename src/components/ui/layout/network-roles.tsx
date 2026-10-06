export const networks = [
  {
    id: "30",
    name: "Rootstock Mainnet",
    shortName: "RSK",
    className: "border-emerald-200 bg-emerald-50",
    badgeClassName: "bg-emerald-100 text-emerald-700",
    dotClassName: "bg-emerald-500",
  },
  {
    id: "31",
    name: "Rootstock Testnet",
    shortName: "tRSK",
    className: "border-amber-200 bg-amber-50",
    badgeClassName: "bg-amber-100 text-amber-700",
    dotClassName: "bg-amber-400",
  },
];

const roleColors: Record<string, string> = {
  admin: "bg-emerald-100 text-emerald-800",
  auditor: "bg-yellow-100 text-yellow-800",
  ups_revisor: "bg-blue-100 text-blue-800",
  technician: "bg-purple-100 text-purple-800",
};

export type NRoles = Partial<Record<"30" | "31", string[]>>;

/** Tarjetas con la red y los roles del usuario en cada una. */
export default function NetworkRoles({ nroles, className = "" }: { nroles?: NRoles; className?: string }) {
  return (
    <div className={`flex flex-col gap-2 text-xs ${className}`}>
      {networks.map((network) => {
        const roles = nroles?.[network.id as "30" | "31"] ?? [];
        return (
          <div key={network.id} className={`rounded-lg border p-2 ${network.className}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-slate-700">{network.name}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${network.badgeClassName}`}>
                {roles.length} roles
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {roles.length ? (
                roles.map((role) => (
                  <span
                    key={role}
                    className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${roleColors[role.toLowerCase()] ??
                      `${role === "ADMIN_ROLE" ? "bg-violet-100 text-violet-500" : "bg-gray-100 text-gray-700"}`
                      }`}
                  >
                    {role.replaceAll("_", " ")}
                  </span>
                ))
              ) : (
                <span className="text-[10px] text-slate-400 italic">No permissions assigned</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
