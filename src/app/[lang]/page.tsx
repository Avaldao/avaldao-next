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
import Audiences from '@/components/Audiences'
import FinalCTA from '@/components/FinalCTA'
import { getAbsoluteUrl, getLanguageAlternates, openGraphLocales, siteConfig } from '@/lib/seo'
import { translations } from '@/translations'
import { Language, languages } from '@/translations/locales'

type PageProps = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const language = (await params).lang as Language
  const t = (key: string) => translations[key]?.[language] ?? key
  const title = t('meta.home.title')

  return {
    title: {
      absolute: title,
    },
    description: t('meta.home.description'),
    alternates: getLanguageAlternates('/', language),
    openGraph: {
      type: 'website',
      siteName: siteConfig.name,
      locale: openGraphLocales[language],
      alternateLocale: languages.filter((l) => l !== language).map((l) => openGraphLocales[l]),
      title,
      description: t('meta.home.og-description'),
      url: getAbsoluteUrl(`/${language}`),
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  }
}


export default async function Home({ params }: PageProps) {
  const language = (await params).lang as Language
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
        {translations['a11y.skip-to-content'][language]}
      </a>
      {/* Preload imagen hero above-the-fold */}
      <link rel="preload" as="image" href="/images/slide-bg1.jpg" />
      <Header />
      <div className="h-16"></div>
      <main id="main-content">
        <Hero language={language} />
        <Aliados />
        <Features />
        <HowItWorks />
        <DashboardSection />
        <Audiences />
        <ProjectTimeline />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div >
  )
}