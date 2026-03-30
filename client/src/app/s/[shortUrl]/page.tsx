"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
    Share2,
    Calendar,
    Eye,
    User,
    Clock,
    AlertTriangle,
    ShieldX,
} from "lucide-react";
const CodeBlock = dynamic(() => import("@/components/CodeBlock"), { ssr: false });
import type { Snippet } from "@/lib/api";
import toast from "react-hot-toast";

export default function ViewSnippetPage() {
    const params = useParams();
    const shortUrl = params.shortUrl as string;
    const [snippet, setSnippet] = useState<Snippet | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<"expired" | "forbidden" | "notfound" | null>(null);

    useEffect(() => {
        async function fetchSnippet() {
            try {
                const { getSnippetByUrl } = await import("@/lib/api");
                const data = await getSnippetByUrl(shortUrl);
                setSnippet(data);
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : "";
                if (message.includes("410") || message.includes("expired")) {
                    setError("expired");
                } else if (message.includes("403") || message.includes("forbidden")) {
                    setError("forbidden");
                } else {
                    setError("notfound");
                }
            } finally {
                setLoading(false);
            }
        }
        fetchSnippet();
    }, [shortUrl]);

    const handleShareUrl = async () => {
        const url = window.location.href;
        await navigator.clipboard.writeText(url);
        toast.success("URL copied to clipboard!");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="space-y-4 w-full max-w-3xl px-6">
                    <div className="skeleton h-8 w-1/3" />
                    <div className="skeleton h-6 w-1/4" />
                    <div className="skeleton h-[400px] w-full" />
                </div>
            </div>
        );
    }

    if (error === "expired") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center glass-card-static p-12 max-w-md mx-4"
                >
                    <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                    <h2 className="font-heading font-bold text-2xl mb-2">
                        Snippet Expired
                    </h2>
                    <p className="text-txt-muted">
                        This snippet has expired and is no longer available.
                    </p>
                </motion.div>
            </div>
        );
    }

    if (error === "forbidden") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center glass-card-static p-12 max-w-md mx-4"
                >
                    <ShieldX className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="font-heading font-bold text-2xl mb-2">
                        Private Snippet
                    </h2>
                    <p className="text-txt-muted">
                        This snippet is private. Only the owner can view it.
                    </p>
                </motion.div>
            </div>
        );
    }

    if (!snippet) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-txt-muted text-lg">Snippet not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative">
            <div className="gradient-orb gradient-orb-blue w-[300px] h-[300px] top-10 -right-20 opacity-15" />

            <div className="max-w-4xl mx-auto px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                        <div>
                            <h1 className="font-heading font-bold text-2xl sm:text-3xl mb-2">
                                {snippet.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-txt-muted">
                                <div className="flex items-center gap-1.5">
                                    <User className="w-4 h-4" />
                                    <span>{snippet.username}</span>
                                </div>
                                <span>·</span>
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                        {new Date(snippet.createdAt).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </span>
                                </div>
                                <span>·</span>
                                <div className="flex items-center gap-1.5">
                                    <Eye className="w-4 h-4" />
                                    <span>{snippet.viewCount} views</span>
                                </div>
                                {snippet.expiresAt && (
                                    <>
                                        <span>·</span>
                                        <div className="flex items-center gap-1.5 text-yellow-500">
                                            <Clock className="w-4 h-4" />
                                            <span>
                                                Expires{" "}
                                                {new Date(snippet.expiresAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={handleShareUrl}
                            className="btn-secondary flex items-center gap-2 text-sm flex-shrink-0"
                        >
                            <Share2 className="w-4 h-4" />
                            Share
                        </button>
                    </div>

                    {/* Code Block */}
                    <div className="mb-6">
                        <CodeBlock
                            code={snippet.content}
                            language={snippet.language}
                            showLineNumbers={true}
                            showHeader={true}
                        />
                    </div>

                    {/* Metadata Card */}
                    <div className="glass-card-static p-4">
                        <div className="flex flex-wrap gap-4 text-sm">
                            <div>
                                <span className="text-txt-muted">Visibility: </span>
                                <span
                                    className={
                                        snippet.visibility === "PUBLIC"
                                            ? "text-emerald-400"
                                            : "text-txt-muted"
                                    }
                                >
                                    {snippet.visibility === "PUBLIC" ? "🌍 Public" : "🔒 Private"}
                                </span>
                            </div>
                            <div>
                                <span className="text-txt-muted">Short URL: </span>
                                <span className="font-mono text-accent-blue">
                                    /s/{snippet.shortUrl}
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
