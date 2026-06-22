import { getLanguageCookie } from "@/lib/cookies";
import DashboardAnimation from "./dashboard-animation";
import GuaranteeFund from "./GuaranteeFund";
import { translations } from "@/translations";


export default async function DashboardSection() {
  const language = await getLanguageCookie();
  const t = (key: string) => translations[key]?.[language] ?? key;
 


  return (
    <section id="dashboard" className="
    py-20 bg-primary text-white  bg-[url(/images/guarantee-fund-bg.png)]
    bg-cover bg-no-repeat
    relative
    ">
      <DashboardAnimation />

      <div className="container mx-auto px-4 z-2 relative max-w-7xl">
        <h2 className="text-4xl font-bold text-center font-heading mb-12">{t("dashboard.title")}</h2>
        <p className="text-lg text-gray-100 text-center mb-12 max-w-lg mx-auto">
          {t("dashboard.description")}
        </p>

        <GuaranteeFund />


      </div>
    </section>
  )
}