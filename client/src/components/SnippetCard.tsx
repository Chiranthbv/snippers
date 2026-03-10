"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Eye, ExternalLink } from "lucide-react";
import { getBadgeClass } from "./CodeBlock";
const CodeBlock = dynamic(() => import("./CodeBlock"), { ssr: false });

interface SnippetCardProps {
    title: string;
    language: string;
    content: string;
    shortUrl: string;
    username: string;
    viewCount: number;
    createdAt: string;
    index?: number;
}

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    return `${months}mo ago`;
}

export default function SnippetCard({
    title,
    language,
    content,
    shortUrl,
    username,
    viewCount,
    createdAt,
    index = 0,
}: SnippetCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
        >
            <Link href={`/s/${shortUrl}`} className="block group">
                <div className="glass-card p-0 overflow-hidden cursor-pointer">
                    {/* Header */}
                    <div className="p-4 pb-3 flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`badge ${getBadgeClass(language)} text-[11px]`}>
                                    {language}
                                </span>
                            </div>
                            <h3 className="font-heading font-semibold text-txt-primary text-[15px] truncate group-hover:text-accent-blue transition-colors">
                                {title}
                            </h3>
                        </div>
                        <ExternalLink className="w-4 h-4 text-txt-muted opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
                    </div>

                    {/* Code Preview */}
                    <div className="mx-4 mb-3 rounded-lg overflow-hidden border border-white/[0.04]">
                        <CodeBlock
                            code={content}
                            language={language}
                            showLineNumbers={false}
                            showHeader={false}
                            maxLines={4}
                        />
                    </div>

                    {/* Footer */}
                    <div className="px-4 pb-4 flex items-center justify-between text-xs text-txt-muted">
                        <div className="flex items-center gap-3">
                            {/* Avatar */}
                            <div className="flex items-center gap-1.5">
                                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-[10px] font-bold text-white">
                                    {username.charAt(0).toUpperCase()}
                                </div>
                                <span>{username}</span>
                            </div>
                            <span>·</span>
                            <span>{timeAgo(createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            <span>{viewCount}</span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
