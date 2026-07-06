import { motion } from "framer-motion";

export default function Logo({ size = 28 }) {
  return (
    <div className="flex items-center gap-2.5 select-none">
      {/* Premium SVG Icon representing a 'Setu' (Bridge) with Framer Motion animations */}
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary cursor-pointer"
        whileHover={{ scale: 1.08, rotate: 3 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
      >
        {/* Bridge Pillars */}
        <rect x="6" y="20" width="3" height="6" rx="1" fill="currentColor" />
        <rect x="23" y="20" width="3" height="6" rx="1" fill="currentColor" />
        
        {/* The Bridge Arch */}
        <path
          d="M5 18C5 18 10 11 16 11C22 11 27 18 27 18"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        
        {/* Roadway line */}
        <path
          d="M3 18H29"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        
        {/* Saffron digital node (representing scheme guidance & path forward, with gentle pulse) */}
        <motion.circle 
          cx="16" 
          cy="5.5" 
          r="3" 
          fill="#F57C00" 
          animate={{
            scale: [1, 1.25, 1],
            opacity: [1, 0.75, 1]
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.svg>
      
      <motion.span 
        className="font-extrabold tracking-tight text-ink" 
        style={{ fontSize: size * 0.75 }}
        initial={{ opacity: 0, x: -5 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        Yojana<span className="text-secondary font-medium">Setu</span>
      </motion.span>
    </div>
  );
}
