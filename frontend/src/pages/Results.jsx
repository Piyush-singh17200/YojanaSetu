import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import SchemeCard from "../components/SchemeCard";
import { LoadingState, ErrorState, EmptySearchState, CardSkeleton } from "../components/StatusStates";
import { useSchemeContext } from "../context/SchemeContext";
import { getSchemes } from "../api";
import { Search, ArrowUpDown, SlidersHorizontal, Layers, CheckCircle2, RotateCcw } from "lucide-react";

export default function Results() {
  const { categories, matched } = useSchemeContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCat = searchParams.get("category") || "all";
  const urlSearch = searchParams.get("search") || "";
  
  const [schemes, setSchemes] = useState([]);
  const [status, setStatus] = useState("loading");
  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const [sortBy, setSortBy] = useState("match"); // "match" | "name"
  const [selectedDept, setSelectedDept] = useState("all");

  const load = () => {
    setStatus("loading");
    getSchemes(activeCat)
      .then((data) => {
        setSchemes(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  };

  useEffect(load, [activeCat]);

  // Sync search input when URL search param changes
  useEffect(() => {
    setSearchTerm(urlSearch);
  }, [urlSearch]);

  const baseDisplayed = useMemo(() => {
    return activeCat === "all" && matched ? matched : schemes;
  }, [activeCat, matched, schemes]);

  // 1. Filter by search query text
  const filteredBySearch = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return baseDisplayed;
    return baseDisplayed.filter((s) => (
      s.name.toLowerCase().includes(term) ||
      s.dept.toLowerCase().includes(term) ||
      s.tagline.toLowerCase().includes(term) ||
      s.benefit.toLowerCase().includes(term)
    ));
  }, [searchTerm, baseDisplayed]);

  // 2. Compile unique departments list for advanced filters
  const uniqueDepts = useMemo(() => {
    const depts = new Set(baseDisplayed.map((s) => s.dept));
    return ["all", ...Array.from(depts)];
  }, [baseDisplayed]);

  // 3. Filter by department
  const filteredByDept = useMemo(() => {
    if (selectedDept === "all") return filteredBySearch;
    return filteredBySearch.filter((s) => s.dept === selectedDept);
  }, [selectedDept, filteredBySearch]);

  // 4. Apply Sorting
  const sorted = useMemo(() => {
    return [...filteredByDept].sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      const scoreA = a.match ?? a.baseMatch ?? 0;
      const scoreB = b.match ?? b.baseMatch ?? 0;
      return scoreB - scoreA;
    });
  }, [sortBy, filteredByDept]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedDept("all");
    setSearchParams({});
  };

  const handleSearchChange = (val) => {
    setSearchTerm(val);
    // Sync to URL parameters to preserve state
    if (val.trim()) {
      setSearchParams((prev) => {
        prev.set("search", val);
        return prev;
      });
    } else {
      setSearchParams((prev) => {
        prev.delete("search");
        return prev;
      });
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line/60 pb-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-ink flex items-center gap-2">
            {matched ? "Personalised Scheme Matches" : "Explore Welfare Schemes"}
          </h2>
          <p className="mt-1.5 text-sm font-semibold text-sub">
            {matched 
              ? "Instantly matched and ranked against your locally saved citizen profile." 
              : "Discover welfare benefits. Take the onboarding check to calculate individual match scores."
            }
          </p>
        </div>
        <div className="text-xs font-bold text-slate-400 bg-slate-100 border border-line rounded-full px-4 py-2 w-fit">
          Showing {sorted.length} {sorted.length === 1 ? "scheme" : "schemes"}
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="mt-8 grid gap-8 lg:grid-cols-4">
        
        {/* Left Column: Sidebar Filters */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="rounded-3xl border border-line bg-white p-5 shadow-sm space-y-5">
            <h3 className="text-sm font-extrabold text-ink uppercase tracking-wider flex items-center gap-2">
              <SlidersHorizontal size={14} className="text-primary" /> Filter & Sort
            </h3>

            {/* Local Search input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400">Keyword Search</label>
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sub" />
                <input
                  type="text"
                  placeholder="Scholarships, Loans..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs font-bold border border-line/80 rounded-xl bg-white text-ink outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Sort Options */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400">Order By</label>
              <div className="relative">
                <ArrowUpDown size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-sub pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-8.5 pr-2 py-2.5 text-xs font-bold border border-line/80 bg-white text-sub rounded-xl outline-none focus:border-primary transition-all cursor-pointer"
                >
                  <option value="match">Match Percentage</option>
                  <option value="name">Alphabetical (A-Z)</option>
                </select>
              </div>
            </div>

            {/* Department Options */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400">Ministry / Department</label>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full px-3 py-2.5 text-xs font-bold border border-line/80 bg-white text-sub rounded-xl outline-none focus:border-primary transition-all cursor-pointer"
              >
                <option value="all">All Departments</option>
                {uniqueDepts.filter(d => d !== "all").map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Quick Reset action */}
            {(searchTerm || selectedDept !== "all" || activeCat !== "all") && (
              <button
                onClick={handleClearFilters}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-line hover:border-slate-400 py-2.5 text-xs font-bold text-sub transition-colors"
              >
                <RotateCcw size={12} /> Clear all filters
              </button>
            )}
          </div>
        </aside>

        {/* Right Column: Schemes listings */}
        <main className="lg:col-span-3 space-y-6">
          
          {/* Horizontal Category Tabs for fast browsing */}
          <div className="space-y-2.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Layers size={12} /> Scheme Categories
            </span>
            <div className="flex gap-1.5 overflow-x-auto pb-2 pt-0.5 scrollbar-none sm:flex-wrap">
              <button
                onClick={() => setSearchParams((prev) => {
                  prev.delete("category");
                  return prev;
                })}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-bold transition-all shadow-sm active:scale-95 ${
                  activeCat === "all"
                    ? "border-primary bg-primary text-white"
                    : "border-line bg-white text-sub hover:border-slate-300"
                }`}
              >
                All Categories
              </button>
              {categories.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setSearchParams((prev) => {
                    prev.set("category", c.key);
                    return prev;
                  })}
                  className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-bold transition-all shadow-sm active:scale-95 ${
                    activeCat === c.key
                      ? "border-primary bg-primary text-white"
                      : "border-line bg-white text-sub hover:border-slate-300"
                  }`}
                >
                  {c.label} {c.count ? `(${c.count})` : ""}
                </button>
              ))}
            </div>
          </div>

          {/* Cards dynamic render section */}
          <div className="pt-2">
            {status === "loading" && !matched && (
              <CardSkeleton />
            )}
            
            {status === "error" && !matched && (
              <div className="py-12">
                <ErrorState onRetry={load} />
              </div>
            )}

            {(status === "ready" || matched) && (
              <>
                {sorted.length > 0 ? (
                  <motion.div 
                    layout 
                    className="grid gap-5 sm:grid-cols-2"
                  >
                    <AnimatePresence mode="popLayout">
                      {sorted.map((s) => (
                        <motion.div
                          layout
                          key={s.id}
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.96 }}
                          transition={{ type: "spring", stiffness: 350, damping: 28 }}
                        >
                          <SchemeCard scheme={s} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  <div className="bg-white rounded-3xl border border-line p-8 shadow-sm">
                    <EmptySearchState 
                      query={searchTerm || selectedDept !== "all" ? "active filters" : ""} 
                      onClear={handleClearFilters} 
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
