"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { CalendarDays, ChevronDown, Info, Wallet } from "lucide-react";
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
import CuotasPreview from "./cuotas-preview";


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

  // En mobile las addresses editables se abrevian mientras el campo no tiene foco.
  const isMobile = useIsMobile();
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const displayAddress = (name: string, value: string) =>
    isMobile && focusedField !== name && /^0x[a-fA-F0-9]{40}$/.test(value) ? shortAddress(value) : value;
  const [infoOpen, setInfoOpen] = useState(false);

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
      <div className="rounded-lg border border-violet-200 bg-violet-50 -mt-10 mb-4">
        <button
          type="button"
          onClick={() => setInfoOpen((v) => !v)}
          aria-expanded={infoOpen}
          aria-controls="aval-info-notice"
          className="flex w-full items-center gap-3 p-4 text-left cursor-pointer"
        >
          <Info className="w-5 h-5 text-violet-600 shrink-0" />
          <span className="flex-1 text-sm font-medium text-violet-700">{t("avals.new.info.title")}</span>
          <ChevronDown className={`w-4 h-4 text-violet-600 shrink-0 transition-transform duration-300 ${infoOpen ? "rotate-180" : ""}`} />
        </button>
        <div
          id="aval-info-notice"
          className={`grid transition-all duration-300 ease-out ${infoOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
        >
          <div className="overflow-hidden">
            <ul className="space-y-1 text-sm text-violet-700 list-disc list-inside px-4 pb-4">
              <li>{t("avals.new.info.evaluation")}</li>
              <li>{t("avals.new.info.addresses")}</li>
              <li>{t("avals.new.info.vigente")}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Proyecto */}
      <fieldset className="rounded-xl border border-slate-200 px-3 sm:px-4 pb-4 pt-2 space-y-3">
        <legend className="px-2 text-sm font-semibold text-slate-800">{t("aval.form.project-info")}</legend>

      <div>
        <Label required>{t("aval.form.project")}</Label>
        <Input
          compactError
          name="proyecto"
          value={form.proyecto}
          onChange={handleChange}
          placeholder={t("aval.form.project.placeholder")}
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
          placeholder={t("aval.form.objective.placeholder")}
          className="placeholder-gray-300"
          required
        />
      </div>

      {/* Row: Adquisición / Beneficiarios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label required>{t("aval.form.acquisition")}</Label>
          <Input
            compactError
            name="adquisicion"
            value={form.adquisicion}
            onChange={handleChange}
            placeholder={t("aval.form.acquisition.placeholder")}
            required
          />
        </div>
        <div>
          <Label required>{t("aval.form.beneficiaries")}</Label>
          <Input
            compactError
            name="beneficiarios"
            value={form.beneficiarios}
            onChange={handleChange}
            placeholder={t("aval.form.beneficiaries.placeholder")}
            required
          />
        </div>
      </div>

      </fieldset>

      {/* Condiciones */}
      <fieldset className="rounded-xl border border-slate-200 px-3 sm:px-4 pb-4 pt-2 space-y-3">
        <legend className="px-2 text-sm font-semibold text-slate-800">{t("aval.form.conditions")}</legend>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-3 gap-y-3 sm:gap-4">
        <div>
          <Label required>{t("aval.form.amount")}</Label>
          <Input
            compactError
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
            compactError
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
            compactError
            type="number"
            name="duracionCuotaDias"
            value={form.duracionCuotaDias}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      </fieldset>

      {/* Plan de cuotas (vista previa) */}
      <CuotasPreview
        fechaInicio={form.fechaInicio}
        duracionCuotaDias={form.duracionCuotaDias}
        cuotasCantidad={form.cuotasCantidad}
        montoFiat={form.montoFiat}
        t={t}
      />

      {/* Participantes */}
      <fieldset className="rounded-xl border border-slate-200 px-4 pb-4 pt-2 space-y-3">
        <legend className="px-2 text-sm font-semibold text-slate-800">{t("aval.form.participants")}</legend>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>{t("aval.form.applicant")}</Label>
          <ReadOnlyAddress name="solicitanteAddress" value={form.solicitanteAddress} />
        </div>

        <div>
          <Label>{t("aval.form.avaldao")}</Label>
          <ReadOnlyAddress name="avaldaoAddress" value={form.avaldaoAddress} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>{t("aval.form.merchant")}</Label>
          <div className="relative">
            <Wallet className="absolute left-3 top-2.5 text-slate-800 z-1 h-5 w-5" />
            <Input
            compactError
              name="comercianteAddress"
              value={displayAddress("comercianteAddress", form.comercianteAddress)}
              onFocus={() => setFocusedField("comercianteAddress")}
              onBlur={() => setFocusedField(null)}
              onChange={handleChange}
              placeholder="0x..."
              className="w-full pl-10 mt-1 "
              error={fieldErrors.comercianteAddress}
            />

            {loadingComerciante ?
              (<div className="mt-1 text-sm text-gray-400 italic">
                <Spinner variant="sm" /> {t("aval.form.loading")}</div>)
              : comerciante && !fieldErrors.comercianteAddress
                ? (
                  <div className="mt-1 text-primary italic text-sm">
                    {comerciante?.name} &lt;{comerciante.email}&gt;
                  </div>
                )
                : comercianteNotFound && !fieldErrors.comercianteAddress && (
                  <div className="mt-1 text-amber-600 text-sm">
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
            compactError
              name="avaladoAddress"
              value={displayAddress("avaladoAddress", form.avaladoAddress)}
              onFocus={() => setFocusedField("avaladoAddress")}
              onBlur={() => setFocusedField(null)}
              onChange={handleChange}
              placeholder="0x..."
              className="w-full pl-10 mt-1 "
              error={fieldErrors.avaladoAddress}
            />

            {loadingAvalado ?
              (<div className="mt-1 text-sm text-gray-400 italic">
                <Spinner variant="sm" /> {t("aval.form.loading")}</div>)
              : avalado && !fieldErrors.avaladoAddress
                ? (
                  <div className="mt-1 text-primary italic text-sm">
                    {avalado?.name} &lt;{avalado.email}&gt;
                  </div>
                )
                : avaladoNotFound && !fieldErrors.avaladoAddress && (
                  <div className="mt-1 text-amber-600 text-sm">
                    {t("aval.form.user-not-found")}
                  </div>
                )}


          </div>
        </div>
      </div>
      </fieldset>

      {/* Buttons */}

      <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
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
          className="w-full sm:w-auto min-h-12 px-6 rounded-2xl bg-slate-100 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 cursor-pointer"
        >
          {t("aval.form.cancel")}
        </button>

        <Button
          className="w-full sm:w-auto sm:min-w-[220px] min-h-12 px-8 rounded-2xl font-semibold bg-linear-to-r from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-500/30 transition-all duration-200 hover:from-violet-700 hover:to-fuchsia-700 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2"
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

function shortAddress(address?: string) {
  if (!address || address.length <= 18) return address ?? "";
  return `${address.slice(0, 8)}…${address.slice(-6)}`;
}

// En mobile se muestran solo el inicio y el final de la address, porque completa no entra en el campo.
function ReadOnlyAddress({ name, value }: { name: string; value?: string }) {
  return (
    <div className="relative">
      <Wallet className="absolute left-3 top-2.5 text-slate-700 h-5 w-5 z-1" />
      <div className="hidden sm:block">
        <Input compactError name={name} value={value ?? ""} readOnly placeholder="0x..." className="w-full pl-10 mt-1" />
      </div>
      <div className="sm:hidden">
        <Input compactError value={shortAddress(value)} title={value} readOnly aria-label={name} placeholder="0x..." className="w-full pl-10 mt-1 font-mono" />
      </div>
    </div>
  );
}

const MOBILE_QUERY = "(max-width: 639px)";

function useIsMobile() {
  return useSyncExternalStore(
    (callback) => {
      const mql = window.matchMedia(MOBILE_QUERY);
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false
  );
}
