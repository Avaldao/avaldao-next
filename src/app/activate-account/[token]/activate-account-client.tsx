"use client";

import { Mail, Wallet, Check, ArrowRight, EyeOff, Eye, ArrowLeft } from "lucide-react";
import { ReactNode, useState } from "react";
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";
import AppkitContextProvider from "@/context/appkit-context";
import { LanguageProvider } from "@/context/LanguageContext";
import { Language } from "@/translations";
import StepSuccess from "./step-success";
import StepError from "../step-error";
import StepSubmitting from "./step-submitting";

export type AuthMethod = "email" | "web3";

export type Step = 1 | 2 | 3;

interface ActivateAccountClientProps {
  language: Language;
  token: string;
}

export default function ActivateAccountClient({ language, token }: ActivateAccountClientProps) {
  const [step, setStep] = useState<Step>(1);
  const [selected, setSelected] = useState<AuthMethod[]>(["email"]);
  const [password, setPassword] = useState("");
  const [signature, setSignature] = useState<string | undefined>();
  const [message, setMessage] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string>();

  const submitForm = async () => {
    try {
      setSubmitting(true);
      setSubmitError(undefined);

      const res = await fetch("/api/account/activate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          authMethods: selected,
          password: selected.includes("email") ? password : undefined,
          signature: selected.includes("web3") ? signature : undefined,
          message: selected.includes("web3") ? message : undefined,
        }),
      });


      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al activar la cuenta");
      }

      const data = await res.json();
      console.log("Account activated successfully:", data);
      setSuccess(true);
      // Aquí podrías redirigir al usuario a otra página o mostrar un mensaje de éxito



    } catch (err) {
      setSubmitError("Error al activar la cuenta. Por favor, inténtalo de nuevo.");
    } finally {
      setSubmitting(false);
    }
  }


  const steps = [
    <Step1
      selected={selected}
      setSelected={setSelected}
      setStep={setStep}
      stepIndicator={<StepIndicator step={step} />
      }
    />
  ];

  if (selected.includes("email")) {
    steps.push(
      <Step2
        selected={selected}
        setStep={setStep}
        password={password}
        setPassword={setPassword}
        stepIndicator={<StepIndicator step={step} />}
        submitForm={submitForm}
        submitting={submitting}
        submitError={submitError}
      />)
  }

  if (selected.includes("web3")) {
    steps.push(
      <LanguageProvider initialLanguage={language}>
        <AppkitContextProvider>
          <Step3
            setStep={setStep}
            stepIndicator={<StepIndicator step={step} />}
            submitting={submitting}
            submitError={submitError}
            submitForm={submitForm}
            signature={signature}
            setSignature={setSignature}
            message={message}
            setMessage={setMessage}
          />
        </AppkitContextProvider>
      </LanguageProvider>
    )
  }


  return (
    <div className="flex flex-row justify-start w-full min-h-[90vh]">
      {success ? (
        <StepSuccess stepIndicator={<StepIndicator step={step} />} />
      ) : submitting ? (
        <StepSubmitting stepIndicator={<StepIndicator step={step} />} />
      ) : submitError ? (
        <StepError
          errorDetails={submitError}
          stepIndicator={<StepIndicator step={step} />}
          retry={() => {
            setSubmitError(undefined);
            setSubmitting(false);
            submitForm();
          }}
          submitting={submitting}
        />
      ) : (
        steps[step - 1]
      )}
    </div>
  );

}

function StepIndicator({ step }: { step: Step }) {
  return (
    <div className="flex gap-1 mb-4">
      <div className={`h-1 w-8 rounded-full ${step >= 1 ? "bg-violet-600" : "bg-gray-200"}`} />
      <div className={`h-1 w-8 rounded-full ${step >= 2 ? "bg-violet-600" : "bg-gray-200"}`} />
    </div>
  )
}


