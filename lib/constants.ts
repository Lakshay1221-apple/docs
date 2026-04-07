export const SITE_CONFIG = {
    name: "BrokenN Shell Docs",
    description:
        "Open-source educational platform with markdown-based roadmaps and developer notes.",
    url: "https://docs.brokennshell.com",
    github: "https://github.com/brokennshell/docs",
    githubOrg: "https://github.com/brokennshell",
    author: "BrokenN Shell",
} as const;

export const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "Domains", href: "/domains" },
    { label: "Notes", href: "/notes" },
    { label: "Cheatsheet", href: "/cheatsheet" },
    { label: "Projects", href: "/projects" },
    { label: "GitHub", href: SITE_CONFIG.githubOrg, external: true },
] as const;

export const DOMAIN_COLORS: Record<string, string> = {
    "full-stack": "var(--color-tag-fullstack)",
    "ai-ml": "var(--color-tag-aiml)",
    "app-dev": "var(--color-tag-appdev)",
    "cyber-security": "var(--color-tag-cybersec)",
    "gen-ai": "var(--color-tag-genai)",
    devops: "var(--color-tag-devops)",
};

export const GITHUB_CONTENT_BASE =
    "https://github.com/brokennshell/docs/edit/main/content";
