"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Plus,
    Trash2,
    ExternalLink,
    Eye,
    Lock,
    Globe,
    Loader2,
    Code2,
} from "lucide-react";
import { isAuthenticated, getUser } from "@/lib/auth";
import type { Snippet } from "@/lib/api";
import { getBadgeClass } from "@/components/CodeBlock";
import toast from "react-hot-toast";


export default function DashboardPage() {
    const router = useRouter();
    const [snippets, setSnippets] = useState<Snippet[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<number | null>(null);
    const username = getUser() || "Developer";

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push("/auth/login");
            return;
        }

        async function fetchMySnippets() {
            try {
                const { getMySnippets } = await import("@/lib/api");
                const data = await getMySnippets();
                setSnippets(data || []);
            } catch (error) {
                console.error("Failed to fetch snippets:", error);
                toast.error("Could not load your snippets");
            } finally {
                setLoading(false);
            }
        }
        fetchMySnippets();
    }, [router]);

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this snippet?")) return;
        setDeleting(id);
        try {
            const { deleteSnippet } = await import("@/lib/api");
            await deleteSnippet(id);
            setSnippets((prev) => prev.filter((s) => s.id !== id));
            toast.success("Snippet deleted");
        } catch {
            toast.error("Failed to delete snippet");
        } finally {
            setDeleting(null);
        }
    };

    return (
        <div className="min-h-screen relative">
            <div className="gradient-orb gradient-orb-teal w-[250px] h-[250px] top-10 right-10 opacity-15" />

            <div className="max-w-container mx-auto px-6 py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10"
                >
                    <div>
                        <h1 className="font-heading font-bold text-3xl mb-1">
                            Welcome back,{" "}
                            <span className="gradient-text">{username}</span>
                        </h1>
                        <p className="text-txt-muted">
                            Manage your code snippets from here.
                        </p>
                    </div>
                    <Link
                        href="/snippets/new"
                        className="btn-primary text-sm flex items-center gap-2 self-start"
                    >
                        <span className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            New Snippet
                        </span>
                    </Link>
                </motion.div>

                {/* Stats Row */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10"
                >
                    {[
                        {
                            label: "Total Snippets",
                            value: snippets.length,
                            icon: Code2,
                            color: "from-accent-blue to-indigo-500",
                        },
                        {
                            label: "Public",
                            value: snippets.filter((s) => s.visibility === "PUBLIC").length,
                            icon: Globe,
                            color: "from-emerald-500 to-green-500",
                        },
                        {
                            label: "Private",
                            value: snippets.filter((s) => s.visibility === "PRIVATE").length,
                            icon: Lock,
                            color: "from-accent-purple to-pink-500",
                        },
                        {
                            label: "Total Views",
                            value: snippets.reduce((sum, s) => sum + s.viewCount, 0),
                            icon: Eye,
                            color: "from-orange-500 to-red-500",
                        },
                    ].map((stat) => (
                        <div key={stat.label} className="glass-card-static p-4">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-9 h-9 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                                >
                                    <stat.icon className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold font-heading">
                                        {stat.value}
                                    </p>
                                    <p className="text-xs text-txt-muted">{stat.label}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Snippets Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                >
                    <h2 className="font-heading font-semibold text-xl mb-4">
                        Your Snippets
                    </h2>

                    {loading ? (
                        <div className="space-y-3">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="glass-card-static p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="skeleton h-5 w-16" />
                                        <div className="skeleton h-5 w-48" />
                                        <div className="flex-1" />
                                        <div className="skeleton h-5 w-20" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : snippets.length > 0 ? (
                        <div className="space-y-3">
                            {snippets.map((snippet, i) => (
                                <motion.div
                                    key={snippet.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="glass-card-static p-4 flex flex-col sm:flex-row sm:items-center gap-3 group"
                                >
                                    <span
                                        className={`badge ${getBadgeClass(snippet.language)} text-[11px] flex-shrink-0`}
                                    >
                                        {snippet.language}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-[15px] truncate">
                                            {snippet.title}
                                        </h3>
                                        <div className="flex items-center gap-3 text-xs text-txt-muted mt-0.5">
                                            <span className="flex items-center gap-1">
                                                {snippet.visibility === "PUBLIC" ? (
                                                    <Globe className="w-3 h-3" />
                                                ) : (
                                                    <Lock className="w-3 h-3" />
                                                )}
                                                {snippet.visibility}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Eye className="w-3 h-3" />
                                                {snippet.viewCount}
                                            </span>
                                            <span className="font-mono text-accent-blue/70">
                                                /s/{snippet.shortUrl}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <Link
                                            href={`/s/${snippet.shortUrl}`}
                                            className="btn-ghost p-2 hover:text-accent-blue"
                                            title="View"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(snippet.id)}
                                            disabled={deleting === snippet.id}
                                            className="btn-ghost p-2 hover:text-red-400"
                                            title="Delete"
                                        >
                                            {deleting === snippet.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="glass-card-static p-12 text-center">
                            <Code2 className="w-12 h-12 text-txt-muted/30 mx-auto mb-4" />
                            <h3 className="font-heading font-semibold text-lg mb-2">
                                No snippets yet
                            </h3>
                            <p className="text-txt-muted text-sm mb-6">
                                Create your first snippet and start sharing code!
                            </p>
                            <Link
                                href="/snippets/new"
                                className="btn-primary inline-block"
                            >
                                <span className="flex items-center gap-2">
                                    <Plus className="w-4 h-4" />
                                    Create your first snippet
                                </span>
                            </Link>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
