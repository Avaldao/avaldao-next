"use client";

import { Button } from "@/components/ui/button";
import FileInput from "@/components/ui/file-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Spinner from "@/components/ui/spinner";

import { Camera, Save } from "lucide-react";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

interface User {
  name: string;
  email: string;
  website?: string;
  avatar?: string;
}

interface FieldErrors {
  name?: string,
  email?: string
  website?: string
}


/* Receives user in edition, or sth like that 
  we're going to add address as read-only and roles

*/
export default function ProfileForm({ user, update }: { user?: User, update?: (data?: any) => Promise<Session | null> }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [website, setWebsite] = useState(user?.website ?? "");

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(user?.avatar ?? null);


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const setFieldError = (field: string, value: string) => {
    setFieldErrors(prevs => ({
      ...prevs,
      [field]: value
    })
    )
  };

  const clearFieldError = (field: string) => {
    setFieldErrors(prevs => ({
      ...prevs,
      [field]: undefined
    })
    )
  };


  const clearFormErrors = () => {
    setFieldErrors({});
  }


  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    clearFormErrors();


    //validate form
    if (website.trim() != "") {
      const urlRegex = /^https:\/\/[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;

      if (!urlRegex.test(website.trim())) {
        setFieldError("website", "Por favor proporciona una URL válida");
        return;
      }
    }

    //Submit form

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    if (website && website.trim() != "") {
      formData.append("website", website);
    }
    if (file) {
      formData.append("avatar", file);
    }


    try {
      setLoading(true);
      const response: Response = await fetch(`/api/users/profile`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast.success("Perfil actualizado exitosamente");
        if (update) {
          await update();
          console.log("Updated was called")
        }
      }


    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }


  return (
    <form onSubmit={handleSubmit}>

      <div className="mb-3">
        <Label>
          Avatar
        </Label>

        <div className="flex justify-center sm:justify-start sm:pl-10 pl-4">
          <ProfileAvatar
            preview={preview}
            handleOpenFileDialog={() => fileInputRef?.current?.click()}
          />
        </div>

        <FileInput
          text="profile.upload.select-file"
          showButton={false}
          ref={fileInputRef}
          inputProps={{
            accept: "image/*"
          }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const url = URL.createObjectURL(file);
              setFile(file);
              setPreview(url);
            }
          }}
        />
      </div>
      <div>
        <Label htmlFor="name">Nombre</Label>
        <Input
          id="name"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Juan Pérez"
        />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="micorreo@gmail.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>


      <div>
        <Label htmlFor="website">Sitio Web</Label>
        <Input
          id="website"
          placeholder="https://misitioweb.com"
          value={website}
          onChange={e => setWebsite(e.target.value)}
          error={fieldErrors["website"]}
        />
      </div>


      {/* Error Display */}
      {error && (
        <div className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
          {error}
        </div>
      )}

      <Button
        loading={loading}
      >
        {loading ? <Spinner /> : <Save />}
        Guardar
      </Button>

    </form>
  )
}

interface ProfileAvatarProps {
  preview: string | null,
  handleOpenFileDialog: () => void,
}

function ProfileAvatar({ preview, handleOpenFileDialog }: ProfileAvatarProps) {

  const size = "w-50 h-50 ";

  return (
    <div className="flex flex-col items-center space-y-4 w-fit">
      <div className="group relative">
        {!preview && (
          <div
            onClick={handleOpenFileDialog}
            className={`${size} flex flex-col gap-y-2 items-center justify-center rounded-full bg-gray-100 border-2 border-dashed border-gray-300 hover:bg-gray-200 hover:border-gray-400 cursor-pointer transition-all duration-200`}
          >
            <Camera className="w-10 h-10 text-gray-600" />
            <span className="text-sm text-gray-600 select-none px-3 text-center">
              {"profile.avatar.upload-text"}
            </span>
          </div>
        )}
        {preview && (
          <>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div
                onClick={handleOpenFileDialog}
                className={`${size} flex flex-col gap-y-2 items-center justify-center rounded-full bg-black/55 cursor-pointer`}
              >
                <Camera className="w-8 h-8 text-white" />
                <span className="text-sm text-white select-none px-3 text-center">
                  {"profile.avatar.change-text"}
                </span>
              </div>
            </div>
            <div className="cursor-pointer" onClick={handleOpenFileDialog}>
              <img
                src={preview}
                alt={"profile.avatar.alt"}
                className={`${size} rounded-full shadow-sm object-cover object-center border border-gray-200`}
              />
            </div>
          </>
        )}

      </div>
    </div>

  )
}



