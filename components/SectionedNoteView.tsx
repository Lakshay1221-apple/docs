"use client";

import { useState, useRef, useEffect } from "react";
import ModuleSidebar from "@/components/ModuleSidebar";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ModuleInfo } from "@/types";

interface SectionedNoteViewProps {
    sections: { id: string, title: string, element: React.ReactNode }[];
    modules: ModuleInfo[];
}

export default function SectionedNoteView({ sections, modules }: SectionedNoteViewProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const contentRef = useRef<HTMLDivElement>(null);
    const lastIndex = useRef(activeIndex);

    const activeSection = sections[activeIndex];

    useGSAP(() => {
        if (!contentRef.current || activeIndex === lastIndex.current) return;

        const isNext = activeIndex > lastIndex.current;
        
        // GSAP Slide Animation
        const tl = gsap.timeline();
        
        tl.to(contentRef.current, {
            x: isNext ? -30 : 30,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
                lastIndex.current = activeIndex;
                window.scrollTo({ top: 0, behavior: "instant" });
            }
        }).fromTo(contentRef.current, 
            { x: isNext ? 30 : -30, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
        );

    }, { dependencies: [activeIndex], scope: contentRef });

    if (sections.length === 0) return null;

    return (
        <div className="flex flex-col w-full">
            <ModuleSidebar 
                modules={modules} 
                activePartId={sections[activeIndex].id} 
                onSelectPart={(id) => {
                    const index = sections.findIndex(s => s.id === id);
                    if (index !== -1) setActiveIndex(index);
                }} 
            />

            <div className="relative overflow-hidden min-h-[500px] mt-12">
                <div ref={contentRef} className="w-full">
                    <article className="prose-docs prose-sectioned">
                        {sections[activeIndex] ? sections[activeIndex].element : (
                            <div className="py-20 text-center text-text-tertiary">
                                No content found for this section.
                            </div>
                        )}
                    </article>
                    
                    {/* Navigation Buttons (Chapter Cards) */}
                    <div className="flex flex-col sm:flex-row items-stretch justify-between gap-4 mt-20 pt-10 border-t border-border-primary/20">
                        {activeIndex > 0 ? (
                            <button
                                onClick={() => setActiveIndex(activeIndex - 1)}
                                className="flex-1 group flex flex-col items-start gap-1 p-6 rounded-2xl bg-bg-secondary/30 border border-border-primary/30 hover:border-accent-primary transition-all duration-300 active:scale-[0.98]"
                            >
                                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-text-tertiary group-hover:text-accent-primary transition-colors">
                                    <svg className="w-3 h-3 group-hover:-translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                                    </svg>
                                    Previous Section
                                </div>
                                <div className="text-sm font-semibold text-text-primary mt-1 truncate w-full text-left">
                                    {sections[activeIndex - 1].title}
                                </div>
                            </button>
                        ) : <div className="flex-1 invisible sm:block" />}

                        {activeIndex < sections.length - 1 ? (
                            <button
                                onClick={() => setActiveIndex(activeIndex + 1)}
                                className="flex-1 group flex flex-col items-end gap-1 p-6 rounded-2xl bg-bg-secondary/30 border border-border-primary/30 hover:border-accent-primary transition-all duration-300 active:scale-[0.98]"
                            >
                                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-text-tertiary group-hover:text-accent-primary transition-colors">
                                    Next Section
                                    <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                        <path d="M5 12h14M12 5l7 7-7 7"/>
                                    </svg>
                                </div>
                                <div className="text-sm font-semibold text-text-primary mt-1 truncate w-full text-right">
                                    {sections[activeIndex + 1].title}
                                </div>
                            </button>
                        ) : <div className="flex-1 invisible sm:block" />}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .prose-sectioned {
                    min-height: 200px;
                }
            `}</style>
        </div>
    );
}


