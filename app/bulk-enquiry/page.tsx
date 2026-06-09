import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import BulkEnquiryView from '@/components/BulkEnquiryView';
import { getContent, getFooterContent, getBulkEnquiryPageContent } from '@/lib/content/store';

export const dynamic = 'force-dynamic';

export default async function BulkEnquiryPage() {
  const [content, footerContent, bulkContent] = await Promise.all([
    getContent(),
    getFooterContent(),
    getBulkEnquiryPageContent(),
  ]);

  return (
    <>
      <Header brand={content.brand} />
      <main>
        <BulkEnquiryView content={bulkContent} />
      </main>
      <Footer brand={content.brand} footerContent={footerContent} />
      <FloatingButtons />
    </>
  );
}
