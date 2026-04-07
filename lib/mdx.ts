import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getReadingTime, extractHeadings, extractModules } from "./utils";

const contentDirectory = path.join(process.cwd(), "content");

export interface MDXNote {
    content: string;
    frontmatter: Record<string, string>;
    readingTime: number;
    headings: { id: string; title: string; level: number }[];
    modules: { id: string; title: string; parts: { id: string; title: string; content: string }[] }[];
}


export async function getNoteContent(
    domainSlug: string,
    noteSlug: string,
    lang: string = "en"
): Promise<MDXNote | null> {
    const langFolder = lang === "hi" ? "hinglish" : "english";
    const fullPath = path.join(contentDirectory, langFolder, domainSlug, `${noteSlug}.mdx`);

    if (!fs.existsSync(fullPath)) {
        return null;
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
        content,
        frontmatter: data,
        readingTime: getReadingTime(content),
        headings: extractHeadings(content),
        modules: extractModules(content),
    };
}
