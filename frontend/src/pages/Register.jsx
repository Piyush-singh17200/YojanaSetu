import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useSchemeContext } from "../context/SchemeContext";
import { ArrowRight, Lock, Mail, User, AlertCircle } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register } = useSchemeContext();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectPath = searchParams.get("redirect") || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    
    setError("");
    setLoading(true);
    try {
      await register(email, password, name);
      navigate(redirectPath);
    } catch (err) {
      setError(err.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-6 py-12">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primaryTint/35 via-white to-white" />

      <div className="w-full max-w-md bg-white border border-line rounded-3xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-ink tracking-tight">Create Account</h2>
          <p className="mt-1.5 text-xs sm:text-sm font-semibold text-sub">
            Build your YojanaSetu profile and manage eligibility rules.
          </p>
        </div>

        {error && (
          <div className="mb-5 flex items-center gap-2 rounded-2xl bg-danger/5 border border-danger/10 p-4 text-xs font-bold text-danger">
            <Mail size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col">
            <label className="mb-2 text-xs font-extrabold text-ink uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sub pointer-events-none" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full rounded-2xl border border-line bg-white pl-10 pr-4 py-3.5 text-xs sm:text-sm font-bold text-ink outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-xs font-extrabold text-ink uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sub pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-line bg-white pl-10 pr-4 py-3.5 text-xs sm:text-sm font-bold text-ink outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-xs font-extrabold text-ink uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sub pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                minLength={6}
                className="w-full rounded-2xl border border-line bg-white pl-10 pr-4 py-3.5 text-xs sm:text-sm font-bold text-ink outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all shadow-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary hover:bg-primaryDark text-white py-3.5 text-xs sm:text-sm font-black shadow-md transition-all active:scale-98 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Sign Up"}
            <ArrowRight size={16} />
          </button>
        </form>

        <p className="mt-6 text-center text-xs font-bold text-slate-400">
          Already have an account?{" "}
          <Link to={`/login?redirect=${encodeURIComponent(redirectPath)}`} className="text-primary hover:underline font-extrabold">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
