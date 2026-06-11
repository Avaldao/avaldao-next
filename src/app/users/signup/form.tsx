"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SessionProvider, useSession } from "next-auth/react";
import { Checkbox } from "@headlessui/react";
import toast from "react-hot-toast";

import AccountTypeSelector, { AccountType, accountTypes } from "@/app/register/account-type-selector";
import PlatformRoleSelector, { PlatformRole } from "./platform-role-selector";
import { TyCDialog } from "@/app/register/tyc-dialog";
import SignModal, { SignStatus } from "./sign-modal";
import SuccessfulRegistration from "@/components/ui/successful-registration";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { Language, translations } from "@/translations";
import { LanguageProvider } from "@/context/LanguageContext";
import { useAppKit, useAppKitAccount, useAppKitProvider, useDisconnect } from "@reown/appkit/react";
import { BrowserProvider, Eip1193Provider, getAddress } from "ethers";
import { useRouter } from "next/navigation";
import AskConnectionModal from "./ask-connection-modal";
import AppkitContextProvider from "@/context/appkit-context";
import { Power, PowerOff } from "lucide-react";

// RFC 5322 email validation
const RFC5322_EMAIL =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const COUNTRIES = [
  "Argentina",
  "Bolivia",
  "Brasil",
  "Chile",
  "Colombia",
  "Costa Rica",
  "Cuba",
  "Ecuador",
  "El Salvador",
  "España",
  "Guatemala",
  "Honduras",
  "México",
  "Nicaragua",
  "Panamá",
  "Paraguay",
  "Perú",
  "República Dominicana",
  "Uruguay",
  "Venezuela",
  "──────────────",
  "Alemania",
  "Australia",
  "Canadá",
  "China",
  "Estados Unidos",
  "Francia",
  "Italia",
  "Japón",
  "Portugal",
  "Reino Unido",
  "Suiza",
  "Otro",
];

function buildTyC(t: (key: string) => string): string {
  const s = (title: string, body: string) =>
    `<p><strong>${title}</strong></p><p>${body}</p><br/>`;
  return [
    `<h3 style="margin-bottom:1rem;font-weight:600">${t("signup.tyc.title")}</h3>`,
    `<p>${t("signup.tyc.intro")}</p><br/>`,
    s(t("signup.tyc.s1.title"), t("signup.tyc.s1.body")),
    s(t("signup.tyc.s2.title"), t("signup.tyc.s2.body")),
    s(t("signup.tyc.s3.title"), t("signup.tyc.s3.body")),
    s(t("signup.tyc.s4.title"), t("signup.tyc.s4.body")),
    s(t("signup.tyc.s5.title"), t("signup.tyc.s5.body")),
    `<p style="color:#64748b;font-size:0.85rem">${t("signup.tyc.draft")}</p>`,
  ].join("");
}

type FieldName =
  | "accountType"
  | "firstName"
  | "lastName"
  | "companyName"
  | "cuit"
  | "email"
  | "country"
  | "location"
  | "platformRoles"
  | "acceptTyC"
  | "acceptPrivacy"
  | "confirmAge";

type FormErrors = Partial<Record<FieldName, string>>;

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-base font-semibold text-slate-700 mb-1">{children}</p>
  );
}

function CheckboxRow({
  checked,
  onChange,
  error,
  children,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-start gap-3">
        <Checkbox
          checked={checked}
          onChange={onChange}
          className="mt-0.5 group block size-5 shrink-0 cursor-pointer rounded border border-slate-300 bg-white p-0.5 data-checked:border-secondary data-checked:bg-secondary"
        >
          <svg
            className="stroke-white opacity-0 group-data-checked:opacity-100"
            viewBox="0 0 14 14"
            fill="none"
          >
            <path
              d="M3 8L6 11L11 3.5"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Checkbox>
        <span className="text-sm text-slate-700 leading-5">{children}</span>
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-1 ml-8">{error}</p>
      )}
    </div>
  );
}

