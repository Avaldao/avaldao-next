"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextArea } from "@/components/ui/textarea";
import { translations, Language } from "@/translations";
import { ReclamoView } from "@/types";
import { shortenAddress } from "@/utils";

const MENSAJE_MAX_LENGTH = 2000;

const ROLE_LABEL_KEYS: Record<ReclamoView["mensajes"][number]["autorRol"], string> = {
  solicitante: "aval.form.applicant",
  avaldao: "aval.form.avaldao",
  comerciante: "aval.form.merchant",
  avalado: "aval.form.endorsed",
};

interface Props {
  avalId: string;
  reclamo: ReclamoView;
  /** Si el usuario actual participa del aval y el reclamo está vigente. */
  canPost: boolean;
  language: Language;
}

/** Mensajes de un reclamo. El primero del comerciante se muestra como motivo. */
export default function ReclamoMensajes({ avalId, reclamo, canPost, language }: Props) {
  const t = (key: string) => translations[key]?.[language] ?? key;
  const router = useRouter();
  const [texto, setTexto] = useState("");
  const [sending, setSending] = useState(false);

  const motivoId = reclamo.mensajes.find((m) => m.autorRol === "comerciante")?.id;

  async function handleSend() {
    const contenido = texto.trim();
    if (!contenido) return;
    setSending(true);
    try {
      const res = await fetch(`/api/avales/${avalId}/reclamos/${reclamo.numero}/mensajes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto: contenido }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message ?? t("aval.details.claim-messages.send-error"));
      }
      setTexto("");
      router.refresh();
    } catch (err) {
      toast.error((err as Error).message || t("aval.details.claim-messages.send-error"));
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-3">
      {reclamo.mensajes.length === 0 ? (
        <p className="text-sm text-slate-400 italic">{t("aval.details.claim-messages.empty")}</p>
      ) : (
        <ul className="space-y-2">
          {reclamo.mensajes.map((m) => (
            <li key={m.id} className="rounded-md border border-slate-200 bg-white px-3 py-2">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500">
                <span className="font-medium text-primary">{t(ROLE_LABEL_KEYS[m.autorRol])}</span>
                <span className="font-mono" title={m.autorAddress}>{shortenAddress(m.autorAddress)}</span>
                <span>· {format(new Date(m.fecha), "dd/MM/yyyy HH:mm")}</span>
                {m.id === motivoId && (
                  <span className="rounded-full bg-amber-100 text-amber-800 px-2 py-px">
                    {t("aval.details.claim-messages.reason")}
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-800 mt-1 whitespace-pre-line break-words">{m.texto}</p>
            </li>
          ))}
        </ul>
      )}

      {canPost && (
        <div className="space-y-2">
          <TextArea
            rows={2}
            maxLength={MENSAJE_MAX_LENGTH}
            placeholder={t("aval.details.claim-messages.placeholder")}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          />
          <Button size="sm" variant="outline" disabled={sending || !texto.trim()} onClick={handleSend}>
            <Send className="w-4 h-4 mr-2" />
            {t("aval.details.claim-messages.send")}
          </Button>
        </div>
      )}
    </div>
  );
}
