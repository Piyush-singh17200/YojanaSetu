import { motion } from "framer-motion";

export default function ScoreRing({ value }) {
  const r = 20;
  const c = 2 * Math.PI * r;
  
  // Theme Color alignment
  const color = value >= 85 ? "#15803D" : value >= 65 ? "#F57C00" : "#475569";
  const bgStroke = "#E2E8F0";

  return (
    <div 
      className="relative flex h-14 w-14 items-center justify-center select-none"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin="0"
      aria-valuemax="100"
      aria-label={`Eligibility Match: ${value}%`}
    >
      <svg width="56" height="56" viewBox="0 0 56 56" className="-rotate-90">
        {/* Track circle */}
        <circle 
          cx="28" 
          cy="28" 
          r={r} 
          fill="none" 
          stroke={bgStroke} 
          strokeWidth="4.5" 
        />
        {/* Progress circle */}
        <motion.circle
          cx="28"
          cy="28"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (value / 100) * c }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      {/* Centered text */}
      <span className="absolute text-[11px] font-extrabold" style={{ color }}>
        {value}%
      </span>
    </div>
  );
}
