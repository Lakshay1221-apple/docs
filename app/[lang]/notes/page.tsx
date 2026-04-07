import DomainGrid from "@/components/DomainGrid";
import PageTransition from "@/components/PageTransition";
import { getDomains } from "@/lib/data";

interface PageProps {
  params: Promise<{
    lang: string;
  }>;
}

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "hi" }];
}

export default async function NotesOverviewPage({ params }: PageProps) {
  const { lang } = await params;
  const currentLang = lang as "en" | "hi";
  const localizedDomains = getDomains(currentLang);

  return (
    <PageTransition>
      <div className="pt-24 min-h-screen">
          <DomainGrid 
            domains={localizedDomains} 
            title="Knowledge Library"
            description="Access in-depth technical documentation and module-based notes across various domains. Choose a domain to start reading."
            type="notes"
          />
      </div>
    </PageTransition>
  );
}
