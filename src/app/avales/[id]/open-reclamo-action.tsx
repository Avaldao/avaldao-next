"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextArea } from "@/components/ui/textarea";
import { translations, Language } from "@/translations";
import { TONES, useAvalTx } from "./aval-tx-action";

const MOTIVO_MAX_LENGTH = 2000;

interface Props {
  avalId: string;
  avalAddress: string;
  comercianteAddress: string;
  chainId: 30 | 31;
  language: Language;
  /** Número que el contrato le va a asignar al reclamo (reclamos.length + 1). */
  numero: number;
  description: string;
}

/**
 * Apertura de reclamo por el comerciante: pide el motivo, envía `openReclamo`
 * y, cuando se confirma, guarda el motivo como primer mensaje del reclamo.
 */
export default function OpenReclamoAction({ avalId, avalAddress, comercianteAddress, chainId, language, numero, description }: Props) {
  const t = (key: string) => translations[key]?.[language] ?? key;
  const [motivo, setMotivo] = useState("");

  const { isActor, send, tracker } = useAvalTx({
    avalAddress,
    actorAddress: comercianteAddress,
    chainId,
    language,
    hint: t("aval.details.open-claim.hint"),
    wrongNetworkMessage: t("tx.error.wrong-network"),
  });

  if (!isActor) return null;

  const styles = TONES.amber;

  async function handleOpen() {
    const texto = motivo.trim();
    if (!texto) {
      toast.error(t("aval.details.open-claim.reason.required"));
      return;
    }

    const confirmed = await send("openReclamo");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/avales/${avalId}/reclamos/${numero}/mensajes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => null))?.message);
      setMotivo("");
    } catch (err) {
      console.error(err);
      // El reclamo ya está abierto onchain: el motivo se puede volver a enviar como mensaje.
      toast.error(t("aval.details.open-claim.reason.save-error"));
    }
  }

  return (
    <>
      {tracker}
      <div className={`rounded-lg border p-4 space-y-3 ${styles.box}`}>
        <div>
          <p className={`font-semibold text-sm ${styles.title}`}>{t("aval.details.open-claim.title")}</p>
          <p className={`text-xs mt-0.5 ${styles.text}`}>{description}</p>
        </div>
        <div className="space-y-1">
          <label htmlFor="reclamo-motivo" className={`block text-sm font-medium ${styles.title}`}>
            {t("aval.details.open-claim.reason.label")}
          </label>
          <TextArea
            id="reclamo-motivo"
            rows={3}
            maxLength={MOTIVO_MAX_LENGTH}
            className="bg-white"
            placeholder={t("aval.details.open-claim.reason.placeholder")}
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
          />
        </div>
        <Button onClick={handleOpen} size="sm" disabled={!motivo.trim()} className={styles.button}>
          <AlertTriangle className="w-4 h-4 mr-2" />
          {t("aval.details.open-claim.button")}
        </Button>
      </div>
    </>
  );
}
