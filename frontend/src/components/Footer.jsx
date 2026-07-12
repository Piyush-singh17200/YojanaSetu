import { Link } from "react-router-dom";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-line/60 bg-white px-6 py-12 no-print">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 sm:flex-row">
        <div className="max-w-sm">
          <Logo size={26} />
          <p className="mt-4 text-xs font-semibold leading-relaxed text-sub">
            YojanaSetu is India's public-service platform designed to connect citizens to the welfare benefits meant for them, eliminating legal and bureaucratic barriers.
          </p>
        </div>
        <div className="flex gap-12 text-xs font-semibold text-sub">
          <div className="flex flex-col gap-3">
            <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">Platform</span>
            <Link to="/schemes" className="hover:text-ink transition-colors">Browse Schemes</Link>
            <Link to="/assistant" className="hover:text-ink transition-colors">AI Assistant</Link>
            <Link to="/dashboard" className="hover:text-ink transition-colors">Dashboard</Link>
          </div>
          <div className="flex flex-col gap-3">
            <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">Support</span>
            <span className="text-ink">Helpline: 1800-11-XXXX</span>
            <span className="cursor-pointer hover:text-ink transition-colors">Accessibility Statement</span>
            <span className="cursor-pointer hover:text-ink transition-colors">Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
