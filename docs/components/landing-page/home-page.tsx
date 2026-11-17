import type { Metadata } from 'next';
import { HeroSection } from '@/components/landing-page/hero-section';
import { FeaturesSection } from '@/components/landing-page/features-section';
import { APIReferencePreview } from '@/components/api-reference/preview';
import { InstallSection } from '@/components/landing-page/install-section';
import { UsageSection } from '@/components/landing-page/usage-section';
import { Heading } from '@/components/ui/heading';
import { getDictionary } from '@/lib/dictionaries';
import { DEFAULT_LOCALE, LOCALE_PATHS, type Locale } from '@/constants/i18n';
import { SITE_OPEN_GRAPH, SITE_TITLE, SITE_URL } from '@/constants/site';

export async function homeMetadata(locale: Locale): Promise<Metadata> {
  const dict = await getDictionary(locale);

  return {
    title: SITE_TITLE,
    description: dict.top.description,
    openGraph: {
      ...SITE_OPEN_GRAPH,
      title: SITE_TITLE,
      description: dict.top.description
    }
  };
}

export async function HomePage({ locale }: { locale: Locale }) {
  const dict = await getDictionary(locale);

  return (
    <div className='container mx-auto px-4 py-12'>
      {/* Next's metadata resolver removes the slash from the origin URL. */}
      <link
        rel='canonical'
        href={new URL(LOCALE_PATHS[locale], SITE_URL).href}
      />
      <link
        rel='alternate'
        hrefLang='en'
        href={new URL(LOCALE_PATHS.en, SITE_URL).href}
      />
      <link
        rel='alternate'
        hrefLang='nl'
        href={new URL(LOCALE_PATHS.nl, SITE_URL).href}
      />
      <link
        rel='alternate'
        hrefLang='x-default'
        href={new URL(LOCALE_PATHS[DEFAULT_LOCALE], SITE_URL).href}
      />
      <meta
        property='og:url'
        content={new URL(LOCALE_PATHS[locale], SITE_URL).href}
      />
      <HeroSection
        primary={dict.top.hero.primary}
        secondary={dict.top.hero.secondary}
      />

      <section
        id='installation'
        aria-labelledby='installation-title'
        className='mb-16'
      >
        <Heading id='installation-title' variant='h2' className='mb-6'>
          {dict.top.installation.title}
        </Heading>

        <InstallSection tablistLabelledBy='installation-title' />
      </section>

      <section id='usage' aria-labelledby='usage-title' className='mb-16'>
        <Heading id='usage-title' variant='h2' className='mb-6'>
          {dict.top.usage.title}
        </Heading>
        <UsageSection tablistLabelledBy='usage-title' />
      </section>

      <FeaturesSection
        title={dict.top.features.title}
        items={[
          {
            id: 'feature-existing-types',
            title: dict.top.features.existingTypes.title,
            description: dict.top.features.existingTypes.description
          },
          {
            id: 'feature-property-refinement',
            title: dict.top.features.propertyRefinement.title,
            description: dict.top.features.propertyRefinement.description
          },
          {
            id: 'feature-exhaustive-unions',
            title: dict.top.features.exhaustiveUnions.title,
            description: dict.top.features.exhaustiveUnions.description
          },
          {
            id: 'feature-unknown-input-boundaries',
            title: dict.top.features.unknownInputBoundaries.title,
            description: dict.top.features.unknownInputBoundaries.description
          },
          {
            id: 'feature-zero-dependency-composition',
            title: dict.top.features.zeroDependencyComposition.title,
            description: dict.top.features.zeroDependencyComposition.description
          }
        ]}
        variant='tabs'
        autoAdvanceMs={0}
      />

      <APIReferencePreview
        title={dict.top.api.title}
        fullReferenceLinkText={dict.top.api.fullReferenceLinkText}
      />
    </div>
  );
}
