import Link from "next/link";
import { Zap, Github, Twitter } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t border-white/[0.05] bg-[#070B16]">
            <div className="max-w-container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center">
                                <Zap className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-heading font-bold text-lg">
                                Code Snippers
                            </span>
                        </Link>
                        <p className="text-txt-muted text-sm max-w-xs leading-relaxed">
                            Share code snippets instantly with syntax highlighting, expiring
                            links, and short shareable URLs. Built for developers.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-heading font-semibold text-sm mb-4 text-txt-primary">
                            Platform
                        </h4>
                        <ul className="space-y-2">
                            {[
                                { label: "Browse Snippets", href: "/snippets" },
                                { label: "Create Snippet", href: "/snippets/new" },
                                { label: "Dashboard", href: "/dashboard" },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-txt-muted text-sm hover:text-txt-primary transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-heading font-semibold text-sm mb-4 text-txt-primary">
                            Account
                        </h4>
                        <ul className="space-y-2">
                            {[
                                { label: "Login", href: "/auth/login" },
                                { label: "Register", href: "/auth/register" },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-txt-muted text-sm hover:text-txt-primary transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="mt-12 pt-6 border-t border-white/[0.05] flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-txt-muted text-xs">
                        © 2026 Code Snippers. Built with Next.js & Spring Boot. Created by Chiranth B V.
                    </p>
                    <div className="flex items-center gap-4">
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-txt-muted hover:text-txt-primary transition-colors"
                        >
                            <Github className="w-4 h-4" />
                        </a>
                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-txt-muted hover:text-txt-primary transition-colors"
                        >
                            <Twitter className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
