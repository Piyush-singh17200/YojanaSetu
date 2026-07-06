import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSchemeContext } from "../context/SchemeContext";
import { ArrowRight, Lock, Mail, AlertCircle } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useSchemeContext();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-6 py-12">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primaryTint/35 via-white to-white" />

      <div className="w-full max-w-md bg-white border border-line rounded-3xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-ink tracking-tight">Welcome Back</h2>
          <p className="mt-1.5 text-xs sm:text-sm font-semibold text-sub">
            Log in to YojanaSetu to check matches and track your applications.
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
                placeholder="••••••••"
                className="w-full rounded-2xl border border-line bg-white pl-10 pr-4 py-3.5 text-xs sm:text-sm font-bold text-ink outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all shadow-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary hover:bg-primaryDark text-white py-3.5 text-xs sm:text-sm font-black shadow-md transition-all active:scale-98 disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Log In"}
            <ArrowRight size={16} />
          </button>
        </form>

        <p className="mt-6 text-center text-xs font-bold text-slate-400">
          New to YojanaSetu?{" "}
          <Link to="/register" className="text-primary hover:underline font-extrabold">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
