
import { handleError, OkResponse } from "@/app/api/response-handler";
import { NotAuthenticatedError } from "@/errors";
import { authOptions } from "@/lib/auth";

import UserService from "@/services/users-service";
import { getServerSession } from "next-auth";

const usersService = new UserService();

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/gif", "image/webp"]);
const MAX_AVATAR_BYTES = 5 * 1024 * 1024; // 5 MB

async function hasValidImageMagicBytes(file: File): Promise<boolean> {
  const buf = Buffer.from(await file.slice(0, 12).arrayBuffer());
  // JPEG: FF D8 FF
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return true;
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return true;
  // GIF: GIF8
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x38) return true;
  // WebP: RIFF????WEBP
  if (
    buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
    buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50
  ) return true;
  return false;
}

const badRequest = (message: string) =>
  new Response(JSON.stringify({ message }), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  });

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.id) throw new NotAuthenticatedError();

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const website = formData.get("website") as string;
    const avatarField = formData.get("avatar");

    let avatar: File | undefined;
    if (avatarField instanceof File && avatarField.size > 0) {
      if (!ALLOWED_MIME_TYPES.has(avatarField.type)) {
        return badRequest("Tipo de archivo no permitido. Solo se aceptan imágenes JPEG, PNG, GIF o WebP.");
      }
      if (avatarField.size > MAX_AVATAR_BYTES) {
        return badRequest("El archivo es demasiado grande. El tamaño máximo permitido es 5 MB.");
      }
      if (!(await hasValidImageMagicBytes(avatarField))) {
        return badRequest("El contenido del archivo no corresponde a una imagen válida.");
      }
      avatar = avatarField;
    }

    const result = await usersService.updateProfile({
      id: session.user.id,
      address: session.user.address,
      name,
      email,
      website,
      avatar,
    });

    return OkResponse(result);

  } catch (err) {
    console.error(err);
    return handleError(err);
  }
}