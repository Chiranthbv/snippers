"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Zap, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { login } from "@/lib/api";
import { setToken, setUser } from "@/lib/auth";
import toast from "react-hot-toast";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = await login(email, password);
            setToken(data.token);
            setUser(data.username);
            toast.success("Welcome back!");
            router.push("/dashboard");
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Invalid credentials";
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center dot-grid relative px-4">
            {/* Background Orbs */}
            <div className="gradient-orb gradient-orb-blue w-[300px] h-[300px] top-20 -left-20" />
            <div className="gradient-orb gradient-orb-purple w-[250px] h-[250px] bottom-20 right-10" />

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="glass-card-static p-8 sm:p-10">
                    {/* Logo */}
                    <div className="flex items-center justify-center gap-2 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-heading font-bold text-xl">Code Snippers</span>
                    </div>

                    <h1 className="font-heading font-bold text-2xl text-center mb-2">
                        Welcome back
                    </h1>
                    <p className="text-txt-muted text-center text-sm mb-8">
                        Sign in to your account to continue
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="text-sm text-txt-muted mb-1.5 block">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-txt-muted/50" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-dark !pl-10"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm text-txt-muted mb-1.5 block">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-txt-muted/50" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-dark !pl-10"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-3.5 mt-2"
                        >
                            <span className="flex items-center justify-center gap-2">
                                {loading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </span>
                        </button>
                    </form>

                    <p className="text-center text-sm text-txt-muted mt-6">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/auth/register"
                            className="text-accent-blue hover:underline font-medium"
                        >
                            Create one
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
