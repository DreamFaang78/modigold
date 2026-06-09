import HomeView from '@/components/HomeView';
import SitePopup from '@/components/SitePopup';
import { getContent, getHomepageSection, getHomepageCards, getFooterContent, getActivePopup } from '@/lib/content/store';
import { getCategories, getProducts } from '@/lib/catalog/store';

// Always render with the latest admin-edited content.
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [
    content,
    categories,
    featuredProducts,
    advantageSection,
    orderingSection,
    orderingCards,
    footerContent,
    aboutSection,
    activePopup,
  ] = await Promise.all([
    getContent(),
    getCategories(),
    getProducts({ featured: true }),
    getHomepageSection('modigold_advantage'),
    getHomepageSection('flexible_ordering'),
    getHomepageCards('flexible_ordering'),
    getFooterContent(),
    getHomepageSection('about_main'),
    getActivePopup(),
  ]);

  return (
    <>
      <HomeView
        content={content}
        categories={categories}
        featuredProducts={featuredProducts}
        advantageSection={advantageSection}
        orderingSection={orderingSection}
        orderingCards={orderingCards}
        footerContent={footerContent}
        aboutSection={aboutSection}
      />
      <SitePopup popup={activePopup} />
    </>
  );
}
