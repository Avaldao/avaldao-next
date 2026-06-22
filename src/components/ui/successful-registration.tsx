"use client";

import { CheckCircle2, MailCheck, X } from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

type SuccessfulRegistrationProps = {
  isOpen: boolean;
  onClose: () => void;
  t: (key: string) => string;
};

export default function SuccessfulRegistration({
  isOpen,
  onClose,
  t,
}: SuccessfulRegistrationProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl overflow-hidden rounded-[28px] border border-violet-100 bg-white shadow-2xl relative"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="bg-[linear-gradient(180deg,#f8f7ff_0%,#ffffff_42%,#f4f7fb_100%)]">

          <div className="absolute right-4 top-4 ">
            <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors rounded-lg hover:bg-zinc-100 dark:hover:bg-gray-200 p-2">

              <X className="h-6 w-6 cursor-pointer text-slate-500" onClick={onClose} />
            </button>
          </div>


          <div className="px-6 pt-8 pb-6 sm:px-10 sm:pt-10 sm:pb-8">
            <div className="mx-auto flex max-w-lg flex-col items-center text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-violet-100">
                <MailCheck className="h-10 w-10 text-violet-600" />
              </div>

              <h3 className="text-3xl font-semibold tracking-tight text-slate-950">
                {t("signup.success-modal.title")}
              </h3>

              <p className="mt-3 max-w-md text-base leading-7 text-slate-600">
                {t("signup.success-modal.description")}
              </p>
            </div>
          </div>

          <div className="relative h-32 overflow-hidden bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.95)_0%,rgba(226,232,240,0.9)_48%,rgba(203,213,225,0.95)_100%)] sm:h-40">
            
            <div
              className="absolute inset-0 bg-cover bg-center opacity-40 "
              style={{
                backgroundImage: "url('/images/unnamed.png')"
              }}
            />

          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}