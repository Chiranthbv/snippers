"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, Check } from "lucide-react";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-go";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-css";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-json";
import "prismjs/components/prism-sql";

interface CodeBlockProps {
    code: string;
    language: string;
    showLineNumbers?: boolean;
    showHeader?: boolean;
    maxLines?: number;
}

const languageMap: Record<string, string> = {
    javascript: "javascript",
    js: "javascript",
    typescript: "typescript",
    ts: "typescript",
    python: "python",
    py: "python",
    java: "java",
    go: "go",
    rust: "rust",
    css: "css",
    html: "markup",
    c: "c",
    cpp: "cpp",
    "c++": "cpp",
    bash: "bash",
    shell: "bash",
    json: "json",
    sql: "sql",
};

function getBadgeClass(lang: string): string {
    const lower = lang.toLowerCase();
    if (lower === "javascript" || lower === "js") return "badge-javascript";
    if (lower === "typescript" || lower === "ts") return "badge-typescript";
    if (lower === "python" || lower === "py") return "badge-python";
    if (lower === "java") return "badge-java";
    if (lower === "go") return "badge-go";
    if (lower === "rust") return "badge-rust";
    if (lower === "cpp" || lower === "c++" || lower === "c") return "badge-cpp";
    if (lower === "html") return "badge-html";
    if (lower === "css") return "badge-css";
    return "badge-other";
}

export default function CodeBlock({
    code,
    language,
    showLineNumbers = true,
    showHeader = true,
    maxLines,
}: CodeBlockProps) {
    const codeRef = useRef<HTMLElement>(null);
    const [copied, setCopied] = useState(false);
    const [mounted, setMounted] = useState(false);

    const prismLang = languageMap[language.toLowerCase()] || "plaintext";
    const displayCode = maxLines
        ? code.split("\n").slice(0, maxLines).join("\n")
        : code;

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && codeRef.current) {
            Prism.highlightElement(codeRef.current);
        }
    }, [displayCode, prismLang, mounted]);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="code-block">
            {showHeader && (
                <div className="code-block-header">
                    <span className={`badge ${getBadgeClass(language)}`}>
                        {language.toUpperCase()}
                    </span>
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 text-txt-muted hover:text-txt-primary transition-colors text-sm"
                    >
                        {copied ? (
                            <>
                                <Check className="w-4 h-4 text-emerald-400" />
                                <span className="text-emerald-400">Copied!</span>
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4" />
                                <span>Copy</span>
                            </>
                        )}
                    </button>
                </div>
            )}
            <pre className={showLineNumbers ? "line-numbers" : ""} suppressHydrationWarning>
                <code ref={codeRef} className={`language-${prismLang}`} suppressHydrationWarning>
                    {showLineNumbers
                        ? displayCode
                            .split("\n")
                            .map((line, i) => (
                                <span key={i} className="line">
                                    {line}
                                    {"\n"}
                                </span>
                            ))
                        : displayCode}
                </code>
            </pre>
            {maxLines && code.split("\n").length > maxLines && (
                <div className="px-4 py-2 text-center text-txt-muted text-xs border-t border-white/[0.05]">
                    {code.split("\n").length - maxLines} more lines...
                </div>
            )}
        </div>
    );
}

export { getBadgeClass };