function SignupFormInner({ language }: { language: Language }) {
  const t = useMemo(() => (key: string) => translations[key]?.[language] ?? key, [language]);
  const { data: session } = useSession();
  const router = useRouter();

  const { open } = useAppKit();
  const { isConnected, address } = useAppKitAccount();
  const { disconnect } = useDisconnect();

  const { walletProvider } = useAppKitProvider<Eip1193Provider>("eip155");

  const [signChallenge, setSignChallenge] = useState<string | null>(null);
  const [signStatus, setSignStatus] = useState<SignStatus>("idle");
  const [signError, setSignError] = useState<string | undefined>();
  const [showSignModal, setShowSignModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showAskConnectionModal, setShowAskConnectionModal] = useState(false);
  const [shouldAskSignature, setShouldAskSignature] = useState(false);

  const [accountType, setAccountType] = useState<AccountType | undefined>(accountTypes[0]);
  const [animateAccountTypeFields, setAnimateAccountTypeFields] = useState(false);
  const [platformRoles, setPlatformRoles] = useState<PlatformRole[]>([]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [cuit, setCuit] = useState("");

  const [email, setEmail] = useState("");

  const [country, setCountry] = useState("");
  const [location, setLocation] = useState("");

  const [acceptTyC, setAcceptTyC] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);


  const [showTyCDialog, setShowTyCDialog] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const accountTypeRef = useRef<HTMLInputElement | null>(null);
  const platformRolesRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (accountType) setErrors((e) => ({ ...e, accountType: undefined }));
  }, [accountType]);

  useEffect(() => {
    if (platformRoles.length > 0)
      setErrors((e) => ({ ...e, platformRoles: undefined }));
  }, [platformRoles]);

  useEffect(() => {
    setAnimateAccountTypeFields(true);
  }, []);

  useEffect(() => {
    if (shouldAskSignature && address && isConnected) {
      setShouldAskSignature(false);
      askSignature();
    }
  }, [shouldAskSignature, address, isConnected]);




  const validate = (): boolean => {
    const next: FormErrors = {};

    if (!accountType) {
      next.accountType = t("signup.form.validation.accountType");
    }

    if (accountType?.value === "personal") {
      if (!firstName.trim()) next.firstName = t("signup.form.validation.firstName");
      if (!lastName.trim()) next.lastName = t("signup.form.validation.lastName");
    } else if (accountType?.value === "business") {
      if (!companyName.trim()) next.companyName = t("signup.form.validation.companyName");
      if (!cuit.trim()) next.cuit = t("signup.form.validation.cuit");
    }

    if (!email.trim()) {
      next.email = t("signup.form.validation.email.required");
    } else if (!RFC5322_EMAIL.test(email.trim())) {
      next.email = t("signup.form.validation.email.invalid");
    }

    if (!country) next.country = t("signup.form.validation.country");
    if (!location.trim()) next.location = t("signup.form.validation.location");

    if (platformRoles.length === 0) {
      next.platformRoles = t("signup.form.validation.roles");
    }

    if (!acceptTyC) next.acceptTyC = t("signup.form.validation.tyc");
    if (!acceptPrivacy) next.acceptPrivacy = t("signup.form.validation.privacy");



    setErrors(next);

    const hasErrors = Object.keys(next).length > 0;
    if (hasErrors) {
      const firstKey = Object.keys(next)[0] as FieldName;
      if (firstKey === "accountType") {
        accountTypeRef.current?.focus();
        setTimeout(() => accountTypeRef.current?.blur(), 300);
      } else if (firstKey === "platformRoles") {
        platformRolesRef.current?.focus();
        setTimeout(() => platformRolesRef.current?.blur(), 300);
      }
      toast.error(t("signup.form.error.required-fields"));
      return false;
    }

    return true;
  };


  const askSignature = async () => {

    if (!address) {
      throw new Error("No address connected");
    }
    const res = await fetch(`/api/challenges?address=${address}`);
    const { message: challenge } = await res.json();
    setSignChallenge(challenge);
    setSignStatus("idle");
    setSignError(undefined);
    setShowSignModal(true);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || loading) return;

    try {
      setLoading(true);

      if (!isConnected || !address) {
        localStorage.removeItem("signup_message");
        localStorage.removeItem("signup_signature");
        setShowAskConnectionModal(true);
        return;

      }

      const cached_message = localStorage.getItem("signup_message");
      const cached_signature = localStorage.getItem("signup_signature");

      if (cached_message && cached_signature) {
        await submitPayload(cached_message, cached_signature);
        return;
      } else {
        await askSignature();
      }
    } catch {
      toast.error(t("signup.form.error.unexpected"));
    } finally {
      setLoading(false);
    }
  };

  const handleSign = async () => {
    if (!signChallenge) return;
    setSignStatus("waiting");
    setSignError(undefined);
    try {
      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();
      const signature = await signer.signMessage(signChallenge);
      setSignStatus("success");
      localStorage.setItem("signup_message", signChallenge);
      localStorage.setItem("signup_signature", signature);

      setTimeout(() => {
        setShowSignModal(false);
        router.refresh();
      }, 1000);


      await submitPayload(signChallenge, signature);
      setShowSignModal(false);
    } catch {
      setSignStatus("error");
      setSignError(t("signup.sign.error.description"));
    }
  };

  const submitPayload = async (message?: string, signature?: string) => {

    setLoading(true);

    const payload = {
      accountType: accountType!.value,
      ...(accountType!.value === "personal"
        ? { firstName, lastName }
        : { companyName, cuit }),
      email,
      country,
      location,
      platformRoles: platformRoles.map((r) => r.value),
      acceptTyC,
      acceptPrivacy,
      message,
      signature,
      language,
    };

    const response = await fetch("/api/users/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    localStorage.removeItem("signup_message");
    localStorage.removeItem("signup_signature");

    if (response.ok) {
      setLoading(false);
      setShowSuccessModal(true);
    } else {
      setLoading(false);

      let msg;
      try {
        const responseJson = await response.json();
        const { message: errMsg } = responseJson;
        msg = errMsg;
      } catch {
        msg = undefined;
      }

      if (!msg) {
        msg = await response.text();
        console.log(msg);
      }

      toast.error(msg ?? t("signup.form.error.unexpected"));
      

    }



  };



  return (
    <>

      <form onSubmit={handleSubmit} noValidate className="space-y-4 max-w-5xl">
        {/* ── Tipo de cuenta ─────────────────────────────── */}
        <section className="-mb-1">

          <SectionTitle>{t("signup.form.account-type")}</SectionTitle>
          <AccountTypeSelector
            language={language}
            ref={(el) => {
              accountTypeRef.current = el;
            }}
            initialType="personal"
            onTypeSelected={setAccountType}
          />
          {errors.accountType && (
            <p className="text-red-500 text-sm mt-1">{errors.accountType}</p>
          )}

          <AnimatePresence mode="wait">
            {accountType?.value === "personal" && (
              <motion.div
                key="personal"
                initial={animateAccountTypeFields ? { opacity: 0, y: -10 } : false}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.25 }}
                className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2"
              >
                <div>
                  <Label required>{t("signup.form.personal.firstName")}</Label>
                  <Input
                    autoComplete="given-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    error={errors.firstName}
                    placeholder={t("signup.form.personal.firstName.placeholder")}
                    required
                  />
                </div>
                <div>
                  <Label required>{t("signup.form.personal.lastName")}</Label>
                  <Input
                    autoComplete="family-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    error={errors.lastName}
                    placeholder={t("signup.form.personal.lastName.placeholder")}
                    required
                  />
                </div>
              </motion.div>
            )}

            {accountType?.value === "business" && (
              <motion.div
                key="business"
                initial={animateAccountTypeFields ? { opacity: 0, y: -10 } : false}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.25 }}
                className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2"
              >
                <div>
                  <Label required>{t("signup.form.business.companyName")}</Label>
                  <Input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    error={errors.companyName}
                    placeholder={t("signup.form.business.companyName.placeholder")}
                    required
                  />
                </div>
                <div>
                  <Label required>{t("signup.form.business.cuit")}</Label>
                  <Input
                    value={cuit}
                    onChange={(e) => setCuit(e.target.value)}
                    error={errors.cuit}
                    placeholder={t("signup.form.business.cuit.placeholder")}
                    required
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ── Contacto ───────────────────────────────────── */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 -mb-1">
          <div>
            <Label required>{t("signup.form.email")}</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              placeholder="tu@email.com"
              required
            />
          </div>
          <div>
            <Label>{t("signup.form.wallet")}</Label>
            <div className="relative">

              <Input
                readOnly
                value={address ? getAddress(address) : ""}
                className="bg-slate-100 cursor-not-allowed text-slate-500 font-mono"
                placeholder={t("signup.form.wallet.placeholder")}
              />
              {isConnected && (
                <div className="absolute right-0 top-0 bottom-0 text-red-300 p-2 flex flex-col justify-center pb-5">
                  <button
                    title="Disconnect"
                    onClick={async (e) => {
                      e.preventDefault();
                      await disconnect();

                    }}>
                    <PowerOff className="h-4 w-4 cursor-pointer hover:text-red-600 transition-colors" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Ubicación ──────────────────────────────────── */}
        <section>
          <SectionTitle>{t("signup.form.location")}</SectionTitle>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label required>{t("signup.form.location.country")}</Label>
              <select
                value={country}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "──────────────") return;
                  setCountry(val);
                  if (val) setErrors((er) => ({ ...er, country: undefined }));
                }}
                className={`bg-gray-50 border text-slate-800 text-sm rounded-lg block w-full p-2.5 focus:ring-1 focus:ring-secondary focus:border-secondary focus-visible:ring-1 focus-visible:ring-secondary focus-visible:border-secondary focus-visible:outline-none ${errors.country
                  ? "border-red-300 focus:ring-red-300 focus:border-red-300"
                  : "border-gray-300"
                  }`}
              >
                <option value="">{t("signup.form.location.country.placeholder")}</option>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c} disabled={c === "──────────────"}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.country && (
                <p className="text-sm text-red-500 mt-1 mb-2 ml-1">{errors.country}</p>
              )}
            </div>
            <div>
              <Label required>{t("signup.form.location.city")}</Label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                error={errors.location}
                placeholder={t("signup.form.location.city.placeholder")}
                required
              />
            </div>
          </div>
        </section>

        {/* ── Roles en la plataforma ─────────────────────── */}
        <section>
          <SectionTitle>{t("signup.form.roles")}</SectionTitle>
          <p className="text-sm text-slate-500 mb-1">
            {t("signup.form.roles.hint")}
          </p>
          <PlatformRoleSelector
            language={language}
            ref={(el) => {
              platformRolesRef.current = el;
            }}
            onRolesSelected={setPlatformRoles}
          />
          {errors.platformRoles && (
            <p className="text-red-500 text-sm mt-1">{errors.platformRoles}</p>
          )}
        </section>

        {/* ── Aceptación legal ───────────────────────────── */}
        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-4">
          <SectionTitle>{t("signup.form.legal")}</SectionTitle>
          <div className="h-1"></div>
          <CheckboxRow
            checked={acceptTyC}
            onChange={(v) => {
              if (v) {
                setShowTyCDialog(true);
              } else {
                setAcceptTyC(false);
              }
            }}
            error={errors.acceptTyC}
          >
            {t("signup.form.legal.tyc.pre")}{" "}
            <button
              type="button"
              onClick={() => setShowTyCDialog(true)}
              className="font-semibold text-secondary underline-offset-2 hover:underline"
            >
              {t("signup.form.legal.tyc.link")}
            </button>
          </CheckboxRow>

          <CheckboxRow
            checked={acceptPrivacy}
            onChange={(v) => {
              setAcceptPrivacy(v);
              if (v) setErrors((e) => ({ ...e, acceptPrivacy: undefined }));
            }}
            error={errors.acceptPrivacy}
          >
            {t("signup.form.legal.privacy.pre")}{" "}
            <span className="font-semibold text-slate-700">{t("signup.form.legal.privacy.label")}</span>
          </CheckboxRow>


        </section>

        {/* ── Submit ─────────────────────────────────────── */}
        <Button type="submit" loading={loading} className="w-full sm:w-auto px-10">
          {t("signup.form.submit")}
          {loading && <Spinner variant="sm" />}
        </Button>

        {showTyCDialog && (
          <TyCDialog
            tyc={buildTyC(t)}
            setShowTyCDialog={setShowTyCDialog}
            onAccept={() => {
              setAcceptTyC(true);
              setErrors((e) => ({ ...e, acceptTyC: undefined }));
              setShowTyCDialog(false);
            }}
            onDecline={() => {
              setAcceptTyC(false);
              setShowTyCDialog(false);
            }}
          />
        )}
      </form>
      {showAskConnectionModal && (
        <AskConnectionModal
          onConnect={async () => {
            setShowAskConnectionModal(false);
            await open({ view: 'Connect' });
            setShouldAskSignature(true);
          }}
          onSkip={() => {
            setShowAskConnectionModal(false);
            //Submit the form without message, without signature and skip wallet connection
            submitPayload();

          }}
          t={t}
        />
      )}
      {showSignModal && (
        <SignModal
          address={address}
          message={signChallenge ?? undefined}
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

      <SuccessfulRegistration
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          router.push("/");
        }}
        t={t}
      />


    </>
  );
}

export default function SignupForm({ language }: { language: Language }) {
  return (
    <SessionProvider>
      <AppkitContextProvider>
        <LanguageProvider initialLanguage={language}>
          <SignupFormInner language={language} />
        </LanguageProvider>
      </AppkitContextProvider>
    </SessionProvider>
  );
}