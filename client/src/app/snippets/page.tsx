"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import SnippetCard from "@/components/SnippetCard";
import type { Snippet } from "@/lib/api";

const LANGUAGES = [
    "All",
    "JavaScript",
    "TypeScript",
    "Python",
    "Java",
    "Go",
    "Rust",
    "C++",
    "HTML",
    "CSS",
    "Other",
];

const SORT_OPTIONS = [
    { value: "newest", label: "Newest" },
    { value: "popular", label: "Most Viewed" },
];

export default function BrowsePage() {
    const [snippets, setSnippets] = useState<Snippet[]>([]);
    const [search, setSearch] = useState("");
    const [language, setLanguage] = useState("All");
    const [sort, setSort] = useState("newest");
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchSnippets = useCallback(async () => {
        setLoading(true);
        try {
            const { getSnippets } = await import("@/lib/api");
            const data = await getSnippets({
                search: search || undefined,
                language: language !== "All" ? language.toLowerCase() : undefined,
                sort,
                page,
                size: 12,
            });
            setSnippets(data.content || []);
            setTotalPages(data.totalPages || 0);
        } catch {
            console.error("Failed to fetch snippets");
            setSnippets([]);
        } finally {
            setLoading(false);
        }
    }, [search, language, sort, page]);

    useEffect(() => {
        fetchSnippets();
    }, [fetchSnippets]);

    // Reset page when filters change
    useEffect(() => {
        setPage(0);
    }, [search, language, sort]);

    return (
        <div className="min-h-screen relative">
            <div className="gradient-orb gradient-orb-blue w-[300px] h-[300px] -top-20 right-10 opacity-20" />

            <div className="max-w-container mx-auto px-6 py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mb-10"
                >
                    <h1 className="font-heading font-bold text-3xl sm:text-4xl mb-3">
                        Browse <span className="gradient-text">Snippets</span>
                    </h1>
                    <p className="text-txt-muted text-lg">
                        Explore public code snippets shared by the community.
                    </p>
                </motion.div>

                {/* Search & Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="mb-8 space-y-4"
                >
                    {/* Search Bar */}
                    <div className="relative max-w-xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-txt-muted/50" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search snippets by title or code..."
                            className="input-dark pl-12 py-3.5"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        {/* Language Tabs */}
                        <div className="language-tabs flex-1">
                            {LANGUAGES.map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => setLanguage(lang)}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${language === lang
                                            ? "bg-accent-blue/20 text-accent-blue border border-accent-blue/30"
                                            : "bg-white/[0.03] text-txt-muted border border-white/[0.06] hover:bg-white/[0.06]"
                                        }`}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>

                        {/* Sort Dropdown */}
                        <div className="flex items-center gap-2 ml-auto">
                            <SlidersHorizontal className="w-4 h-4 text-txt-muted" />
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                className="bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-1.5 text-sm text-txt-primary outline-none focus:border-accent-blue cursor-pointer"
                            >
                                {SORT_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value} className="bg-secondary">
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </motion.div>

                {/* Results Count */}
                <p className="text-txt-muted text-sm mb-6">
                    {snippets.length} snippet{snippets.length !== 1 ? "s" : ""} found
                </p>

                {/* Snippets Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="glass-card-static p-4 space-y-3">
                                <div className="skeleton h-5 w-16" />
                                <div className="skeleton h-6 w-3/4" />
                                <div className="skeleton h-24 w-full" />
                                <div className="flex gap-2">
                                    <div className="skeleton h-4 w-20" />
                                    <div className="skeleton h-4 w-16" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : snippets.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {snippets.map((snippet, i) => (
                                <SnippetCard
                                    key={snippet.id}
                                    title={snippet.title}
                                    language={snippet.language}
                                    content={snippet.content}
                                    shortUrl={snippet.shortUrl}
                                    username={snippet.username}
                                    viewCount={snippet.viewCount}
                                    createdAt={snippet.createdAt}
                                    index={i}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-10">
                                <button
                                    onClick={() => setPage(p => Math.max(0, p - 1))}
                                    disabled={page === 0}
                                    className="btn-secondary px-4 py-2 text-sm disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <span className="text-txt-muted text-sm px-4">
                                    Page {page + 1} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                    disabled={page >= totalPages - 1}
                                    className="btn-secondary px-4 py-2 text-sm disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-txt-muted text-lg">No snippets found</p>
                        <p className="text-txt-muted/50 text-sm mt-2">
                            Try adjusting your search or filter criteria
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
