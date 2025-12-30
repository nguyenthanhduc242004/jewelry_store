import { Search } from 'lucide-react';
import { useState } from "react";

type Period = "monthly" | "annually";
export default function ReportSearchBar() {
  const [period, setPeriod] = useState<Period>("monthly");
  return (
<div className="flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="w-full max-w-sm">
          <label className="sr-only" htmlFor="report-search">
            
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="report-search"
              type="text"
              placeholder="Search"
              className="w-full rounded-full border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
            </span>
          </div>
        </div>
        {/* Switch Monthly / Annually */}
        <div className="inline-flex items-center rounded-full bg-slate-100 p-1 text-xs font-medium text-blue-600 hover:bg-blue-50 transition">
          <button
            onClick={() => setPeriod("monthly")}
            className={
              "rounded-full px-4 py-1.5 transition " +
              (period === "monthly"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500")
            }
          >
            Monthly
          </button>
          <button
            onClick={() => setPeriod("annually")}
            className={
              "rounded-full px-4 py-1.5 transition " +
              (period === "annually"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500")
            }
          >
            Annually
          </button>
        </div>
        
      </div>
    );
}