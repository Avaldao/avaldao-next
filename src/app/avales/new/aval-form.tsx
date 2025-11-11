"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Wallet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TextArea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import { UserInfo } from "@/types";
import Spinner from "@/components/ui/spinner";


export default function AvalForm({ avaldaoAddress }: { avaldaoAddress: string }) {
  const { data: session } = useSession();
  const user = session?.user;

  const [form, setForm] = useState({
    proyecto: "",
    objetivo: "",
    adquisicion: "",
    beneficiarios: "",
    montoFiat: 1000,
    cuotasCantidad: 6,
    fechaInicio: "",
    duracionCuotaDias: 30,
    solicitanteAddress: user?.address,
    avaldaoAddress: avaldaoAddress,
    comercianteAddress: "",
    avaladoAddress: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [comerciante, setComerciante] = useState<UserInfo | null>();
  const [avalado, setAvalado] = useState<UserInfo | null>();
  const [loadingComerciante, setLoadingComerciante] = useState(true);
  const [loadingAvalado, setLoadingAvalado] = useState(false);


  useEffect(() => {
    loadComercianteData();
  }, [form.comercianteAddress])

  useEffect(() => {
    loadAvaladoData();
  }, [form.avaladoAddress])


  const loadComercianteData = async () => {
    console.log(form.comercianteAddress) //TODO: check valid address

    if (form.comercianteAddress) {
      setLoadingComerciante(true);
      try {
        const comerciante_ = await getUserByAddress(form.comercianteAddress);
        setComerciante(comerciante_);
        setLoadingComerciante(false);
      } catch (err) {
        setLoadingComerciante(false);
      }
    } else {
      setComerciante(null);
    }

  }
  const loadAvaladoData = async () => {
    if (form.avaladoAddress) {
      setLoadingAvalado(true);
      try {
        const avalado_ = await getUserByAddress(form.avaladoAddress);
        setAvalado(avalado_);
        setLoadingAvalado(false);
      } catch (err) {
        console.log(err)
        setLoadingAvalado(false);
      }
    } else {
      setAvalado(null);
    }
  }


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  async function getUserByAddress(address: string) {
    const response = await fetch(`/api/users?address=${address}`);
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      return data;

    } else {
      console.log(response.status); //not found?
      return null;
    }

  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const res = await fetch("/api/avales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSuccess(true);
        setForm({
          proyecto: "",
          objetivo: "",
          adquisicion: "",
          beneficiarios: "",
          montoFiat: 1000,
          cuotasCantidad: 6,
          fechaInicio: "",
          duracionCuotaDias: 30,
          solicitanteAddress: "",
          avaldaoAddress: "",
          comercianteAddress: "",
          avaladoAddress: "",
        });
      } else {
        console.error("Error al enviar los datos");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Proyecto */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Proyecto</label>
        <Input
          name="proyecto"
          value={form.proyecto}
          onChange={handleChange}
        />
      </div>

      {/* Objetivo */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Objetivo</label>
        <TextArea
          name="objetivo"
          value={form.objetivo}
          onChange={handleChange}
        />
      </div>

      {/* Row: Adquisición / Beneficiarios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Adquisición</label>
          <Input
            name="adquisicion"
            value={form.adquisicion}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Beneficiarios</label>
          <Input
            name="beneficiarios"
            value={form.beneficiarios}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Row: Monto, Cuotas, Fecha, Duración */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Monto (USD)</label>
          <Input
            type="number"
            name="montoFiat"
            value={form.montoFiat}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Cuotas</label>
          <Input
            type="number"
            name="cuotasCantidad"
            value={form.cuotasCantidad}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha inicio</label>
          <div className="relative">
            <CalendarDays className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
            <Input
              type="date"
              name="fechaInicio"
              value={form.fechaInicio}
              onChange={handleChange}
              className="w-full pl-10 mt-1 "
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Duración (días)</label>
          <Input
            type="number"
            name="duracionCuotaDias"
            value={form.duracionCuotaDias}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Row: Direcciones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Solicitante</label>
          <div className="relative">
            <Wallet className="absolute left-3 top-2.5 text-slate-700 h-5 w-5 z-1" />
            <Input
              name="solicitanteAddress"
              value={form.solicitanteAddress}
              onChange={handleChange}
              placeholder="0x..."
              className="w-full pl-10 mt-1 "
              readOnly
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">AvalDAO</label>
          <div className="relative">
            <Wallet className="absolute left-3 top-2.5 text-slate-800 z-1 h-5 w-5" />
            <Input
              name="avaldaoAddress"
              value={form.avaldaoAddress}
              readOnly
              placeholder="0x..."
              className="w-full pl-10 mt-1 "
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Comerciante</label>
          <div className="relative">
            <Wallet className="absolute left-3 top-2.5 text-slate-800 z-1 h-5 w-5" />
            <Input
              name="comercianteAddress"
              value={form.comercianteAddress}
              onChange={handleChange}
              placeholder="0x..."
              className="w-full pl-10 mt-1 "
            />
            
            {loadingComerciante?
              (<div className="-mt-4 text-sm text-gray-400 italic">
                <Spinner variant="sm"/> Loading...</div>)
              : comerciante && (
                <div className="-mt-4 text-primary italic text-sm">
                  {comerciante?.name} &lt;{comerciante.email}&gt;
                </div>
              )}

          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Avalado</label>
          <div className="relative">
            <Wallet className="absolute left-3 top-2.5 text-slate-800 z-1 h-5 w-5" />
            <Input
              name="avaladoAddress"
              value={form.avaladoAddress}
              onChange={handleChange}
              placeholder="0x..."
              className="w-full pl-10 mt-1 "
            />

             {loadingAvalado?
              (<div className="-mt-4 text-sm text-gray-400 italic">
                <Spinner variant="sm"/> Loading...</div>)
              : avalado && (
                <div className="-mt-4 text-primary italic text-sm">
                  {avalado?.name} &lt;{avalado.email}&gt;
                </div>
              )}

           
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={() => setForm({
            proyecto: "",
            objetivo: "",
            adquisicion: "",
            beneficiarios: "",
            montoFiat: 1000,
            cuotasCantidad: 6,
            fechaInicio: "",
            duracionCuotaDias: 30,
            solicitanteAddress: "",
            avaldaoAddress: "",
            comercianteAddress: "",
            avaladoAddress: "",
          })}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition"
        >
          Cancelar
        </button>




        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-secondary hover:bg-secondary-accent text-white rounded-md transition disabled:opacity-50"
        >
          {loading ? "Creando..." : "Crear Aval"}
        </button>
      </div>

      {success && (
        <p className="text-green-600 text-sm mt-3">✅ Aval registrado correctamente.</p>
      )}
    </form>

  );
}
