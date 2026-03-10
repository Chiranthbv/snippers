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

// Demo snippets for showcase (used when API isn't connected)
const demoSnippets: Snippet[] = [
    {
        id: 1,
        title: "Quick Sort Algorithm",
        content: `function quickSort(arr) {\n  if (arr.length <= 1) return arr;\n  const pivot = arr[0];\n  const left = arr.slice(1).filter(x => x < pivot);\n  const right = arr.slice(1).filter(x => x >= pivot);\n  return [...quickSort(left), pivot, ...quickSort(right)];\n}`,
        language: "JavaScript",
        visibility: "PUBLIC",
        shortUrl: "qs1234",
        viewCount: 342,
        expiresAt: null,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        updatedAt: new Date().toISOString(),
        username: "alexdev",
    },
    {
        id: 2,
        title: "Python List Comprehension",
        content: `# Generate squares of even numbers\nsquares = [x**2 for x in range(20) if x % 2 == 0]\nprint(squares)\n\n# Flatten 2D list\nmatrix = [[1,2,3], [4,5,6], [7,8,9]]\nflat = [n for row in matrix for n in row]`,
        language: "Python",
        visibility: "PUBLIC",
        shortUrl: "py5678",
        viewCount: 218,
        expiresAt: null,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
        username: "pythonista",
    },
    {
        id: 3,
        title: "TypeScript Generic Utility",
        content: `type DeepPartial<T> = {\n  [P in keyof T]?: T[P] extends object\n    ? DeepPartial<T[P]>\n    : T[P];\n};\n\ninterface Config {\n  db: { host: string; port: number };\n  cache: { ttl: number };\n}\n\nconst partial: DeepPartial<Config> = {\n  db: { host: "localhost" }\n};`,
        language: "TypeScript",
        visibility: "PUBLIC",
        shortUrl: "ts9012",
        viewCount: 156,
        expiresAt: null,
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date().toISOString(),
        username: "tsmaster",
    },
    {
        id: 4,
        title: "Java Stream API Example",
        content: `List<String> names = people.stream()\n    .filter(p -> p.getAge() > 18)\n    .sorted(Comparator.comparing(Person::getName))\n    .map(Person::getName)\n    .collect(Collectors.toList());\n\nSystem.out.println(names);`,
        language: "Java",
        visibility: "PUBLIC",
        shortUrl: "jv3456",
        viewCount: 289,
        expiresAt: null,
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        updatedAt: new Date().toISOString(),
        username: "javaguru",
    },
    {
        id: 5,
        title: "Go Goroutine Pattern",
        content: `func fetchAll(urls []string) []Result {\n    ch := make(chan Result, len(urls))\n    for _, url := range urls {\n        go func(u string) {\n            resp, err := http.Get(u)\n            ch <- Result{URL: u, Resp: resp, Err: err}\n        }(url)\n    }\n    results := make([]Result, len(urls))\n    for i := range results {\n        results[i] = <-ch\n    }\n    return results\n}`,
        language: "Go",
        visibility: "PUBLIC",
        shortUrl: "go7890",
        viewCount: 174,
        expiresAt: null,
        createdAt: new Date(Date.now() - 345600000).toISOString(),
        updatedAt: new Date().toISOString(),
        username: "gopher",
    },
    {
        id: 6,
        title: "Rust Error Handling",
        content: `use std::fs;\nuse std::io;\n\nfn read_config(path: &str) -> Result<String, io::Error> {\n    let content = fs::read_to_string(path)?;\n    Ok(content.trim().to_string())\n}\n\nfn main() {\n    match read_config("config.toml") {\n        Ok(cfg) => println!("Config: {}", cfg),\n        Err(e) => eprintln!("Error: {}", e),\n    }\n}`,
        language: "Rust",
        visibility: "PUBLIC",
        shortUrl: "rs2345",
        viewCount: 131,
        expiresAt: null,
        createdAt: new Date(Date.now() - 432000000).toISOString(),
        updatedAt: new Date().toISOString(),
        username: "rustacean",
    },
];

export default function BrowsePage() {
    const [snippets, setSnippets] = useState<Snippet[]>(demoSnippets);
    const [search, setSearch] = useState("");
    const [language, setLanguage] = useState("All");
    const [sort, setSort] = useState("newest");
    const [loading, setLoading] = useState(false);

    const fetchSnippets = useCallback(async () => {
        setLoading(true);
        try {
            const { getSnippets } = await import("@/lib/api");
            const data = await getSnippets({
                search: search || undefined,
                language: language !== "All" ? language.toLowerCase() : undefined,
                sort,
            });
            if (data.content && data.content.length > 0) {
                setSnippets(data.content);
            }
        } catch {
            // API not available, keep demo data
        } finally {
            setLoading(false);
        }
    }, [search, language, sort]);

    useEffect(() => {
        fetchSnippets();
    }, [fetchSnippets]);

    const filtered = snippets.filter((s) => {
        const matchLang =
            language === "All" ||
            s.language.toLowerCase() === language.toLowerCase();
        const matchSearch =
            !search ||
            s.title.toLowerCase().includes(search.toLowerCase()) ||
            s.content.toLowerCase().includes(search.toLowerCase());
        return matchLang && matchSearch;
    });

    const sorted = [...filtered].sort((a, b) => {
        if (sort === "popular") return b.viewCount - a.viewCount;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

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
                        <div className="flex flex-wrap gap-2">
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
                    {sorted.length} snippet{sorted.length !== 1 ? "s" : ""} found
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
                ) : sorted.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sorted.map((snippet, i) => (
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
