import WalletAuth from "@/components/wallet-auth";
import AppkitContextProvider from "@/context/appkit-context";
import { LanguageProvider } from "@/context/LanguageContext";
import { Language, translations } from "@/translations";
import { Wallet } from "lucide-react";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";


export default function LoginWithWallet({ language }: { language: Language }) {
  const t = (key: string) => translations[key]?.[language] ?? key;
  const router = useRouter();

  const loginWithWallet = async () => {
    //ask connection

  }



  return (
    <>
      <AppkitContextProvider>
        <SessionProvider>
          <LanguageProvider initialLanguage={language}>
            <WalletAuth
              forceButton={true}
              buttonContent={
                <button
                  className="w-full max-w-md 
                  bg-linear-to-r from-violet-600 to-fuchsia-600 
                  hover:from-violet-700 hover:to-fuchsia-700
                  
                  cursor-pointer
                  active:scale-[0.98] text-white font-semibold text-sm py-3.5 rounded-2xl 
                  flex items-center justify-center gap-2 transition-all shadow-md shadow-violet-200
                  disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
                  onClick={loginWithWallet}
                >
                  <Wallet className="w-4 h-4" />
                  {t("login.submit.wallet")}

                </button>
              }

              onSuccessLogin={() => {
                router.push("/dashboard");
              }}
              onErrorLogin={(error) => {
                console.log(error);
                if(error.message === "USER_NOT_FOUND"){
                  toast.error(t("login.error.user-not-found-wallet"));
                }

              }}
            />
          </LanguageProvider>
        </SessionProvider>
      </AppkitContextProvider>





    </>
  )
}