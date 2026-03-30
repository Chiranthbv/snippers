"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  Link2,
  Clock,
  Code2,
  Lock,
  Search,
  BarChart3,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const CodeBlock = dynamic(() => import("@/components/CodeBlock"), {
  ssr: false,
  loading: () => (
    <div className="code-block">
      <pre className="line-numbers">
        <code className="language-typescript" style={{ opacity: 0.5 }}>Loading...</code>
      </pre>
    </div>
  ),
});

const features = [
  {
    icon: Link2,
    title: "Short URLs",
    description:
      "Generate instant 6-character shareable links for every snippet you create.",
    color: "from-blue-500 to-indigo-500",
  },
  {
    icon: Clock,
    title: "Expiring Links",
    description:
      "Set auto-expiration dates. Snippets self-destruct when you need them to.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Code2,
    title: "Syntax Highlighting",
    description:
      "Beautiful code rendering for 15+ languages with our custom dark theme.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Lock,
    title: "Public & Private",
    description:
      "Control who sees your code. Keep it private or share it with the world.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Search,
    title: "Search & Filter",
    description:
      "Find snippets by language, keyword, or popularity. Browse the public feed.",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: BarChart3,
    title: "View Analytics",
    description:
      "Track how many times your snippets are viewed with built-in analytics.",
    color: "from-indigo-500 to-purple-500",
  },
];

const sampleCode = `function fibonacci(n: number): number[] {
  const sequence: number[] = [0, 1];

  for (let i = 2; i < n; i++) {
    const next = sequence[i - 1] + sequence[i - 2];
    sequence.push(next);
  }

  return sequence;
}

// Generate first 10 Fibonacci numbers
console.log(fibonacci(10));
// → [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]`;

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      {/* ─── Hero Section ─── */}
      <section className="relative min-h-[100vh] flex items-center justify-center dot-grid">
        {/* Gradient Orbs */}
        <div className="gradient-orb gradient-orb-blue w-[500px] h-[500px] -top-20 -left-32" />
        <div className="gradient-orb gradient-orb-purple w-[400px] h-[400px] top-40 right-[-100px]" />
        <div className="gradient-orb gradient-orb-teal w-[300px] h-[300px] bottom-20 left-1/4 opacity-20" />

        <div className="relative z-10 w-full md:max-w-container mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
            className="space-y-6"
          >
            {/* Beta Badge */}
            <motion.div variants={fadeInUp} transition={{ duration: 0.5 }}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-sm text-txt-muted">
                <Sparkles className="w-4 h-4 text-accent-blue" />
                Now in Beta — Open Source
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              className="font-heading font-extrabold text-5xl sm:text-6xl lg:text-7xl leading-tight"
            >
              Share Code.{" "}
              <span className="gradient-text">Instantly.</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              className="text-txt-muted text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
            >
              Create shareable code snippets with syntax highlighting, expiring
              links, and short URLs. Built for developers who move fast.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
            >
              <Link href="/snippets/new" className="btn-primary text-[15px] px-8 py-3.5">
                <span className="flex items-center gap-2">
                  Create Snippet
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
              <Link href="/snippets" className="btn-secondary text-[15px] px-8 py-3.5">
                Browse Public Snippets
              </Link>
            </motion.div>

            {/* Social Proof */}
            <motion.p
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              className="text-txt-muted/50 text-sm pt-2"
            >
              🚀 500+ snippets shared by developers worldwide
            </motion.p>
          </motion.div>

          {/* Code Preview Card */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-16 max-w-2xl mx-auto"
          >
            <div className="glass-card-static p-1 shadow-2xl shadow-indigo-500/10">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.05]">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
                <span className="ml-2 text-xs text-txt-muted font-mono">
                  fibonacci.ts
                </span>
              </div>
              <CodeBlock
                code={sampleCode}
                language="typescript"
                showHeader={false}
                showLineNumbers={true}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Features Section ─── */}
      <section className="relative py-24 sm:py-32">
        <div className="gradient-orb gradient-orb-blue w-[300px] h-[300px] top-0 right-0 opacity-20" />
        <div className="max-w-container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-sm text-accent-blue font-medium mb-4">
              Features
            </span>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl mb-4">
              Everything you need to{" "}
              <span className="gradient-text">share code</span>
            </h2>
            <p className="text-txt-muted text-lg max-w-xl mx-auto">
              Powerful features designed for developers who want fast, beautiful,
              and secure code sharing.
            </p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                transition={{ duration: 0.4 }}
                className="glass-card p-6 relative group"
              >
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-txt-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-txt-muted text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="relative py-24 sm:py-32">
        <div className="gradient-orb gradient-orb-purple w-[400px] h-[400px] bottom-0 left-1/3 opacity-20" />
        <div className="max-w-container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card-static p-12 sm:p-16 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/10 to-accent-purple/10" />
            <div className="relative z-10">
              <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-4">
                Ready to share your{" "}
                <span className="gradient-text">first snippet?</span>
              </h2>
              <p className="text-txt-muted text-lg mb-8 max-w-md mx-auto">
                Join developers who use Code Snippers to share, store, and
                collaborate on code.
              </p>
              <Link
                href="/auth/register"
                className="btn-primary text-base px-10 py-4 inline-block"
              >
                <span className="flex items-center gap-2">
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
