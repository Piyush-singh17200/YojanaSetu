import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Badge from "../components/Badge";
import { askAIAssistant } from "../api";
import { useSchemeContext } from "../context/SchemeContext";
import { Sparkles, Send, User, Bot, ArrowRight, Info } from "lucide-react";

const SUGGESTIONS = [
  { text: "Scholarships for engineering students in Uttar Pradesh", icon: "🎓" },
  { text: "Welfare benefits for farmers with agricultural land", icon: "🌾" },
  { text: "Startup capital or bank loans for women entrepreneurs", icon: "💼" }
];

export default function Assistant() {
  const { profile } = useSchemeContext();
  const chatEndRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Namaste! I am your YojanaSetu AI Assistant. Describe your situation in plain text—including your age, location, occupation, or income—and I will find eligible schemes for you.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text) => {
    if (!text.trim()) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text }]);
    setLoading(true);
    
    try {
      const res = await askAIAssistant(text, profile);
      setMessages((m) => [
        ...m,
        { 
          role: "assistant", 
          text: res.reply, 
          schemes: res.schemes 
        }
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", text: "I encountered an issue connecting to the database. Please verify your connection." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-64px)] max-w-3xl flex-col px-6 py-6 justify-between gap-4">
      
      {/* Header Info */}
      <div className="border-b border-line/60 pb-3 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-xl font-black text-ink flex items-center gap-1.5">
            <Sparkles size={18} className="text-secondary animate-pulse" />
            YojanaSetu AI Assistant
          </h2>
          <p className="text-xs font-semibold text-sub">Explain your profile in conversational text to see scheme recommendations.</p>
        </div>
        <div className="hidden sm:flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 bg-slate-100 rounded-full px-3 py-1">
          <span>AI Engine v2.0</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 space-y-5 overflow-y-auto pr-1 py-2 scrollbar-none">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className={`flex gap-3.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              
              {/* Assistant Avatar */}
              {m.role === "assistant" && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-sm">
                  <Bot size={16} />
                </div>
              )}

              {/* Chat Bubble */}
              <div
                className={`max-w-[85%] rounded-3xl px-4.5 py-3.5 text-sm sm:text-base font-semibold leading-relaxed shadow-sm ${
                  m.role === "user"
                    ? "bg-primary text-white rounded-tr-sm"
                    : "border border-line/70 bg-white text-ink rounded-tl-sm"
                }`}
              >
                {m.role === "user" ? (
                  <p>{m.text}</p>
                ) : (
                  <div className="prose prose-sm max-w-none">
                    {m.text.split("\n").map((line, li) => {
                      if (line.startsWith("### ")) {
                        return <h3 key={li} className="text-sm font-black text-primary mt-3 mb-1 first:mt-0">{line.replace("### ", "").replace(/🌟 /g, "🌟 ")}</h3>;
                      }
                      if (line.startsWith("## ")) {
                        return <h2 key={li} className="text-base font-black text-ink mt-3 mb-1">{line.replace("## ", "")}</h2>;
                      }
                      if (line.startsWith("*   **") || line.startsWith("-   **")) {
                        const content = line.replace(/^\*\s+|\-\s+/, "");
                        const parts = content.split(/\*\*(.*?)\*\*/g);
                        return (
                          <p key={li} className="ml-2 mb-1 flex gap-1.5 items-start">
                            <span className="text-primary shrink-0 mt-0.5">•</span>
                            <span>{parts.map((p, pi) => pi % 2 === 1 ? <strong key={pi} className="font-extrabold text-ink">{p}</strong> : p)}</span>
                          </p>
                        );
                      }
                      if (line.match(/^\s{4}\d+\./)) {
                        return <p key={li} className="ml-6 mb-0.5 text-xs font-semibold text-sub">{line.trim()}</p>;
                      }
                      if (line.match(/^\s{4}-/)) {
                        return <p key={li} className="ml-6 mb-0.5 text-xs font-semibold text-sub flex gap-1.5"><span>–</span><span>{line.replace(/^\s+-\s*/, "")}</span></p>;
                      }
                      if (line.trim() === "") return <div key={li} className="h-2" />;
                      const boldParts = line.split(/\*\*(.*?)\*\*/g);
                      return (
                        <p key={li} className="mb-1">
                          {boldParts.map((p, pi) => pi % 2 === 1 ? <strong key={pi} className="font-extrabold text-ink">{p}</strong> : p)}
                        </p>
                      );
                    })}
                  </div>
                )}
                
                {/* Embedded Schemes Cards */}
                {m.schemes && (
                  <motion.div 
                    className="mt-4 flex flex-col gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 }}
                  >
                    {m.schemes.map((s) => (
                      <Link
                        key={s.id}
                        to={`/schemes/${s.id}`}
                        className="group flex items-center justify-between rounded-2xl border border-line bg-slate-50/50 hover:bg-white p-4 text-left transition-all hover:border-primary/20 hover:shadow-md outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                      >
                        <div className="pr-4">
                          <p className="text-xs sm:text-sm font-extrabold text-ink group-hover:text-primary transition-colors leading-snug">{s.name}</p>
                          <p className="text-[11px] font-bold text-sub mt-1 line-clamp-1">{s.benefit}</p>
                        </div>
                        <div className="shrink-0 flex items-center gap-1.5">
                          <Badge tone="success" variant="tinted" dot>
                            {s.match ?? s.baseMatch}% Match
                          </Badge>
                          <ArrowRight size={13} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* User Avatar */}
              {m.role === "user" && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-secondary text-white shadow-sm">
                  <User size={16} />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing loading dots */}
        {loading && (
          <div className="flex gap-3.5 justify-start">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-sm">
              <Bot size={16} />
            </div>
            <div className="flex items-center gap-1.5 bg-white border border-line/60 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm">
              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggestion Chips */}
      {messages.length === 1 && (
        <div className="shrink-0">
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1">
            <Info size={12} /> Suggestion Starters
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            {SUGGESTIONS.map((s, idx) => (
              <motion.button
                key={idx}
                onClick={() => send(s.text)}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.08 }}
                className="flex items-center gap-2 rounded-2xl border border-line/80 bg-white hover:bg-slate-50 text-left p-3.5 text-xs sm:text-sm font-bold text-ink shadow-sm transition-all hover:border-primary/20 active:scale-98"
              >
                <span className="text-sm shrink-0">{s.icon}</span>
                <span className="line-clamp-1">{s.text}</span>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Input controls container */}
      <div className="shrink-0 flex gap-2 rounded-2xl border border-line/80 bg-white p-2.5 shadow-md shadow-slate-100 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/5 transition-all duration-200">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send(input)}
          placeholder="e.g., I am a 25yo female entrepreneur from Maharashtra seeking business loans..."
          className="w-full bg-transparent px-3 text-sm sm:text-base text-ink outline-none placeholder:text-slate-400 font-semibold"
          disabled={loading}
          aria-label="Ask YojanaSetu Assistant"
        />
        <button
          disabled={!input.trim() || loading}
          onClick={() => send(input)}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary hover:bg-primaryDark text-white transition-all disabled:opacity-30 disabled:pointer-events-none active:scale-95 shadow-sm"
          aria-label="Send message"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
