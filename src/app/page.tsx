import type { Metadata } from 'next'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import Dashboard from '@/components/Dashboard'
import Footer from '@/components/Footer'
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
      <Header />
      <div className="h-16"></div>
      <main>
        <Hero language={language} />
        <Features />
        <HowItWorks />
        <ProjectTimeline />
        <FAQ />
        <Dashboard/>
      </main>
      <Footer />
    </div >
  )
}