import { ShieldCheck, Bookmark, ArrowRight, Share2, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Badge from "./Badge";
import ScoreRing from "./ScoreRing";
import { CATEGORY_ICONS } from "../data/categoryIcons";
import { useSchemeContext } from "../context/SchemeContext";

export default function SchemeCard({ scheme }) {
  const { categories, saved, toggleSave } = useSchemeContext();
  const [copied, setCopied] = useState(false);
  const cat = categories.find((c) => c.key === scheme.category);
  const Icon = CATEGORY_ICONS[scheme.category];
  const isSaved = saved.includes(scheme.id);

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/schemes/${scheme.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <motion.div 
      className="group flex flex-col justify-between rounded-3xl border border-line/60 bg-white p-5.5 shadow-sm hover:border-primary/20"
      whileHover={{ y: -4, scale: 1.01, boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.05)" }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
    >
      <div>
        <div className="mb-3.5 flex items-center justify-between">
          <Badge tone="primary">
            {Icon && <Icon size={12} className="shrink-0" />} {cat?.label || scheme.category}
          </Badge>
          <ScoreRing value={scheme.match ?? scheme.baseMatch} />
        </div>
        <h3 className="text-base font-extrabold text-ink leading-snug group-hover:text-primary transition-colors">
          {scheme.name}
        </h3>
        <p className="mt-1 text-xs font-bold text-slate-400">{scheme.dept}</p>
        <p className="mt-3 text-sm font-semibold text-sub leading-relaxed line-clamp-2">
          {scheme.tagline}
        </p>
        <div className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-success/5 border border-success/10 px-3 py-1.5 text-xs font-extrabold text-success">
          <ShieldCheck size={14} className="shrink-0" /> {scheme.benefit}
        </div>
      </div>
      
      <div className="mt-5 flex items-center gap-2 border-t border-slate-50 pt-4">
        <Link
          to={`/schemes/${scheme.id}`}
          className="flex-1 inline-flex items-center justify-center rounded-2xl border border-line bg-white hover:bg-slate-50 hover:border-slate-300 text-sub hover:text-ink py-2.5 text-xs font-bold transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary/40 text-center"
        >
          Details
        </Link>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            try {
              const viewed = JSON.parse(localStorage.getItem("yojanasetu_recently_viewed")) || [];
              const filtered = viewed.filter((x) => x !== scheme.id);
              const next = [scheme.id, ...filtered].slice(0, 4);
              localStorage.setItem("yojanasetu_recently_viewed", JSON.stringify(next));
            } catch (err) {}
            window.open(scheme.official_link || "https://www.india.gov.in", "_blank", "noopener,noreferrer");
          }}
          className="flex-1 inline-flex items-center justify-center gap-1 rounded-2xl bg-secondary hover:bg-secondary/95 text-white py-2.5 text-xs font-black shadow-sm transition-all duration-200 active:scale-98 outline-none focus-visible:ring-2 focus-visible:ring-secondary/40 text-center"
        >
          Apply Now <ArrowRight size={13} />
        </button>

        {/* Share Button */}
        <div className="relative">
          <button
            onClick={handleShare}
            className={`rounded-2xl border p-2.5 transition-all active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
              copied 
                ? "border-accent bg-accentTint/20 text-accent" 
                : "border-line bg-white text-sub hover:border-slate-300 hover:text-ink"
            }`}
            aria-label="Share scheme link"
          >
            {copied ? <Check size={16} /> : <Share2 size={16} />}
          </button>
          <AnimatePresence>
            {copied && (
              <motion.span 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap rounded-lg bg-ink px-2 py-1 text-[10px] font-extrabold text-white shadow-md"
              >
                Copied!
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Bookmark Button */}
        <button
          onClick={() => toggleSave(scheme.id)}
          className={`rounded-2xl border p-2.5 transition-all active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-secondary/40 ${
            isSaved 
              ? "border-secondary bg-secondaryTint text-secondary animate-pulse" 
              : "border-line bg-white text-sub hover:border-slate-300 hover:text-ink"
          }`}
          aria-label={isSaved ? "Remove from saved schemes" : "Save scheme"}
        >
          <Bookmark 
            size={16} 
            fill={isSaved ? "#F57C00" : "none"} 
            className="transition-transform duration-200 group-hover:scale-110" 
          />
        </button>
      </div>
    </motion.div>
  );
}
