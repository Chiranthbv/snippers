"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Code2, ChevronDown, Loader2 } from "lucide-react";
import { createSnippet } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import toast from "react-hot-toast";

const LANGUAGES = [
    "JavaScript",
    "TypeScript",
    "Python",
    "Java",
    "Go",
    "Rust",
    "C++",
    "HTML",
    "CSS",
    "SQL",
    "Bash",
    "JSON",
    "Other",
];

export default function CreateSnippetPage() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [language, setLanguage] = useState("JavaScript");
    const [content, setContent] = useState("");
    const [visibility, setVisibility] = useState<"PUBLIC" | "PRIVATE">("PUBLIC");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isAuthenticated()) {
            toast.error("Please log in to create snippets");
            router.push("/auth/login");
        }
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim()) {
            toast.error("Code content is required");
            return;
        }

        setLoading(true);
        try {
            const snippet = await createSnippet({
                title,
                language: language.toLowerCase(),
                content,
                visibility,
            });
            toast.success("Snippet created!");
            router.push(`/s/${snippet.shortUrl}`);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Failed to create snippet";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative">
            <div className="gradient-orb gradient-orb-purple w-[300px] h-[300px] top-10 -right-20 opacity-20" />

            <div className="max-w-3xl mx-auto px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center">
                            <Code2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="font-heading font-bold text-2xl">
                                Create Snippet
                            </h1>
                            <p className="text-txt-muted text-sm">
                                Share your code with a short URL
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="glass-card-static p-6 space-y-5">
                            {/* Title */}
                            <div>
                                <label className="text-sm text-txt-muted mb-1.5 block font-medium">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="input-dark"
                                    placeholder="e.g. Quick Sort Algorithm"
                                    required
                                    maxLength={100}
                                />
                            </div>

                            {/* Language & Visibility Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Language */}
                                <div>
                                    <label className="text-sm text-txt-muted mb-1.5 block font-medium">
                                        Language
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={language}
                                            onChange={(e) => setLanguage(e.target.value)}
                                            className="input-dark appearance-none cursor-pointer pr-10"
                                        >
                                            {LANGUAGES.map((lang) => (
                                                <option
                                                    key={lang}
                                                    value={lang}
                                                    className="bg-secondary"
                                                >
                                                    {lang}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-txt-muted pointer-events-none" />
                                    </div>
                                </div>

                                {/* Visibility */}
                                <div>
                                    <label className="text-sm text-txt-muted mb-1.5 block font-medium">
                                        Visibility
                                    </label>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setVisibility("PUBLIC")}
                                            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all border ${visibility === "PUBLIC"
                                                    ? "bg-accent-blue/15 border-accent-blue/30 text-accent-blue"
                                                    : "bg-white/[0.03] border-white/[0.08] text-txt-muted hover:bg-white/[0.05]"
                                                }`}
                                        >
                                            🌍 Public
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setVisibility("PRIVATE")}
                                            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all border ${visibility === "PRIVATE"
                                                    ? "bg-accent-purple/15 border-accent-purple/30 text-accent-purple"
                                                    : "bg-white/[0.03] border-white/[0.08] text-txt-muted hover:bg-white/[0.05]"
                                                }`}
                                        >
                                            🔒 Private
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Code Content */}
                            <div>
                                <label className="text-sm text-txt-muted mb-1.5 block font-medium">
                                    Code
                                </label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="input-dark font-mono text-sm leading-relaxed min-h-[300px] resize-y"
                                    placeholder="Paste your code here..."
                                    required
                                />
                            </div>

                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-3.5 text-[15px]"
                        >
                            <span className="flex items-center justify-center gap-2">
                                {loading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        <Code2 className="w-4 h-4" />
                                        Create Snippet
                                    </>
                                )}
                            </span>
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
