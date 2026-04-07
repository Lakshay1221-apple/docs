"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import RoadmapTimeline from "@/components/RoadmapTimeline";
import type { Roadmap, NoteSidebarItem } from "@/types";

interface DomainTabsProps {
    domainSlug: string;
    roadmap?: Roadmap;
    notes: NoteSidebarItem[];
}

export default function DomainTabs({ domainSlug, roadmap, notes }: DomainTabsProps) {
    const searchParams = useSearchParams();
    const isNotesOnly = searchParams.get("tab") === "notes";
    const [activeTab, setActiveTab] = useState<"roadmaps" | "notes">(isNotesOnly ? "notes" : "roadmaps");
    const indicatorRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const params = useParams();
    const currentLang = (params?.lang as string) === "hi" ? "hi" : "en";

    // Animate the active tab indicator
    useGSAP(() => {
        if (indicatorRef.current) {
            gsap.to(indicatorRef.current, {
                x: activeTab === "roadmaps" ? 0 : "100%",
                duration: 0.3,
                ease: "power2.out",
            });
        }
    }, { dependencies: [activeTab] });

    // Handle content fade out/in when switching tabs
    const handleTabChange = (tab: "roadmaps" | "notes") => {
        if (tab === activeTab) return;

        if (containerRef.current) {
            gsap.to(containerRef.current, {
                opacity: 0,
                y: 10,
                duration: 0.2,
                onComplete: () => {
                    setActiveTab(tab);
                    gsap.to(containerRef.current, {
                        opacity: 1,
                        y: 0,
                        duration: 0.3,
                        ease: "power2.out",
                    });
                },
            });
        } else {
            setActiveTab(tab);
        }
    };

    return (
        <div className="container-docs pb-24">
            {/* Tab switchers - Hidden if in notes-only mode */}
            {!isNotesOnly ? (
                <div className="flex justify-center mb-12">
                    <div className="relative inline-flex p-1 bg-bg-secondary rounded-xl border border-border-secondary">
                        {/* Animated background indicator */}
                        <div
                            ref={indicatorRef}
                            className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-bg-tertiary border border-border-primary rounded-lg shadow-sm"
                        />

                        <button
                            onClick={() => handleTabChange("roadmaps")}
                            className={`relative z-10 px-8 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${activeTab === "roadmaps" ? "text-text-primary" : "text-text-tertiary hover:text-text-secondary"
                                }`}
                        >
                            Roadmaps
                        </button>

                        <button
                            onClick={() => handleTabChange("notes")}
                            className={`relative z-10 px-8 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${activeTab === "notes" ? "text-text-primary" : "text-text-tertiary hover:text-text-secondary"
                                }`}
                        >
                            Notes
                        </button>
                    </div>
                </div>
            ) : (
                <div className="mb-12 border-b border-border-primary/10 pb-8 text-center">
                    <h2 className="text-2xl font-bold text-text-primary">Technical Documentation</h2>
                    <p className="text-text-secondary mt-2">In-depth modules and notes for this domain.</p>
                </div>
            )}

            <div ref={containerRef} className="min-h-[400px]">
                {activeTab === "roadmaps" ? (
                    <div className="text-center text-text-tertiary">
                        {roadmap ? (
                            <RoadmapTimeline roadmap={roadmap} />
                        ) : (
                            <p className="mt-12 text-center text-text-tertiary">No roadmaps available.</p>
                        )}
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto space-y-12">
                        {notes.length > 0 ? (
                            notes.map((group) => (
                                <div key={group.topic.id} className="text-left">
                                    <h3 className="text-xl font-bold text-text-primary mb-4 border-b border-border-secondary pb-2">
                                        {group.topic.title}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {group.notes.map((note) => (
                                            <Link
                                                key={note.slug}
                                                href={`/${currentLang}/${domainSlug}/notes/${note.slug}`}
                                                className="card p-5 group hover:-translate-y-1 transition-transform"
                                            >
                                                <h4 className="font-semibold text-text-primary group-hover:text-accent-primary transition-colors mb-2">
                                                    {note.title}
                                                </h4>
                                                <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">
                                                    {note.description}
                                                </p>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="mt-12 text-center text-text-tertiary">No notes available.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
