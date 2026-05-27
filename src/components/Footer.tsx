import { getLanguageCookie } from "@/lib/cookies";
import { translations } from "@/translations";

export default async function Footer() {
  const language = await getLanguageCookie();
  const t = (key: string) => translations[key]?.[language] ?? key;

  return (
    <footer className="bg-primary text-white py-12">
      <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center items-center space-x-2 mb-6">
          <span className="text-xl font-bold font-heading">AvalDAO</span>
        </div>
        <p className="mb-4">
          {t("footer.description")}
        </p>
        <div className="text-sm">
          <p>© {new Date().getFullYear()} AvalDAO. {t("footer.rights-reserved")}</p>
        </div>
      </div>
    </footer>
  )
}