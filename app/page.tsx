"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Brain,
  CandlestickChart,
  LineChart,
  LogIn,
  ScanLine,
  Sparkles,
  TrendingUp,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};

const features = [
  {
    icon: BarChart3,
    title: "Deep Analytics",
    description:
      "Automated PnL and drawdown tracking that turns every trade into a measurable feedback loop.",
  },
  {
    icon: Brain,
    title: "Psychology Mirror",
    description:
      "Tag your emotions, find your mental leaks, and see which states consistently shape execution.",
  },
  {
    icon: CandlestickChart,
    title: "Strategy Backtesting",
    description:
      "Mirror your Pine Script results with real execution to close the gap between signal and fill.",
  },
];

const stats = [
  ["Win Rate", "68%"],
  ["Net PnL", "+$8.2k"],
  ["Max DD", "3.1%"],
];

const trades = [
  {
    market: "NQ Long",
    result: "+2.4R",
    setup: "Opening range",
    mindset: "Disciplined",
  },
  {
    market: "ES Short",
    result: "-0.6R",
    setup: "VWAP reject",
    mindset: "Impatient",
  },
  {
    market: "BTC Long",
    result: "+1.8R",
    setup: "Trend reclaim",
    mindset: "Focused",
  },
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] text-slate-50">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-[620px] bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.18),transparent_58%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.035)_1px,transparent_1px)] bg-[size:72px_72px]" />
      </div>

      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <a href="#" className="flex items-center gap-3" aria-label="TradeMirror home">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-400/25 bg-emerald-400/10">
            <ScanLine className="h-5 w-5 text-emerald-400" strokeWidth={1.8} />
          </span>
          <span className="text-lg font-semibold tracking-normal text-white">
            TradeMirror
          </span>
        </a>

        <nav className="flex items-center gap-2 sm:gap-3" aria-label="Primary">
          <a
            href="/login"
            className="inline-flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium text-slate-300 transition hover:text-white sm:px-4"
          >
            <LogIn className="hidden h-4 w-4 sm:block" strokeWidth={1.8} />
            Login
          </a>
          <a
            href="#launch"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-700/80 bg-slate-900/80 px-4 text-sm font-semibold text-white transition hover:border-emerald-400/50 hover:bg-slate-800"
          >
            Get Started
          </a>
        </nav>
      </header>

      <section className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-5 pb-14 pt-16 text-center sm:px-8 sm:pb-20 sm:pt-24">
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-300"
        >
          <Sparkles className="h-4 w-4" strokeWidth={1.8} />
          Trading clarity, reflected daily
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.75, delay: 0.08, ease: "easeOut" }}
          className="max-w-5xl text-balance text-5xl font-semibold leading-[1.02] tracking-normal text-white sm:text-6xl lg:text-8xl"
        >
          Stop Trading Blind. Start Reflecting.
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.75, delay: 0.16, ease: "easeOut" }}
          className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-slate-300 sm:text-xl"
        >
          The ultimate trading journal to mirror your strategies, track your
          psychology, and scale your edge.
        </motion.p>

        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.75, delay: 0.24, ease: "easeOut" }}
          className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
        >
          <a
            id="launch"
            href="#dashboard"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-emerald-500 px-6 text-sm font-bold text-slate-950 shadow-[0_0_80px_rgba(16,185,129,0.18)] transition hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            Launch App
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </a>
          <a
            href="#features"
            className="inline-flex h-12 items-center justify-center rounded-lg border border-slate-700 bg-slate-900/70 px-6 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800/90"
          >
            View Features
          </a>
        </motion.div>
      </section>

      <motion.section
        id="dashboard"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        variants={fadeUp}
        transition={{ duration: 0.75, ease: "easeOut" }}
        className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-8"
      >
        <div className="rounded-lg border border-white/10 bg-white/[0.055] p-3 shadow-2xl shadow-emerald-950/25 backdrop-blur-2xl">
          <div className="rounded-md border border-slate-700/70 bg-slate-950/75 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-300">
                  Mirror dashboard
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-normal text-white">
                  Performance Reflection
                </h2>
              </div>
              <div className="grid grid-cols-3 gap-2 text-left">
                {stats.map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-md border border-slate-800 bg-slate-900/80 px-3 py-3"
                  >
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-100 sm:text-base">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-6 pt-6 lg:grid-cols-[1.25fr_0.75fr]">
              <div className="rounded-lg border border-slate-800 bg-slate-900/55 p-4">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <LineChart
                      className="h-5 w-5 text-emerald-400"
                      strokeWidth={1.8}
                    />
                    <span className="text-sm font-medium text-slate-200">
                      Win-rate trend
                    </span>
                  </div>
                  <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                    +12.8%
                  </span>
                </div>
                <div className="flex h-56 items-end gap-2 sm:gap-3">
                  {[42, 50, 47, 62, 58, 72, 68, 76, 82, 79, 86, 91].map(
                    (height, index) => (
                      <div
                        key={index}
                        className="flex flex-1 items-end rounded-t bg-slate-800/80"
                      >
                        <motion.div
                          initial={{ height: 0 }}
                          whileInView={{ height: `${height}%` }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.7,
                            delay: index * 0.035,
                            ease: "easeOut",
                          }}
                          className="w-full rounded-t bg-gradient-to-t from-emerald-600 to-emerald-300"
                        />
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-900/55 p-4">
                <div className="mb-4 flex items-center gap-2">
                  <TrendingUp
                    className="h-5 w-5 text-emerald-400"
                    strokeWidth={1.8}
                  />
                  <span className="text-sm font-medium text-slate-200">
                    Recent trades
                  </span>
                </div>
                <div className="space-y-3">
                  {trades.map((trade) => (
                    <div
                      key={trade.market}
                      className="rounded-md border border-slate-800 bg-slate-950/55 p-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium text-slate-100">
                          {trade.market}
                        </p>
                        <p
                          className={
                            trade.result.startsWith("+")
                              ? "text-sm font-semibold text-emerald-300"
                              : "text-sm font-semibold text-rose-300"
                          }
                        >
                          {trade.result}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-3 text-xs text-slate-500">
                        <span>{trade.setup}</span>
                        <span>{trade.mindset}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <section
        id="features"
        className="relative z-10 mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-28"
      >
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          variants={fadeUp}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">
            Reflect the edge
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-normal text-white sm:text-5xl">
            Built for deliberate traders.
          </h2>
        </motion.div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.article
                key={feature.title}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.35 }}
                variants={fadeUp}
                transition={{
                  duration: 0.65,
                  delay: index * 0.08,
                  ease: "easeOut",
                }}
                className="rounded-lg border border-slate-800 bg-slate-900/55 p-6 transition hover:border-emerald-400/35 hover:bg-slate-900/80"
              >
                <div className="mb-7 flex h-11 w-11 items-center justify-center rounded-lg border border-emerald-400/20 bg-emerald-400/10">
                  <Icon className="h-5 w-5 text-emerald-300" strokeWidth={1.7} />
                </div>
                <h3 className="text-xl font-semibold tracking-normal text-white">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  {feature.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </section>

      <footer className="relative z-10 border-t border-slate-800/80 px-5 py-8 sm:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <ScanLine className="h-5 w-5 text-emerald-400" strokeWidth={1.8} />
            <p className="text-sm text-slate-400">Made for traders.</p>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
            <a href="#" className="transition hover:text-slate-200">
              Privacy
            </a>
            <a href="#" className="transition hover:text-slate-200">
              Terms
            </a>
            <a href="#" className="transition hover:text-slate-200">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
