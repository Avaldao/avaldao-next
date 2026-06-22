import type { Metadata } from 'next'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import DashboardSection from '@/components/dashboard-section'
import Footer from '@/components/Footer'
import Aliados from '@/components/Aliados'
import HowItWorks from '@/components/HowItWorks'
import FAQ from '@/components/FAQ'
import ProjectTimeline from '@/components/ProjectTimeline'
import { getLanguageCookie } from '@/lib/cookies'
import { getAbsoluteUrl, siteConfig } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Inicio',
  description:
    'Accedé a garantias onchain para credito comercial con AvalDAO, una SGR descentralizada para personas y microempresas.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: siteConfig.name,
    description:
      'SGR descentralizada con garantias onchain para ampliar el acceso al financiamiento.',
    url: siteConfig.siteUrl,
  },
}


export default async function Home() {
  const language = await getLanguageCookie();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteConfig.siteUrl}/#organization`,
        name: siteConfig.name,
        url: siteConfig.siteUrl,
        logo: getAbsoluteUrl('/images/avaldao.svg'),
        description: siteConfig.description,
      },
      {
        '@type': 'WebSite',
        '@id': `${siteConfig.siteUrl}/#website`,
        url: siteConfig.siteUrl,
        name: siteConfig.name,
        description: siteConfig.description,
        inLanguage: ['es', 'en'],
        publisher: {
          '@id': `${siteConfig.siteUrl}/#organization`,
        },
      },
    ],
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Skip navigation para accesibilidad */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-lg focus:bg-violet-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
      >
        Saltar al contenido principal
      </a>
      {/* Preload imagen hero above-the-fold */}
      <link rel="preload" as="image" href="/images/slide-bg1.jpg" />
      <Header />
      <div className="h-16"></div>
      <main id="main-content">
        <Hero language={language} />
        <Features />
        <HowItWorks />
        <ProjectTimeline />
        <FAQ />
        <DashboardSection/>
        <Aliados />
      </main>
      <Footer />
    </div >
  )
}