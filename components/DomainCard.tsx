"use client";

import { useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { Domain } from "@/types";

interface DomainCardProps {
    domain: Domain;
    index: number;
    type?: "domains" | "notes";
}

export default function DomainCard({ domain, index, type = "domains" }: DomainCardProps) {
    const cardRef = useRef<HTMLAnchorElement>(null);
    const params = useParams();
    const currentLang = (params?.lang as string) === "hi" ? "hi" : "en";

    useGSAP(() => {
        gsap.fromTo(
            cardRef.current,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                delay: index * 0.1,
                ease: "power3.out",
            }
        );
    }, { scope: cardRef, dependencies: [index] });

    return (
        <Link
            ref={cardRef}
            href={`/${currentLang}/${domain.slug}${type === "notes" ? "?tab=notes" : ""}`}
            className="card group p-6 flex flex-col gap-5 opacity-0 hover:bg-bg-tertiary/40 transition-all duration-500 relative overflow-hidden isolate"
        >
            {/* Subtle glow behind the card on hover */}
            <div
                className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none -z-10"
                style={{ backgroundColor: domain.tagColor }}
            />

            <div className="flex items-start justify-between relative z-10">
                <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-sm relative overflow-hidden"
                    style={{
                        backgroundColor: `color-mix(in srgb, ${domain.tagColor} 10%, transparent)`,
                        border: `1px solid color-mix(in srgb, ${domain.tagColor} 25%, transparent)`,
                        color: domain.tagColor,
                    }}
                >
                    {/* Inner glow on the icon box */}
                    <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-md mix-blend-screen"
                        style={{ backgroundColor: domain.tagColor }}
                    />
                    <div className="relative z-10 flex items-center justify-center drop-shadow-sm">
                        {domain.icon}
                    </div>
                </div>

                {/* Custom arrow icon */}
                <div className="w-8 h-8 rounded-full bg-bg-primary/50 border border-border-secondary flex items-center justify-center group-hover:bg-bg-tertiary group-hover:border-border-primary transition-all duration-300 transform group-hover:-translate-y-1 group-hover:translate-x-1 shadow-sm">
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-text-tertiary group-hover:text-text-primary transition-colors duration-300"
                    >
                        <line x1="7" y1="17" x2="17" y2="7" />
                        <polyline points="7 7 17 7 17 17" />
                    </svg>
                </div>
            </div>

            <div className="relative z-10 mt-1">
                <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:text-accent-tertiary transition-colors">
                    {domain.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">
                    {domain.description}
                </p>
            </div>

            <div className="flex items-center gap-3 mt-auto pt-4 border-t border-border-secondary/30 relative z-10">
                <span className="text-xs font-medium text-text-tertiary">
                    {domain.roadmapCount} roadmap{domain.roadmapCount !== 1 ? "s" : ""}
                </span>
                <span className="w-1 h-1 rounded-full bg-border-primary" />
                <span className="text-xs font-medium text-text-tertiary">
                    {domain.noteCount} note{domain.noteCount !== 1 ? "s" : ""}
                </span>
            </div>
        </Link>
    );
}
