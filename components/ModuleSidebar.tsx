"use client";

import type { ModuleInfo } from "@/types";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

interface ModuleSidebarProps {
    modules: ModuleInfo[];
    activePartId: string;
    onSelectPart: (id: string) => void;
}

export default function ModuleSidebar({ modules, activePartId, onSelectPart }: ModuleSidebarProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const moduleIndicatorRef = useRef<HTMLDivElement>(null);

    // Find current module index
    const activeModuleIndex = modules.findIndex(m => m.parts.some(p => p.id === activePartId));
    const activeModule = modules[activeModuleIndex] || modules[0];

    useGSAP(() => {
        if (!containerRef.current || !moduleIndicatorRef.current) return;

        // Animate module indicator (the underline/pill for the active module)
        const activeModuleBtn = containerRef.current.querySelector(`.module-btn-${activeModuleIndex}`) as HTMLElement;
        if (activeModuleBtn) {
            gsap.to(moduleIndicatorRef.current, {
                x: activeModuleBtn.offsetLeft,
                width: activeModuleBtn.offsetWidth,
                duration: 0.6,
                ease: "expo.out"
            });
        }

        // Entrance animation
        gsap.fromTo(
            containerRef.current.querySelectorAll(".anim-in"),
            { opacity: 0, y: 5 },
            { opacity: 1, y: 0, stagger: 0.05, duration: 0.4, ease: "power2.out" }
        );
    }, { dependencies: [activeModuleIndex], scope: containerRef });

    if (modules.length === 0) return null;

    return (
        <div ref={containerRef} className="w-full bg-bg-primary/40 backdrop-blur-xl border-y border-border-primary/30 sticky top-[64px] z-30 transition-all duration-300">
            {/* Modules Navigation */}
            <div className="relative flex items-center gap-1 py-0 border-b border-border-primary/10 overflow-x-auto no-scrollbar">
                {/* Active Indicator Background */}
                <div 
                    ref={moduleIndicatorRef} 
                    className="absolute bottom-0 h-0.5 bg-accent-primary shadow-[0_0_10px_rgba(var(--accent-rgb),0.5)] z-10" 
                />
                
                {modules.map((mod, idx) => (
                    <button
                        key={mod.id}
                        onClick={() => onSelectPart(mod.parts[0]?.id || mod.id)}
                        className={`module-btn-${idx} anim-in relative px-5 ${idx === 0 ? "pl-0" : ""} py-2.5 text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] whitespace-nowrap transition-colors duration-300 ${
                            activeModule.id === mod.id ? "text-accent-primary" : "text-text-tertiary hover:text-text-secondary"
                        }`}
                    >
                        {mod.title}
                    </button>
                ))}
            </div>

            {/* Parts Navigation (Sub-steps) */}
            <div className="flex items-center gap-2 py-4 overflow-x-auto no-scrollbar scroll-smooth">
                {activeModule.parts.map((part, idx) => {
                    const isActive = activePartId === part.id;
                    return (
                        <button
                            key={part.id}
                            onClick={() => onSelectPart(part.id)}
                            className={`anim-in px-4 py-2 text-xs font-medium rounded-xl border transition-all duration-500 whitespace-nowrap ${idx === 0 && !isActive ? "" : ""} ${
                                isActive
                                    ? "bg-accent-primary text-white border-accent-primary shadow-[0_8px_20px_-6px_rgba(var(--accent-rgb),0.4)] scale-[1.02]"
                                    : "bg-bg-tertiary/20 text-text-tertiary border-border-primary/30 hover:border-border-primary/80 hover:text-text-secondary"
                            }`}
                        >
                            {part.title}
                        </button>
                    );
                })}
            </div>

            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}


