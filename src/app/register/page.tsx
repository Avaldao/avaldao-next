"use client";
import Page from "@/components/layout/page";
import AccountTypeSelector, { AccountType } from "./account-type-selector";
import RolesSelector, { AccountRole } from "./role-selector";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Checkbox } from "@headlessui/react";
import { TyCDialog } from "./tyc-dialog";
import ConnectedAddressInput from "./connected-address-input";
import { SessionProvider } from "next-auth/react";
import toast from "react-hot-toast";
import Spinner from "@/components/ui/spinner";


type FieldName = "accountType" | "firstname" | "lastname" | "companyName" | "companyNumberId" | "address" | "email" | "website" | "accountRoles";

interface FormData {
  accountType: AccountType | undefined; //id or enum
  // Personal account fields
  firstname: string;
  lastname: string;
  // Business account fields
  companyName: string;
  companyNumberId: string;
  // Common fields
  address: string;
  email: string;
  website?: string;
  accountRoles: AccountRole[]; //arr of strings (ids or enum)
}

interface FormErrors extends Record<FieldName, string | undefined> { }


export default function RegisterPage() {

  const [formData, setFormData] = useState<FormData>({
    accountType: undefined,
    firstname: "",
    lastname: "",
    companyName: "",
    companyNumberId: "",
    address: "",
    email: "",
    website: "",

    accountRoles: []
  });

  const [showTyCDialog, setShowTyCDialog] = useState<boolean>(false);
  const [tycApproved, setTycApproved] = useState(false);
  const [accountType, setAccountType] = useState<AccountType | undefined>();
  const [accountRoles, setAccountRoles] = useState<AccountRole[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<Partial<FormErrors>>({});

  const inputRefs = useRef<Record<FieldName, HTMLInputElement | null>>({
    "accountType": null,
    "firstname": null,
    "lastname": null,
    "companyName": null,
    "companyNumberId": null,
    "address": null,
    "email": null,
    "website": null,
    "accountRoles": null
  });


  useEffect(() => {
    if (accountType) {
      clearFieldError("accountType");
    }
  }, [accountType]);

  useEffect(() => {
    if (accountRoles.length > 0) {
      clearFieldError("accountRoles");
    }
  }, [accountRoles])


  const setFieldError = (field: string, value: string) => {
    setFormErrors(errors => ({
      ...errors,
      [field]: value
    })
    )
  };

  const clearFieldError = (field: string) => {
    setFormErrors(errors => ({
      ...errors,
      [field]: undefined
    })
    )
  };


  const clearFormErrors = () => {
    setFormErrors({});
  }



  // Generic input change handler
  const handleInputChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const validateForm = () => {
    let hasError = false;
    clearFormErrors();
    //set errors
    if (!accountType) {
      setFieldError("accountType", "Please select an account type");
      inputRefs.current.accountType?.focus();
      setTimeout(() => { inputRefs.current.accountType?.blur(); }, 300);
      hasError = true;
    }


    if (formData["website"] && formData["website"].trim() != "") {
      const urlRegex = /^https:\/\/[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;

      if (!urlRegex.test(formData["website"]!.trim())) {
        setFieldError("website", "Por favor proporciona una URL válida");
        if (!hasError) {
          inputRefs.current.website?.focus();
        }
        hasError = true;
        return;
      }
    }

    if (accountRoles.length == 0) {
      setFieldError("accountRoles", "Please select at least one account role");
      if (!hasError) {
        inputRefs.current.accountRoles?.focus();
        setTimeout(() => { inputRefs.current.accountRoles?.blur(); }, 300);
      }
      hasError = true;
    }


    if (!tycApproved) {
      if (!hasError) {
        toast.error("Please review and accept terms and conditions");
      }
      hasError = true;
    }



    return !hasError;

  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const valid = validateForm();
    if (!valid) return;

    if (loading) return;

    try {
      setLoading(true);

      const response = await fetch(`/api/users/signup`, {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          accountType: accountType?.value,
          accountRoles: accountRoles.map(r => r.value)
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
      } else {
        const { message } = await response.json();
        if(message){
          toast.error(`Error creating user: ${message}`);

        } else {
          toast.error(`Something went wrong while registering the account`);
        }
      }



    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }

  };



  return (
    <Page>
      <div className="text-2xl text-slate-800 text-heading mt-1  mb-6 flex space-between">
        Create Account
      </div>


      <form onSubmit={handleSubmit}
        className=""
      >


        <div className="mb-5">
          <Label>Account type</Label>
          <AccountTypeSelector
            ref={(el) => { inputRefs.current.accountType = el; }}

            onTypeSelected={setAccountType}
          />

          <div className="min-h-5 mt-1 mb-2">
            {formErrors["accountType"] &&
              <p className="text-red-500 text-sm"
              >{formErrors["accountType"]}
              </p>
            }
          </div>

          <AnimatePresence mode="wait">
            {accountType?.value == "personal" && (
              <motion.div
                key="personal"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.25 }}
                className=""
              >
                <div>
                  <Label>Firstname*</Label>
                  <Input
                    value={formData.firstname}
                    onChange={handleInputChange("firstname")}
                    error={formErrors["firstname"]}
                    ref={(el) => { inputRefs.current.firstname = el; }}
                    required />
                </div>
                <div>
                  <Label>Lastname*</Label>
                  <Input
                    value={formData.lastname}
                    onChange={handleInputChange("lastname")}
                    error={formErrors["lastname"]}
                    ref={(el) => { inputRefs.current.lastname = el; }}
                    required />
                </div>
              </motion.div>
            )}

            {accountType?.value == "business" && (
              <motion.div
                key="business"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.25 }}
                className=""
              >
                <div>
                  <Label>Company Name*</Label>
                  <Input
                    value={formData.companyName}
                    onChange={handleInputChange("companyName")}
                    error={formErrors["companyName"]}
                    ref={(el) => { inputRefs.current.companyName = el; }}
                    required />
                </div>
                <div>
                  <Label>Company Number ID*</Label>
                  <Input
                    value={formData.companyNumberId}
                    onChange={handleInputChange("companyNumberId")}
                    error={formErrors["companyNumberId"]}
                    ref={(el) => { inputRefs.current.companyNumberId = el; }}
                    required />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <Label>Address*</Label>
            <Input
              placeholder="Country, State, City, Street address…"
              autoComplete="address-level1"
              value={formData.address}
              onChange={handleInputChange("address")}
              error={formErrors["address"]}
              ref={(el) => { inputRefs.current.address = el; }}
              required
            />
          </div>
          <div>
            <Label>Email*</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={handleInputChange("email")}
              error={formErrors["email"]}
              ref={(el) => { inputRefs.current.email = el; }}
              required
            />
          </div>
          <div>
            <Label>Website</Label>
            <Input
              value={formData.website}
              onChange={handleInputChange("website")}
              error={formErrors["website"]}
              ref={(el) => { inputRefs.current.website = el; }}


            />
          </div>


          <div>
            <Label>Address</Label>
            <SessionProvider>
              <ConnectedAddressInput />
            </SessionProvider>
          </div>

          <div>

            <Label>Roles</Label>
            <RolesSelector
              ref={(el) => { inputRefs.current.accountRoles = el; }}
              onSelectedRoles={setAccountRoles} /* Al menos 1 rol */
            />
            <div className="min-h-5 mt-1 mb-2">
              {formErrors["accountRoles"] &&
                <p className="text-red-500 text-sm"
                >{formErrors["accountRoles"]}
                </p>
              }
            </div>

          </div>


        </div>



        <div className="flex items-center space-x-2 mt-8 mb-4">

          <Checkbox
            checked={tycApproved}
            onChange={checked => {
              if (checked) {
                setShowTyCDialog(true);
              } else {
                setTycApproved(false);
              }
            }}
            className="group block size-5 rounded border bg-white p-0.5 data-checked:bg-secondary"
          >
            {/* Checkmark icon */}
            <svg className="stroke-white opacity-0 group-data-checked:opacity-100" viewBox="0 0 14 14" fill="none">
              <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Checkbox>

          <span>I accept the

            <span onClick={() => setShowTyCDialog(true)} className="font-semibold text-secondary select-none cursor-pointer"> Terms & Privacy Policy</span>

          </span>
        </div>

        {showTyCDialog && (

          <TyCDialog
            setShowTyCDialog={setShowTyCDialog}
            onAccept={() => {
              setTycApproved(true);
              setShowTyCDialog(false);
            }}
            onDecline={() => {
              setShowTyCDialog(false);
            }}
            tyc={"Avaldao terms and conditions"}
          />
        )}

        <div className="flex justify-end">

          <Button
            loading={loading}
          /* disabled={!tycApproved || accountType == undefined} */
          >
            Create Account
            {loading && <Spinner />}
          </Button>
        </div>


      </form>

    </Page>
  )
}