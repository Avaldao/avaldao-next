"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Info, Wallet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TextArea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import { UserInfo } from "@/types";
import Spinner from "@/components/ui/spinner";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import InputDatePicker from "@/components/ui/input-date-picker";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { Language, translations } from "@/translations";


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
  chainId?: number;
  proyecto: string,
  objetivo: string,
  adquisicion: string,
  beneficiarios: string,
  montoFiat: number,
  cuotasCantidad: number,
  fechaInicio: Date | string | undefined,
  duracionCuotaDias: number,
  solicitanteAddress: string | undefined,
  avaldaoAddress: string,
  comercianteAddress: string,
  avaladoAddress: string,
}

interface AvalFormProps {
  avaldaoAddress: string;
  language: Language;
}


export default function AvalForm({ avaldaoAddress, language }: AvalFormProps) {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();

  const t = useMemo(() => (key: string) => translations[key]?.[language] ?? key, [language]);

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

  const [comerciante, setComerciante] = useState<UserInfo | null>();
  const [avalado, setAvalado] = useState<UserInfo | null>();
  const [loadingComerciante, setLoadingComerciante] = useState(false);
  const [loadingAvalado, setLoadingAvalado] = useState(false);
  const [comercianteNotFound, setComercianteNotFound] = useState(false);
  const [avaladoNotFound, setAvaladoNotFound] = useState(false);

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
      setComercianteNotFound(false);
      try {
        const comerciante_ = await getUserByAddress(form.comercianteAddress);
        setComerciante(comerciante_);
        setComercianteNotFound(!comerciante_);
        setLoadingComerciante(false);
      } catch (err) {
        setLoadingComerciante(false);
      }
    } else {
      setComerciante(null);
      setComercianteNotFound(false);
    }

  }
  const loadAvaladoData = async () => {
    if (form.avaladoAddress && /^0x[a-fA-F0-9]{40}$/.test(form.avaladoAddress)) {
      setLoadingAvalado(true);
      setAvaladoNotFound(false);
      try {
        const avalado_ = await getUserByAddress(form.avaladoAddress);
        setAvalado(avalado_);
        setAvaladoNotFound(!avalado_);
        setLoadingAvalado(false);
      } catch (err) {
        console.log(err)
        setLoadingAvalado(false);
      }
    } else {
      setAvalado(null);
      setAvaladoNotFound(false);
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
    const fieldErrors_ = [];
    if (!/^0x[a-fA-F0-9]{40}$/.test(form.comercianteAddress)) {
      setFieldError("comercianteAddress", t("aval.form.validation.invalid-address"));
      fieldErrors_.push("comercianteAddress");
    }
    if (!/^0x[a-fA-F0-9]{40}$/.test(form.avaladoAddress)) {
      setFieldError("avaladoAddress", t("aval.form.validation.invalid-address"));
      fieldErrors_.push("avaladoAddress");
    }

    return fieldErrors_;

  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    clearFormErrors();

    const fieldErrors_ = validateForm();
    if (fieldErrors_.length > 0) {
      return;
    }


    try {
      setLoading(true);

      if (form.fechaInicio instanceof Date) {
        form.fechaInicio = form.fechaInicio.toISOString();
      }

      form.chainId = Number(process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID!);

      const data = JSON.stringify(form);

      const res = await fetch("/api/avales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: data,
      });

      if (res.ok) {
        toast.success(t("aval.form.success"));
        setForm({
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
        setComerciante(null);
        setAvalado(null);
        router.push("/guarantees"); //Redirect to avales list after creation. We can consider redirecting to the newly created aval details page in the future.
        // setSuccess(true);  
      } else {
        const errorData = await res.json();
        toast.error(`${t("aval.form.error")}${errorData.message ? `: ${errorData.message}` : ""}`);
      }
    } catch (err) {
      console.error(err);
      toast.error(t("aval.form.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {/* Info notice */}
      <div className="rounded-lg border border-violet-200 bg-violet-50 p-5 -mt-10 mb-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-violet-600 mt-0.5 shrink-0" />
          <ul className="space-y-1 text-sm text-violet-700 list-disc list-inside">
            <li>{t("avals.new.info.evaluation")}</li>
            <li>{t("avals.new.info.addresses")}</li>
            <li>{t("avals.new.info.vigente")}</li>
          </ul>
        </div>
      </div>

      {/* Proyecto */}
      <div>
        <Label required>{t("aval.form.project")}</Label>
        <Input
          name="proyecto"
          value={form.proyecto}
          onChange={handleChange}
          required
        />
      </div>

      {/* Objetivo */}
      <div>
        <Label required>{t("aval.form.objective")}</Label>
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
          <Label required>{t("aval.form.acquisition")}</Label>
          <Input
            name="adquisicion"
            value={form.adquisicion}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label required>{t("aval.form.beneficiaries")}</Label>
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
          <Label required>{t("aval.form.amount")}</Label>
          <Input
            type="number"
            name="montoFiat"
            value={form.montoFiat}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label required>{t("aval.form.installments")}</Label>
          <Input
            type="number"
            name="cuotasCantidad"
            value={form.cuotasCantidad}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label>{t("aval.form.start-date")}</Label>
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
          <Label required>{t("aval.form.duration-days")}</Label>
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
          <Label>{t("aval.form.applicant")}</Label>
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
          <Label>{t("aval.form.avaldao")}</Label>
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
          <Label>{t("aval.form.merchant")}</Label>
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
                <Spinner variant="sm" /> {t("aval.form.loading")}</div>)
              : comerciante && !fieldErrors.comercianteAddress
                ? (
                  <div className="-mt-4 text-primary italic text-sm">
                    {comerciante?.name} &lt;{comerciante.email}&gt;
                  </div>
                )
                : comercianteNotFound && !fieldErrors.comercianteAddress && (
                  <div className="-mt-4 text-amber-600 text-sm">
                    {t("aval.form.user-not-found")}
                  </div>
                )}

          </div>
        </div>

        <div>
          <Label>{t("aval.form.endorsed")}</Label>
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
                <Spinner variant="sm" /> {t("aval.form.loading")}</div>)
              : avalado && !fieldErrors.avaladoAddress
                ? (
                  <div className="-mt-4 text-primary italic text-sm">
                    {avalado?.name} &lt;{avalado.email}&gt;
                  </div>
                )
                : avaladoNotFound && !fieldErrors.avaladoAddress && (
                  <div className="-mt-4 text-amber-600 text-sm">
                    {t("aval.form.user-not-found")}
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
          className="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-gray-100 rounded-md transition"
        >
          {t("aval.form.cancel")}
        </button>

        <Button
          className="min-w-[220px] bg-linear-to-r from-violet-600 to-fuchsia-600  hover:from-violet-700 hover:to-fuchsia-700 "
          type="submit"
          loading={loading}
          disabled={loading /* || success */}
        >
          {loading && <Spinner />}
          {loading ? t("aval.form.submit.loading") : t("aval.form.submit")}
        </Button>
      </div>

    </form>

  );
}
