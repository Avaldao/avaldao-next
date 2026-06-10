import { ArrowLeft, ArrowRight, Check, LogOut, Wallet } from "lucide-react";
import { Step } from "./activate-account-client";
import { useAppKit, useAppKitAccount, useAppKitProvider, useDisconnect } from "@reown/appkit/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { BrowserProvider, Eip1193Provider } from "ethers";
import SignModal, { SignStatus } from "@/app/users/signup/sign-modal";
import { useLanguage } from "@/context/LanguageContext";

interface Step3Props {
  setStep: React.Dispatch<React.SetStateAction<Step>>;
  stepIndicator: React.ReactNode;
  submitting: boolean;
  submitError: string | undefined;
  submitForm: () => Promise<void>;
  message: string | undefined;
  signature: string | undefined;
  setSignature: Dispatch<SetStateAction<string | undefined>>;
  setMessage: Dispatch<SetStateAction<string | undefined>>;
}

export default function Step3({ setStep, stepIndicator, submitting, submitError, submitForm, signature, setSignature, message, setMessage }: Step3Props) {

  const { t } = useLanguage();
  const { open: openAppkit } = useAppKit();
  const { disconnect } = useDisconnect();
  const { isConnected, address } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider<Eip1193Provider>("eip155");
  const [signStatus, setSignStatus] = useState<SignStatus>("idle");
  const [signError, setSignError] = useState<string | undefined>();
  const [showSignModal, setShowSignModal] = useState(false);

  useEffect(() => {
    if (isConnected && address) {
      getChallenge();
    }
  }, [isConnected, address]);


  useEffect(() => {
    if (signature) {
      submitForm();
    }
  }, [signature]);



  const connectWallet = () => {
    openAppkit();
  }

  const getChallenge = async () => {
    console.log("Asking for signature...");

    if (!address) {
      throw new Error("No address connected");
    }
    const res = await fetch(`/api/challenges?address=${address}`);
    const { message: challenge } = await res.json();
    setMessage(challenge);
    //setShowSignModal(true);
  }

  const handleSign = async () => {
    if (!message) return;
    setSignStatus("waiting");
    setSignError(undefined);
    try {
      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();
      const signature = await signer.signMessage(message);
      setSignStatus("success");
      setSignature(signature);


      setTimeout(() => {
        setShowSignModal(false);
      }, 2000);



      //      await submitPayload(signChallenge, signature);
      // set status as signed s

    } catch {
      setSignStatus("error");
      setSignError(t("signup.sign.error.description"));
    }
  };


  return (
    <div className="w-full max-w-lg xl:max-w-xl mx-auto flex flex-col gap-4 p-4">
      {/* Progress + Header */}
      <div className="mb-1 mt-10">
        <div className="mb-3 flex items-center gap-4 cursor-pointer" onClick={() => setStep(1)}>
          <ArrowLeft className="w-4 h-4 text-slate-600 hover:text-violet-800 transition-colors" />
        </div>
        {stepIndicator}
        <h1 className="text-xl font-bold text-gray-900 leading-snug">
          Conecta tu wallet y firma el mensaje
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          No se realizarán transacciones ni se cobrará ninguna tarifa. Esto es solo para verificar que eres el propietario de la wallet.{" "}
        </p>
      </div>

      {/* Connected wallet indicator */}

      {isConnected && address && (
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
            <Wallet className="h-5 w-5 text-emerald-600" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Wallet conectada
            </p>
            <p className="truncate font-mono text-sm font-semibold text-slate-900">
              {address}
            </p>
          </div>


          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />

          <button
            type="button"
            onClick={() => disconnect()}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
            title="Desconectar wallet"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      )}


      <div className="flex-1" />

      {/* CTA */}
      <div>
        {!isConnected && (
          <button
            className="w-full bg-violet-600 hover:bg-violet-700 active:scale-[0.98] text-white font-semibold text-sm py-3.5 rounded-2xl 
                     flex items-center justify-center gap-2 transition-all shadow-md shadow-violet-200
                     disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none"

            onClick={() => connectWallet()}
          >
            <Wallet className="w-5 h-5" />
            Conectar wallet
          </button>
        )}

        {isConnected && address && (
          <button
            className="w-full bg-violet-600 hover:bg-violet-700 active:scale-[0.98] text-white font-semibold text-sm py-3.5 rounded-2xl 
                     flex items-center justify-center gap-2 transition-all shadow-md shadow-violet-200
                     disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none"

            onClick={() => {
              setShowSignModal(true);
            }}
          >
            <Wallet className="w-5 h-5" />
            Firmar mensaje
          </button>
        )}
        {signature && (
            <button
            className="w-full bg-violet-600 hover:bg-violet-700 active:scale-[0.98] text-white font-semibold text-sm py-3.5 rounded-2xl 
                     flex items-center justify-center gap-2 transition-all shadow-md shadow-violet-200
                     disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none"

            onClick={() => {
              submitForm();
            }}
          >
            <Check className="w-5 h-5" />
            Submit form
          </button>
          )}

      </div>

      {showSignModal && (
        <SignModal
          address={address}
          message={message}
          status={signStatus}
          errorMessage={signError}
          onSign={handleSign}
          onClose={() => {
            setShowSignModal(false);
            setSignStatus("idle");
          }}
          t={t}
        />
      )}

    </div>
  );
}