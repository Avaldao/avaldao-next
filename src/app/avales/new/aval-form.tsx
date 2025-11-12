"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Wallet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TextArea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import { UserInfo } from "@/types";
import Spinner from "@/components/ui/spinner";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import InputDatePicker from "@/components/ui/input-date-picker";



interface FieldErrors {
  proyecto?: string;
  objetivo?: string;
  adquisicion?: string;
  beneficiarios?: string;
  montoFiat?: string;
  cuotasCantidad?: string;
  fechaInicio?: string;
  duracionCuotaDias?: string;
  solicitanteAddress?: string;
  avaldaoAddress?: string;
  comercianteAddress?: string;
  avaladoAddress?: string;
}

interface AvalFields {
  proyecto: string,
  objetivo: string,
  adquisicion: string,
  beneficiarios: string,
  montoFiat: number,
  cuotasCantidad: number,
  fechaInicio: Date | string | undefined,
  duracionCuotaDias: 30,
  solicitanteAddress: string | undefined,
  avaldaoAddress: string,
  comercianteAddress: string,
  avaladoAddress: string,
}


export default function AvalForm({ avaldaoAddress }: { avaldaoAddress: string }) {
  const { data: session } = useSession();
  const user = session?.user;

  const [form, setForm] = useState<AvalFields>({
    proyecto: "",
    objetivo: "",
    adquisicion: "",
    beneficiarios: "",
    montoFiat: 1000,
    cuotasCantidad: 6,
    fechaInicio: new Date(),
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
  const [loadingComerciante, setLoadingComerciante] = useState(false);
  const [loadingAvalado, setLoadingAvalado] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const setFieldError = (field: string, value: string) => {
    setFieldErrors(prevs => ({
      ...prevs,
      [field]: value
    })
    )
  };

  const clearFieldError = (field: string) => {
    setFieldErrors(prevs => ({
      ...prevs,
      [field]: undefined
    })
    )
  };


  const clearFormErrors = () => {
    setFieldErrors({});
  }



  useEffect(() => {
    loadComercianteData();
  }, [form.comercianteAddress])

  useEffect(() => {
    loadAvaladoData();
  }, [form.avaladoAddress])


  const loadComercianteData = async () => {
    if (form.comercianteAddress && /^0x[a-fA-F0-9]{40}$/.test(form.comercianteAddress)) {
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
    if (form.avaladoAddress && /^0x[a-fA-F0-9]{40}$/.test(form.avaladoAddress)) {
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
    if (name == "comercianteAddress") {
      clearFieldError("comercianteAddress");
    };
    if (name == "avaladoAddress") {
      clearFieldError("avaladoAddress");
    };
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  async function getUserByAddress(address: string) {
    const response = await fetch(`/api/users?address=${address}`);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return null;
    }
  }

  const validateForm = () => {
    if (!/^0x[a-fA-F0-9]{40}$/.test(form.comercianteAddress)) {
      setFieldError("comercianteAddress", "Por favor ingresa un address válido");
    }
    if (!/^0x[a-fA-F0-9]{40}$/.test(form.avaladoAddress)) {
      setFieldError("avaladoAddress", "Por favor ingresa un address válido");
    }

  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    clearFormErrors();
    validateForm();

    if (Object.keys(fieldErrors).length > 0) {
      return;
    }

    setSuccess(false);

    if(form.fechaInicio instanceof Date){
      form.fechaInicio = form.fechaInicio.toISOString();
    }
    
    const data = JSON.stringify(form);

    try {
      setLoading(true);
      const res = await fetch("/api/avales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: data,
      });

      if (res.ok) {
        setSuccess(true);
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
    <form onSubmit={handleSubmit} className="space-y-2">
      {/* Proyecto */}
      <div>
        <Label required>Proyecto</Label>
        <Input
          name="proyecto"
          value={form.proyecto}
          onChange={handleChange}
          required
        />
      </div>

      {/* Objetivo */}
      <div>
        <Label required>Objetivo</Label>
        <TextArea
          name="objetivo"
          value={form.objetivo}
          onChange={handleChange}
          required
        />
      </div>

      {/* Row: Adquisición / Beneficiarios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label required>Adquisición</Label>
          <Input
            name="adquisicion"
            value={form.adquisicion}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label required>Beneficiarios</Label>
          <Input
            name="beneficiarios"
            value={form.beneficiarios}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* Row: Monto, Cuotas, Fecha, Duración */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div>
          <Label required>Monto (USD)</Label>
          <Input
            type="number"
            name="montoFiat"
            value={form.montoFiat}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label required>Cuotas</Label>
          <Input
            type="number"
            name="cuotasCantidad"
            value={form.cuotasCantidad}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label >Fecha inicio</Label>
          <InputDatePicker
            onChange={(s) => {
              if (s) {
                setForm((prev) => ({ ...prev, ["fechaInicio"]: s }))
              }
            }
            }
          />
        </div>



        <div>
          <Label required>Duración (días)</Label>
          <Input
            type="number"
            name="duracionCuotaDias"
            value={form.duracionCuotaDias}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* Row: Direcciones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label >Solicitante</Label>
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
          <Label >AvalDAO</Label>
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
          <Label >Comerciante</Label>
          <div className="relative">
            <Wallet className="absolute left-3 top-2.5 text-slate-800 z-1 h-5 w-5" />
            <Input
              name="comercianteAddress"
              value={form.comercianteAddress}
              onChange={handleChange}
              placeholder="0x..."
              className="w-full pl-10 mt-1 "
              error={fieldErrors.comercianteAddress}
            />

            {loadingComerciante ?
              (<div className="-mt-4 text-sm text-gray-400 italic">
                <Spinner variant="sm" /> Loading...</div>)
              : comerciante && !fieldErrors.comercianteAddress && (
                <div className="-mt-4 text-primary italic text-sm">
                  {comerciante?.name} &lt;{comerciante.email}&gt;
                </div>
              )}

          </div>
        </div>

        <div>
          <Label >Avalado</Label>
          <div className="relative">
            <Wallet className="absolute left-3 top-2.5 text-slate-800 z-1 h-5 w-5" />
            <Input
              name="avaladoAddress"
              value={form.avaladoAddress}
              onChange={handleChange}
              placeholder="0x..."
              className="w-full pl-10 mt-1 "
              error={fieldErrors.avaladoAddress}
            />

            {loadingAvalado ?
              (<div className="-mt-4 text-sm text-gray-400 italic">
                <Spinner variant="sm" /> Loading...</div>)
              : avalado && !fieldErrors.avaladoAddress && (
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
            fechaInicio: new Date(),
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

        <Button
          type="submit"
          loading={loading}
          disabled={loading || success}
        >
          {loading && <Spinner />}
          {loading ? "Creando..." : "Crear Aval"}
        </Button>
      </div>



      {success && (
        <p className="text-green-600 text-lg mt-7 text-center">✅ Aval registrado correctamente.</p>
      )}
    </form>

  );
}
