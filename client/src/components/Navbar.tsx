"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Menu, X, LogOut } from "lucide-react";
import { isAuthenticated, getUser, clearAuth } from "@/lib/auth";

export default function Navbar() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [authed, setAuthed] = useState(false);
    const [username, setUsername] = useState<string | null>(null);

    // Re-check auth state on every route change (e.g. after login redirect)
    useEffect(() => {
        setAuthed(isAuthenticated());
        setUsername(getUser());
    }, [pathname]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = () => {
        clearAuth();
        setAuthed(false);
        setUsername(null);
        window.location.href = "/";
    };

    const navLinks = [
        { label: "Browse", href: "/snippets" },
        { label: "Create", href: "/snippets/new" },
    ];

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? "bg-[#0A0F1E]/80 backdrop-blur-xl border-b border-white/[0.08]"
                : "bg-transparent"
                }`}
        >
            <div className="max-w-container mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-shadow">
                        <Zap className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-heading font-bold text-lg text-txt-primary">
                        Code Snippers
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="btn-ghost text-[15px]"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Desktop Auth Buttons */}
                <div className="hidden md:flex items-center gap-3">
                    {authed ? (
                        <>
                            <Link href="/dashboard" className="btn-ghost text-[15px]">
                                Dashboard
                            </Link>
                            <div className="flex items-center gap-2 pl-2 border-l border-white/[0.08]">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center text-sm font-bold text-white shadow-lg">
                                    {username ? username.charAt(0).toUpperCase() : "U"}
                                </div>
                                <span className="text-txt-primary font-medium text-[15px]">
                                    {username}
                                </span>
                            </div>
                            <button onClick={handleLogout} className="btn-ghost text-[15px] flex items-center gap-1.5 ml-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors">
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/auth/login" className="btn-ghost text-[15px]">
                                Login
                            </Link>
                            <Link href="/auth/register" className="btn-primary text-sm">
                                <span>Get Started</span>
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Hamburger */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="md:hidden btn-ghost p-2"
                >
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-[#0A0F1E]/95 backdrop-blur-xl border-t border-white/[0.08]"
                    >
                        <div className="px-6 py-4 space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="block py-2 text-txt-muted hover:text-txt-primary transition-colors"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <hr className="border-white/[0.08]" />
                            {authed ? (
                                <>
                                    <Link
                                        href="/dashboard"
                                        className="block py-2 text-txt-muted hover:text-txt-primary"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left py-2 text-red-400"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/auth/login"
                                        className="block py-2 text-txt-muted hover:text-txt-primary"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/auth/register"
                                        className="block btn-primary text-center mt-2"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        <span>Get Started</span>
                                    </Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
