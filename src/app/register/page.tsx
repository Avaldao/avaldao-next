"use client";
import Page from "@/components/layout/page";
import AccountTypeSelector, { AccountType } from "./account-type-selector";
import RolesSelector, { AccountRole } from "./role-selector";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Checkbox } from "@headlessui/react";
import { TyCDialog } from "./tyc-dialog";


export default function RegisterPage() {

  const [showTyCDialog, setShowTyCDialog] = useState<boolean>(false);
  const [tycApproved, setTycApproved] = useState(false);
  const [accountType, setAccountType] = useState<AccountType | undefined>();
  const [accountRoles, setAccountRoles] = useState<AccountRole[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {

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
            onTypeSelected={setAccountType}
          />

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
                  <Label>Firstname</Label>
                  <Input required />
                </div>
                <div>
                  <Label>Lastname</Label>
                  <Input required />
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
                  <Label>Company Name</Label>
                  <Input required />
                </div>
                <div>
                  <Label>Company Number ID</Label>
                  <Input required />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <Label>Address</Label>
            <Input
              placeholder="Country, State, City, Street address…"
              required
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              required
            />
          </div>
          <div>
            <Label>Website</Label>
            <Input


            />
          </div>


          <Label>Roles</Label>
          <RolesSelector
            onSelectedRoles={setAccountRoles} /* Al menos 1 rol */
          />
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
            disabled={!tycApproved || accountType == undefined}

          >Create Account</Button>
        </div>


      </form>

    </Page>
  )
}