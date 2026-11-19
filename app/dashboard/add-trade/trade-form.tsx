"use client";

import { useActionState } from "react";
import { useMemo, useState } from "react";
import { BookPlus } from "lucide-react";
import { saveTrade, type SaveTradeState } from "./actions";
import { calculateTicks, DEFAULT_TICK_SIZE, parsePrice, type Position } from "@/lib/trades/ticks";

type AssetOption = {
  asset_name: string;
  asset_code: string;
  tick_size: number;
};

const reflectionQuestions = [
  {
    name: "followed_rules",
    label: "Did I follow my rules?",
  },
  {
    name: "feeling_before",
    label: "What was I feeling before enter the trade?",
  },
  {
    name: "feeling_during",
    label: "What was I feeling during the trade?",
  },
  {
    name: "feeling_after",
    label: "What was I feeling after the trade?",
  },
  {
    name: "moved_stop",
    label: "Did I move my stop?",
  },
  {
    name: "profit_too_early",
    label: "Did I take profit too early?",
  },
  {
    name: "hesitated",
    label: "Did I hesitate?",
  },
  {
    name: "revenge_trade",
    label: "Did I revenge trade?",
  },
];

function calculateTotalTicks(
  position: string,
  entryPrice: string,
  exitPrice: string,
  tickSize: number,
) {
  const entry = parsePrice(entryPrice);
  const exit = parsePrice(exitPrice);

  if ((position !== "long" && position !== "short") || Number.isNaN(entry) || Number.isNaN(exit)) {
    return "";
  }

  return String(calculateTicks(position as Position, entry, exit, tickSize));
}

export function TradeForm({ assets }: { assets: AssetOption[] }) {
  const [state, action, pending] = useActionState<SaveTradeState, FormData>(
    saveTrade,
    {},
  );
  const [position, setPosition] = useState("");
  const [assetCode, setAssetCode] = useState("");
  const [entryPrice, setEntryPrice] = useState("");
  const [exitPrice, setExitPrice] = useState("");

  const tickSize = useMemo(
    () =>
      assets.find((asset) => asset.asset_code === assetCode)?.tick_size ??
      DEFAULT_TICK_SIZE,
    [assets, assetCode],
  );

  const totalTicks = useMemo(
    () => calculateTotalTicks(position, entryPrice, exitPrice, tickSize),
    [position, entryPrice, exitPrice, tickSize],
  );

  return (
    <form action={action} className="mt-6 rounded-lg border border-emerald-300/15 bg-slate-950/85 p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-300/10 text-emerald-200">
          <BookPlus className="h-5 w-5" strokeWidth={1.8} />
        </span>
        <div>
          <h2 className="text-lg font-semibold text-white">New Trade Entry</h2>
          <p className="text-sm text-slate-500">
            Enter trade details and answer the reflection prompts.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-slate-300">
          Assets
          <select
            name="assets"
            required
            disabled={assets.length === 0}
            value={assetCode}
            onChange={(event) => setAssetCode(event.target.value)}
            className="h-11 rounded-lg border border-emerald-300/20 bg-black px-4 text-white outline-none transition focus:border-emerald-300/60 disabled:cursor-not-allowed disabled:text-slate-600"
          >
            <option value="" disabled>
              {assets.length > 0 ? "Select asset" : "No assets configured"}
            </option>
            {assets.map((asset) => (
              <option key={asset.asset_code} value={asset.asset_code}>
                {asset.asset_code} - {asset.asset_name}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-medium text-slate-300">
          Positions
          <select
            name="position"
            required
            value={position}
            onChange={(event) => setPosition(event.target.value)}
            className="h-11 rounded-lg border border-emerald-300/20 bg-black px-4 text-white outline-none transition focus:border-emerald-300/60"
          >
            <option value="" disabled>
              Select position
            </option>
            <option value="long">Long</option>
            <option value="short">Short</option>
          </select>
        </label>

        <label className="grid gap-2 text-sm font-medium text-slate-300">
          Contracts
          <input
            name="contracts"
            type="number"
            min="1"
            step="1"
            required
            defaultValue="1"
            inputMode="numeric"
            className="h-11 rounded-lg border border-emerald-300/20 bg-black px-4 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-300/60"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-slate-300">
          Entry Price
          <input
            name="entry_price"
            type="text"
            inputMode="decimal"
            required
            value={entryPrice}
            onChange={(event) => setEntryPrice(event.target.value)}
            className="h-11 rounded-lg border border-emerald-300/20 bg-black px-4 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-300/60"
            placeholder="1221'6 or 1221.75"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-slate-300">
          Entry Datetime
          <input
            name="entry_datetime"
            type="datetime-local"
            required
            className="h-11 rounded-lg border border-emerald-300/20 bg-black px-4 text-white outline-none transition focus:border-emerald-300/60"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-slate-300">
          Exit Price
          <input
            name="exit_price"
            type="text"
            inputMode="decimal"
            required
            value={exitPrice}
            onChange={(event) => setExitPrice(event.target.value)}
            className="h-11 rounded-lg border border-emerald-300/20 bg-black px-4 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-300/60"
            placeholder="1216'2 or 1216.25"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-slate-300">
          Exit Datetime
          <input
            name="exit_datetime"
            type="datetime-local"
            required
            className="h-11 rounded-lg border border-emerald-300/20 bg-black px-4 text-white outline-none transition focus:border-emerald-300/60"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-slate-300 sm:col-span-2">
          Total Ticks
          <input
            name="total_ticks"
            value={totalTicks}
            readOnly
            className="h-11 rounded-lg border border-emerald-300/20 bg-emerald-300/10 px-4 font-semibold text-emerald-100 outline-none"
            placeholder="Auto calculated"
          />
        </label>
      </div>

      <div className="mt-8 border-t border-emerald-300/10 pt-6">
        <h3 className="text-lg font-semibold text-white">Trade Reflection</h3>
        <div className="mt-4 grid gap-4">
          {reflectionQuestions.map((question) => (
            <label
              key={question.name}
              className="grid gap-2 text-sm font-medium text-slate-300"
            >
              {question.label}
              <textarea
                name={question.name}
                rows={3}
                className="rounded-lg border border-emerald-300/20 bg-black px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-300/60"
                placeholder="Write your answer..."
              />
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={pending || assets.length === 0}
        className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-emerald-400 px-5 text-sm font-bold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Saving..." : "Save Trade"}
      </button>

      {state.message ? (
        <p
          className={
            state.success
              ? "mt-4 rounded-lg border border-emerald-400/25 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200"
              : "mt-4 rounded-lg border border-rose-400/25 bg-rose-400/10 px-4 py-3 text-sm text-rose-200"
          }
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
