"use client";

import { Wallet, X } from "lucide-react";
import { createPortal } from "react-dom";


interface AskConnectionModalProps {
  onConnect: () => void;
  onSkip: () => void;
  t: (key: string) => string;
}

export default function AskConnectionModal({ onConnect, onSkip, t }: AskConnectionModalProps) {

  return createPortal(
    <div className="fixed inset-0 bg-black/50  flex items-center justify-center z-51">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-sm shadow-xl ">

        <div className="flex justify-end">
          <button
            onClick={onSkip}
            className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>


        <div className="w-14 h-14 bg-violet-100 dark:bg-violet-950/40 rounded-full flex items-center justify-center mx-auto mb-2">
          <Wallet className="w-7 h-7 text-violet-600 dark:text-violet-400" />
        </div>

        <div className="space-y-2">

          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 text-center py-4">
            {t("signup.form.askConnection.title")}
          </h2>
          <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400 text-center">
            {t("signup.form.askConnection.description")}
          </p>

          <div className="flex flex-col gap-4 mt-32">
            <button
              onClick={onConnect}
              className="w-full rounded-xl py-2.5 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 transition-colors flex items-center justify-center gap-2"
            >
              <Wallet className="w-4 h-4" />
              {t('auth.modal.connect.button')}
            </button>

            <div className="flex justify-center">
              <button onClick={onSkip}
                className="px-4 py-2 mb-1 w-fit text-violet-400 rounded  cursor-pointer hover:bg-violet-100 dark:hover:bg-violet-950/40 transition-colors text-sm">
                {t("signup.form.askConnection.cancel")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}