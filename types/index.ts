import type { ReactNode } from "react";

export type Lang = "en" | "hi";

export interface TranslatableString {
  en: string;
  hi: string;
}

export interface Domain {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: ReactNode;
  color: string;
  tagColor: string;
  roadmapCount: number;
  noteCount: number;
}

export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  topics: string[];
  resources: RoadmapResource[];
  status: "beginner" | "intermediate" | "advanced";
}

export interface RoadmapResource {
  title: string;
  url: string;
  type: "article" | "video" | "course" | "docs";
}

export interface Roadmap {
  id: string;
  domainSlug: string;
  title: string;
  description: string;
  steps: RoadmapStep[];
}

export interface NoteTopic {
  id: string;
  title: string;
  slug: string;
  children?: NoteTopic[];
}

export interface NoteMetadata {
  title: string;
  description: string;
  slug: string;
  domainSlug: string;
  topicSlug: string;
  lastUpdated: string;
  author: string;
  tags: string[];
  order: number;
}

export interface NoteSidebarItem {
  topic: NoteTopic;
  notes: NoteMetadata[];
}

export interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
}

export interface SearchResult {
  type: "domain" | "roadmap" | "note";
  title: string;
  description: string;
  slug: string;
  domainSlug: string;
  domainTitle: string;
}

export interface ModulePart {
  id: string;
  title: string;
  content: string;
}

export interface ModuleInfo {
  id: string;
  title: string;
  parts: ModulePart[];
}
