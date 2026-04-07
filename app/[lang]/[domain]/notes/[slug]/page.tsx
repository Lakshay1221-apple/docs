import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/components/mdx/MDXComponents";
import { getNoteContent } from "@/lib/mdx";
import {
    getDomainBySlug,
    getNotesByDomain,
    getTopicsByDomain,
    getNoteBySlug,
    getAllDomainSlugs,
} from "@/lib/data";
import NotesSidebar from "@/components/NotesSidebar";
import SectionedNoteView from "@/components/SectionedNoteView";
import Breadcrumbs from "@/components/Breadcrumbs";
import GithubEditLink from "@/components/GithubEditLink";
import PageTransition from "@/components/PageTransition";
import type { NoteSidebarItem } from "@/types";

interface PageProps {
    params: Promise<{
        lang: string;
        domain: string;
        slug: string;
    }>;
}

export async function generateStaticParams() {
    const params: { lang: string; domain: string; slug: string }[] = [];
    const domainSlugs = getAllDomainSlugs();

    for (const lang of ["en", "hi"]) {
        domainSlugs.forEach((domainSlug) => {
            const notes = getNotesByDomain(domainSlug, lang as "en" | "hi");
            notes.forEach((note) => {
                params.push({
                    lang,
                    domain: domainSlug,
                    slug: note.slug,
                });
            });
        });
    }

    return params;
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps) {
    const { lang, domain, slug } = await params;
    const note = getNoteBySlug(domain, slug, lang as "en" | "hi");

    if (!note) return { title: "Not Found" };

    return {
        title: `${note.title} | BrokenN Shell Docs`,
        description: note.description,
    };
}

export default async function NotePage({ params }: PageProps) {
    const { lang, domain: domainSlug, slug: noteSlug } = await params;
    const currentLang = lang as "en" | "hi";

    const domainData = getDomainBySlug(domainSlug, currentLang);
    const noteMeta = getNoteBySlug(domainSlug, noteSlug, currentLang);
    const mdxData = await getNoteContent(domainSlug, noteSlug, currentLang);

    if (!domainData || !noteMeta || !mdxData) {
        notFound();
    }

    // Build segments for sectioned view using the content extracted by the utility
    const sections: { id: string, title: string, element: React.ReactNode }[] = [];
    mdxData.modules.forEach((mod) => {
        mod.parts.forEach((part) => {
            sections.push({
                id: part.id,
                title: part.title,
                element: <MDXRemote source={part.content} components={mdxComponents} />
            });
        });
    });

    // If no modules found, just render the whole thing as one section
    if (sections.length === 0) {
        sections.push({
            id: "full-content",
            title: noteMeta.title,
            element: <MDXRemote source={mdxData.content} components={mdxComponents} />
        });
    }

    // Build notes sidebar tree
    const rawNotes = getNotesByDomain(domainSlug, currentLang);
    const topics = getTopicsByDomain(domainSlug, currentLang);
    const sidebarItems: NoteSidebarItem[] = topics.map((topic) => ({
        topic,
        notes: rawNotes
            .filter((n) => n.topicSlug === topic.slug)
            .sort((a, b) => a.order - b.order),
    }));

    return (
        <PageTransition>
            <div className="container-docs min-w-screen">
                <div className="flex flex-col lg:flex-row min-h-screen gap-8">
                    {/* Left Notes Navigation */}
                    <aside className="w-full lg:w-64 shrink-0 py-8 lg:sticky lg:top-24 h-fit">
                         <div className="bg-bg-secondary/40 border border-border-primary/50 rounded-2xl p-6 hidden lg:block">
                            <NotesSidebar domainSlug={domainSlug} items={sidebarItems} />
                         </div>
                         <div className="lg:hidden">
                            <NotesSidebar domainSlug={domainSlug} items={sidebarItems} />
                         </div>
                    </aside>

                    {/* Main Sectioned Content Area */}
                    <main className="flex-1 min-w-0 py-8">
                        <Breadcrumbs domain={domainData} note={noteMeta} lang={currentLang} />
                        
                        <div className="mt-8">
                            <SectionedNoteView 
                                sections={sections}
                                modules={mdxData.modules} 
                            />
                        </div>

                        <div className="mt-12 pt-8 border-t border-border-primary/20">
                            <GithubEditLink domainSlug={domainSlug} noteSlug={noteSlug} lang={currentLang} />
                        </div>
                    </main>
                </div>
            </div>
        </PageTransition>
    );
}


