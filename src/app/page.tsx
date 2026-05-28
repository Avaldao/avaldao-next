import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import Dashboard from '@/components/Dashboard'
import Footer from '@/components/Footer'
import HowItWorks from '@/components/HowItWorks'
import FAQ from '@/components/FAQ'
import { getLanguageCookie } from '@/lib/cookies'


export default async function Home() {
  const language = await getLanguageCookie();

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <Header />
      <div className="h-16"></div>
      <Hero language={language} />
      <Features />
      <HowItWorks />
      <FAQ />
      <Dashboard/>
      <Footer />
    </div >
  )
}