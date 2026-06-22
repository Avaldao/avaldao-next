

import { Button } from "@/components/ui/button";
import ResponsiveModal from "@/components/ui/responsive-modal";
import { Language, translations } from "@/translations";

import { CheckCircle } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";


interface TyCDialogProps {
  tyc: string,
  language: Language,
  setShowTyCDialog: (flag: boolean) => void,
  onAccept: () => void,
  onDecline: () => void
}

export function TyCDialog({ tyc, language, setShowTyCDialog, onAccept, onDecline }: TyCDialogProps) {

  const t = useMemo(() => (key: string) => translations[key]?.[language] ?? key, [language]);

  const [scrolledToEnd, setScrolledToEnd] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!endRef.current || !bodyRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setScrolledToEnd(entry.isIntersecting);
      },
      {
        root: bodyRef.current,
        threshold: 1,
      }
    );

    observer.observe(endRef.current);

    return () => observer.disconnect();
  }, []);


  return (
    <ResponsiveModal
      className="md:w-full md:max-w-xl"
      closeOnBackdropClick={false}
      closeModal={() => setShowTyCDialog(false)}
      title={t("signup.tyc.dialog.title")}
      body={
        <div ref={bodyRef} className="max-h-[50vh] overflow-auto ">
          <div
            className="leading-relaxed p-2"
          > <div dangerouslySetInnerHTML={{ __html: tyc }} />
          </div>
          <div className="bg-white h-1 mb-1" ref={endRef}></div>

        </div>
      }
      buttons={
        <>
          <Button
            onClick={onDecline}
            variant={"ghost"}
            className="bg-slate-800"
          >{t("signup.tyc.dialog.decline")}</Button>

          <Button
            className="cursor-pointer"
            onClick={onAccept}
            disabled={!scrolledToEnd}>
            <CheckCircle />
            {t("signup.tyc.dialog.accept")}
          </Button>
        </>
      }
    />
  )
}
