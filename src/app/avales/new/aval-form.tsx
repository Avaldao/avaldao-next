"use client";

import { useState } from "react";
import { CalendarDays, Wallet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TextArea } from "@/components/ui/textarea";

export default function AvalForm() {
  const [form, setForm] = useState({
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

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

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
              className="w-full pl-10 mt-1 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
              className="w-full pl-10 mt-1 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
              onChange={handleChange}
              placeholder="0x..."
              className="w-full pl-10 mt-1 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
              className="w-full pl-10 mt-1 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
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
              className="w-full pl-10 mt-1 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
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
          className="px-4 py-2 bg-secondary hover:bg-blue-700 text-white rounded-md transition disabled:opacity-50"
        >
          {loading ? "Enviando..." : "Enviar Aval"}
        </button>
      </div>

      {success && (
        <p className="text-green-600 text-sm mt-3">✅ Aval enviado correctamente.</p>
      )}
    </form>

  );
}
