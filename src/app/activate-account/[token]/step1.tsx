import { ReactNode } from "react";
import { AuthMethod, Step } from "./activate-account-client";
import { ArrowLeft, ArrowRight, Check, Mail, Wallet } from "lucide-react";
import { createT, type Language } from "@/translations";

interface Step1Props {
  selected: AuthMethod[];
  setSelected: React.Dispatch<React.SetStateAction<AuthMethod[]>>;
  setStep: React.Dispatch<React.SetStateAction<Step>>;
  stepIndicator: ReactNode;
  language: Language;
}

interface Option {
  id: AuthMethod;
  icon: ReactNode;
  titleKey: string;
  descriptionKey: string;
  badgeKey?: string;
}

const options: Option[] = [
  {
    id: "email",
    icon: <Mail className="w-5 h-5" />,
    titleKey: "activate.step1.email.title",
    descriptionKey: "activate.step1.email.description",
  },
  {
    id: "web3",
    icon: <Wallet className="w-5 h-5" />,
    titleKey: "activate.step1.web3.title",
    descriptionKey: "activate.step1.web3.description",
    badgeKey: "activate.step1.recommended",
  },
];



export default function Step1({ selected, setSelected, setStep, stepIndicator, language }: Step1Props) {
  const t = createT(language);
  return (
    <div className="w-full max-w-lg xl:max-w-xl mx-auto flex flex-col gap-4 p-4">
      {/* Progress + Header */}
      <div className="mb-1 mt-10">

        <div className="invisible mb-3 flex items-center gap-4 cursor-pointer" >
          <ArrowLeft className="w-4 h-4 text-slate-600" />
        </div>

        {stepIndicator}
        <h1 className="text-xl font-bold text-gray-900 leading-snug">
          {t("activate.step1.title")}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {t("activate.step1.description")}{" "}
          <span className="text-gray-400">{t("activate.step1.change-later")}</span>
        </p>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3">
        {options.map((opt) => {
          const isSelected = selected.includes(opt.id);
          return (
            <button
              key={opt.id}
              onClick={() => setSelected(previous => previous.includes(opt.id) ? previous.filter(id => id !== opt.id) : [...previous, opt.id])}
              className={`w-full text-left rounded-2xl border-2 p-4 flex items-start gap-3 cursor-pointer transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500
                ${isSelected
                  ? "border-violet-600 bg-white shadow-sm"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:-translate-y-px"
                }`}
            >
              {/* Icon */}
              <div
                className={`flex-shrink-0 rounded-xl p-2 mt-0.5 transition-colors
                  ${isSelected ? "bg-violet-100 text-violet-600" : "bg-gray-100 text-gray-500"}`}
              >
                {opt.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-semibold leading-snug
                    ${isSelected ? "text-gray-900" : "text-gray-700"}`}
                >
                  {t(opt.titleKey)}
                </p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {t(opt.descriptionKey)}
                </p>
                {opt.badgeKey && (
                  <span className="inline-block mt-2 text-[10px] font-semibold tracking-wider text-violet-600 bg-violet-100 px-2 py-0.5 rounded-full">
                    {t(opt.badgeKey)}
                  </span>
                )}
              </div>

              {/* Check indicator */}
              <div
                className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 transition-all
                  ${isSelected ? "bg-violet-600" : "border-2 border-gray-300"}`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
              </div>
            </button>
          );
        })}
      </div>
      <div className="flex-1">

      </div>

      {/* CTA */}
      <div>
        <button
          className="
            w-full bg-violet-600 hover:bg-violet-700 active:scale-[0.98] text-white font-semibold text-sm py-3.5 rounded-2xl 
            flex items-center justify-center gap-2 transition-all shadow-md shadow-violet-200
            disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none
            
            "
          disabled={selected.length === 0}
          onClick={() => setStep(2)}
        >


          {t("activate.step1.confirm")}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}