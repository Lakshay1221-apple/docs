export function cn(...classes: (string | boolean | undefined | null)[]): string {
    return classes.filter(Boolean).join(" ");
}

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
}

export function formatDate(dateString: string): string {
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(new Date(dateString));
}

export function capitalize(text: string): string {
    return text
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

export function getReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
}

export function extractHeadings(
    content: string
): { id: string; title: string; level: number }[] {
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    const headings: { id: string; title: string; level: number }[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
        headings.push({
            id: slugify(match[2]),
            title: match[2],
            level: match[1].length,
        });
    }

    return headings;
}

export function extractModules(
    content: string
): { id: string; title: string; parts: { id: string; title: string; content: string }[] }[] {
    const modules: { id: string; title: string; parts: { id: string; title: string; content: string }[] }[] = [];

    // 1. Try to extract modules using the special <div className="module-container"> structure
    const moduleRegex = /<div\s+className="module-container">[\s\S]*?<details\s+className="major-dropdown"[^>]*>\s*<summary><strong>(.+?)<\/strong><\/summary>/g;
    let moduleMatch;
    let moduleIndex = 0;

    while ((moduleMatch = moduleRegex.exec(content)) !== null) {
        const moduleTitle = moduleMatch[1];
        const moduleId = `module-${moduleIndex}`;
        const moduleStart = moduleMatch.index;
        const nextModuleStart = content.indexOf('<div className="module-container">', moduleStart + 1);
        const moduleContent = nextModuleStart !== -1
            ? content.substring(moduleStart, nextModuleStart)
            : content.substring(moduleStart);

        const partRegex = /<details\s+className="sub-dropdown"[^>]*>\s*<summary>(.+?)<\/summary>([\s\S]*?)<\/details>/g;
        const parts: { id: string; title: string; content: string }[] = [];
        let partMatch;
        let partIndex = 0;

        while ((partMatch = partRegex.exec(moduleContent)) !== null) {
            parts.push({
                id: `${moduleId}-part-${partIndex}`,
                title: partMatch[1],
                content: partMatch[2].trim(),
            });
            partIndex++;
        }

        if (parts.length > 0) {
            modules.push({ id: moduleId, title: moduleTitle, parts });
            moduleIndex++;
        }
    }

    // 2. Fallback: If no module-containers found, use H2 and H3 structure
    if (modules.length === 0) {
        const h2Regex = /^##\s+(.+)$/gm;
        let h2Match;
        let h2Index = 0;

        while ((h2Match = h2Regex.exec(content)) !== null) {
            const h2Title = h2Match[1];
            const moduleId = `h2-${h2Index}`;
            const h2Start = h2Match.index;
            // Find next H2 start
            const nextH2Start = content.indexOf('## ', h2Start + 1);
            const h2Content = nextH2Start !== -1 ? content.substring(h2Start, nextH2Start) : content.substring(h2Start);

            // Find H3 sections within this H2
            const h3Regex = /^###\s+(.+)$/gm;
            const parts: { id: string; title: string; content: string }[] = [];
            let h3Match;
            let h3Index = 0;

            const contentToSearchParts = h2Content.slice(h2Match[0].length); // Skip the H2 header itself

            while ((h3Match = h3Regex.exec(contentToSearchParts)) !== null) {
                const h3Title = h3Match[1];
                const h3Start = h3Match.index;
                const nextH3Start = contentToSearchParts.indexOf('### ', h3Start + 1);
                const partContent = nextH3Start !== -1 
                    ? contentToSearchParts.substring(h3Start, nextH3Start) 
                    : contentToSearchParts.substring(h3Start);
                
                parts.push({
                    id: `${moduleId}-h3-${h3Index}`,
                    title: h3Title,
                    content: partContent.trim(),
                });
                h3Index++;
            }

            // If no H3s, use the whole H2 as one part
            if (parts.length === 0) {
                parts.push({
                    id: `${moduleId}-main`,
                    title: h2Title,
                    content: h2Content.trim(),
                });
            }

            modules.push({ id: moduleId, title: h2Title, parts });
            h2Index++;
        }
    }

    // 3. Last Fallback: If still no modules, create one for the entire file
    if (modules.length === 0) {
        modules.push({
            id: "full-content",
            title: "Overview",
            parts: [{
                id: "overview-part",
                title: "Introduction",
                content: content.trim()
            }]
        });
    }

    return modules;
}


