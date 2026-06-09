import { MessageSquare, Search, FileCode2, Mic, Wrench, Brain, Database, BarChart3, FolderKanban, Monitor } from "lucide-react";
import { motion } from "framer-motion";
import type { EmmaMode } from "@/lib/emma-stream";

const MODES: { id: EmmaMode; label: string; icon: React.ElementType; desc: string }[] = [
  { id: "chat", label: "Chat", icon: MessageSquare, desc: "General assistant" },
  { id: "research", label: "Research", icon: Search, desc: "Deep research with citations" },
  { id: "artifacts", label: "Artifacts", icon: FileCode2, desc: "Create & edit documents" },
  { id: "think", label: "Think", icon: Brain, desc: "Planning & reasoning" },
  { id: "builder", label: "Builder", icon: Wrench, desc: "Autonomous tasks" },
  { id: "agent", label: "Agent", icon: Monitor, desc: "Computer-use agent with virtual OS" },
  { id: "projects", label: "Projects", icon: FolderKanban, desc: "IDE & source control" },
  { id: "voice", label: "Voice", icon: Mic, desc: "Live conversation" },
  { id: "data", label: "Data", icon: BarChart3, desc: "Analyze files & data" },
  { id: "memory", label: "Memory", icon: Database, desc: "Context & recall" },
];

interface ModeSwitcherProps {
  mode: EmmaMode;
  onChange: (mode: EmmaMode) => void;
  compact?: boolean;
}

export function ModeSwitcher({ mode, onChange, compact = false }: ModeSwitcherProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-0.5 overflow-x-auto pb-1">
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => onChange(m.id)}
            title={`${m.label}: ${m.desc}`}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${mode === m.id ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"}`}
          >
            <m.icon className="h-3.5 w-3.5" />
            {m.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 p-1 bg-secondary/40 rounded-2xl border border-border/50">
      {MODES.map((m) => {
        const isActive = mode === m.id;
        return (
          <button
            key={m.id}
            onClick={() => onChange(m.id)}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <m.icon className="h-4 w-4" />
            {m.label}
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-primary rounded-xl -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
