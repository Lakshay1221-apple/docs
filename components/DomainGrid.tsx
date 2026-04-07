"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import DomainCard from "@/components/DomainCard";
import type { Domain } from "@/types";

interface DomainGridProps {
    domains: Domain[];
    title?: string;
    description?: string;
    type?: "domains" | "notes";
}

export default function DomainGrid({ 
    domains, 
    title = "Explore Domains", 
    description = "Choose a learning path and start building. Each domain includes structured roadmaps and in-depth notes.",
    type = "domains"
}: DomainGridProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const headingRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.fromTo(
            headingRef.current,
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                },
            }
        );
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} id="domains" className="py-24">
            <div className="container-docs">
                <div ref={headingRef} className="mb-12 opacity-0">
                    <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-3">
                        {title}
                    </h2>
                    <p className="text-text-secondary max-w-lg">
                        {description}
                    </p>
                </div>

                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 list-none p-0">
                    {domains.map((domain, index) => (
                        <li key={domain.id}>
                            <DomainCard domain={domain} index={index} type={type} />
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
