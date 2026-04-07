import { notFound } from "next/navigation";
import {
    getDomainBySlug,
    getAllDomainSlugs,
    getRoadmapByDomain,
    getNotesByDomain,
    getTopicsByDomain,
} from "@/lib/data";
import DomainHeader from "@/components/DomainHeader";
import DomainTabs from "@/components/DomainTabs";
import PageTransition from "@/components/PageTransition";
import type { NoteSidebarItem } from "@/types";

interface PageProps {
    params: Promise<{
        lang: string;
        domain: string;
    }>;
}

export async function generateStaticParams() {
    const slugs = getAllDomainSlugs();
    const params: { lang: string; domain: string; }[] = [];
    for (const lang of ["en", "hi"]) {
        for (const slug of slugs) {
            params.push({ lang, domain: slug });
        }
    }
    return params;
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps) {
    const { lang, domain: domainSlug } = await params;
    const domainData = getDomainBySlug(domainSlug, lang as "en" | "hi");

    if (!domainData) {
        return {
            title: "Not Found",
        };
    }

    return {
        title: domainData.title,
        description: domainData.description,
    };
}

import { Suspense } from "react";

export default async function DomainHubPage({ params }: PageProps) {
    const { lang, domain: domainSlug } = await params;
    const currentLang = lang as "en" | "hi";
    const domainData = getDomainBySlug(domainSlug, currentLang);

    if (!domainData) {
        notFound();
    }

    const roadmap = getRoadmapByDomain(domainSlug, currentLang);
    const rawNotes = getNotesByDomain(domainSlug, currentLang);
    const topics = getTopicsByDomain(domainSlug, currentLang);

    // Group notes into tree structure for the sidebar
    const notesTree: NoteSidebarItem[] = topics.map((topic) => ({
        topic,
        notes: rawNotes
            .filter((n) => n.topicSlug === topic.slug)
            .sort((a, b) => a.order - b.order),
    }));

    return (
        <PageTransition>
            <DomainHeader domain={domainData} />
            <Suspense fallback={<div className="container-docs py-24 text-center">Loading Content...</div>}>
                <DomainTabs domainSlug={domainData.slug} roadmap={roadmap} notes={notesTree} />
            </Suspense>
        </PageTransition>
    );
}
