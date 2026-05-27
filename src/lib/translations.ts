import { translations } from "@/translations";
import { getLanguageCookie } from "./cookies";

export default async function translation() {
  const language = await getLanguageCookie();
  return (key: string) => translations[key]?.[language] ?? key;
}