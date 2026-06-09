import { isAuthed } from '@/lib/auth';
import { getContent, getHomepageSection, getHomepageCards, getFooterContent, getPopups, getContactPageContent, getBulkEnquiryPageContent } from '@/lib/content/store';
import { getCategories, getProducts } from '@/lib/catalog/store';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminApp from '@/components/admin/AdminApp';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  if (!(await isAuthed())) {
    return <AdminLogin />;
  }

  const [
    content,
    products,
    categories,
    advantageSection,
    orderingSection,
    orderingCards,
    footerContent,
    aboutSection,
    popups,
    contactContent,
    bulkEnquiryContent,
  ] = await Promise.all([
    getContent(),
    getProducts(),
    getCategories(),
    getHomepageSection('modigold_advantage'),
    getHomepageSection('flexible_ordering'),
    getHomepageCards('flexible_ordering'),
    getFooterContent(),
    getHomepageSection('about_main'),
    getPopups(),
    getContactPageContent(),
    getBulkEnquiryPageContent(),
  ]);

  return (
    <AdminApp
      initialContent={content}
      initialProducts={products}
      initialCategories={categories}
      initialAdvantageSection={advantageSection}
      initialOrderingSection={orderingSection}
      initialOrderingCards={orderingCards}
      initialFooterContent={footerContent}
      initialAboutSection={aboutSection}
      initialPopups={popups}
      initialContactContent={contactContent}
      initialBulkEnquiryContent={bulkEnquiryContent}
    />
  );
}
