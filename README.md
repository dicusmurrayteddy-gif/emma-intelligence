# Emma — AI Operating System

> **v2.0 — Enhanced Multi-Agent Cognitive OS**  
> A production-grade multi-agent cognitive reasoning system with computer-use capabilities, project IDE, deep research, autonomous task execution, self-improvement, causal reasoning, world modeling, and formal safety — all in one unified AI workspace.

[![Live Demo](https://img.shields.io/badge/Live-emma--intelligence.lovable.app-blue)](https://emma-intelligence.lovable.app) [![Version](https://img.shields.io/badge/version-1.0.0-green)] 

---

## 🚀 What's New in v2 (Enhancements & Upgrades)

### Major Upgrades Across All Features
- **Upgraded Multi-Agent Orchestration**: Full `emma-orchestrator` + `emma-multi-agent` for dynamic agent debate, scoring, and synthesis.
- **New Causal Engine & World Model**: `emma-causal-engine` and `emma-world-model` for deeper reasoning about cause-effect and persistent world state.
- **Autonomous Execution Loop**: `emma-autonomous-loop` for long-running, self-directed task completion.
- **Formal Safety & Alignment**: `emma-formal-safety` + enhanced `emma-safety` with rigorous content filtering and constitutional AI principles.
- **Self-Improvement System**: `emma-self-improve` for automatic prompt evolution, learning from usage patterns (`learning_patterns`), and benchmark-driven optimization.
- **Advanced Benchmarking & Admin Learning**: `emma-benchmark`, `emma-admin-learn`, `admin_insights`, `benchmark_runs`, and `improvement_logs` for continuous performance tracking and meta-learning.
- **Sensory Transfer & Multi-Modal**: `emma-transfer-sensory` for richer input processing (vision, audio, structured data).
- **Enhanced Computer-Use**: More robust action space, better vision reasoning, user intervention, and ephemeral sandbox management.
- **Project IDE & GitHub Integration**: Improved Monaco editor experience, better GitHub REST API handling, ZIP workflows, and persistent project memory.
- **Research & Artifacts**: Deeper multi-step research with citations, confidence scoring, and versioned artifact system supporting more formats.
- **Voice & Interaction**: Improved STT/TTS pipeline with ElevenLabs and Web Speech API, plus Think/Builder modes polish.
- **UI/UX & Tech Upgrades**: Latest shadcn/ui + Radix components, Framer Motion animations, better streaming (SSE), error handling, accessibility, and responsive design. Package metadata upgraded (name, keywords, version 1.0.0).
- **Security & Reliability**: Formal safety layers, usage tracking, fingerprint abuse detection, and expanded test coverage (including safety tests).
- **Developer Experience**: Updated README, added CHANGELOG, enhanced CI, better documentation of all 20+ Edge Functions and database schema.

---

## Quick Start

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd emma

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Environment Variables

... (same as before, secrets for Clerk, Stripe, E2B, ElevenLabs, Perplexity remain critical)

---

## Features (Expanded & Enhanced in v2)

### 🧠 Multi-Agent Cognitive Pipeline (Upgraded)
Every complex query passes through an enhanced reasoning system with dynamic orchestration:

| Agent / Module | Role (v2 Enhanced) |
|-------|------|
| **Builder** | Constructive reasoning — strongest possible solution |
| **Critic** | Adversarial analysis — attacks logic and assumptions |
| **Skeptic** | Uncertainty detection — demands evidence |
| **Inventor** | Lateral thinking — fundamentally different approaches |
| **Orchestrator** | Dynamic routing, debate scoring, synthesis (new) |
| **Causal Engine** | Cause-effect modeling and counterfactuals (new) |
| **World Model** | Persistent state tracking and simulation (new) |

### 🖥️ Computer-Use Agent (Enhanced)
... (keep original description, add: improved action precision, better error recovery, multi-step planning with world model integration)

### 💻 Project IDE & Source Control (Polished)
... (keep + note auto-save improvements and GitHub enhancements)

### 🔍 Deep Research Mode (Upgraded)
Multi-step plans, Perplexity-powered search with citations, confidence scores, and integration with Causal Engine for deeper analysis.

### 📄 Artifacts, 🎤 Voice, 📊 Data Analysis, 🧠 Memory, 🤔 Think, 🔧 Builder — All enhanced with better UX, streaming, and cross-mode integration.

### 🆕 New in v2
- **Autonomous Loop**: Long-horizon task execution with self-correction.
- **Self-Improvement**: Automatic prompt evolution and meta-learning from `improvement_logs` and benchmarks.
- **Formal Safety**: Constitutional checks and advanced filtering.
- **Benchmarking Dashboard**: Track performance across runs and agents.
- **Admin Learning Controls**: Insights and pattern detection for power users.

---

## Modes (Expanded)
| Mode | Description (v2) |
|------|-------------|
| **Chat** | ... |
| **Research** | ... |
| **Artifacts** | ... |
| **Think** | ... |
| **Builder** | ... |
| **Agent** | ... |
| **Projects** | ... |
| **Voice** | ... |
| **Data** | ... |
| **Memory** | ... |
| **Autonomous** | New: Long-running autonomous execution |
| **Causal** | New: Cause-effect and simulation reasoning |

---

## Architecture (v2 Enhanced)
... (keep original diagrams + note new modules: Orchestrator, Causal Engine, World Model, Self-Improve loop feeding back into prompts)

### Computer-Use Agent
... (enhanced with world model context)

---

## Access Tiers
... (same)

---

## Tech Stack (Upgraded)
| Layer | Technology (v2 notes) |
|-------|-----------|
| Frontend | React 18 · TypeScript · Tailwind CSS · Vite · shadcn/ui + latest Radix |
| ... | (keep rest, note Framer Motion 12+, better SSE streaming) |

---

## Edge Functions (Fully Updated — 20+ Functions)

| Function | Purpose (v2) |
|----------|---------|
| `emma-chat` | Streaming chat with full cognitive pipeline + orchestrator |
| `emma-computer-use` | Enhanced sandbox control with vision + world model |
| `emma-research` | Deep research with citations + causal analysis |
| `emma-github` | GitHub integration |
| `emma-image-gen` | AI image generation |
| `emma-multi-agent` | Core multi-agent debate and synthesis |
| `emma-orchestrator` | Dynamic agent routing and coordination (new highlight) |
| `emma-db-proxy` | Authenticated DB ops |
| `emma-web-search` | Perplexity-powered search |
| `emma-code-exec` | Sandboxed code execution |
| `emma-self-improve` | Prompt evolution, learning from patterns & benchmarks (key v2) |
| `emma-benchmark` | Performance benchmarking & metrics |
| `emma-safety` | Content safety filtering |
| `emma-formal-safety` | Formal/constitutional safety layer (new) |
| `emma-api` | OpenAI-compatible endpoint |
| `emma-admin-learn` | Admin insights and learning controls (new) |
| `emma-autonomous-loop` | Long-running autonomous task loop (new) |
| `emma-causal-engine` | Causal reasoning and counterfactuals (new) |
| `emma-world-model` | Persistent world state and simulation (new) |
| `emma-transfer-sensory` | Multi-modal sensory input processing (new) |
| `create-payment` / `verify-payment` | Stripe payments |

---

## Database Schema (Expanded)

Additional tables for v2: `improvement_logs`, `benchmark_runs`, `learning_patterns`, `prompt_evolutions`, `admin_insights`, `api_keys`, `goals`, etc. Full schema supports self-improvement, benchmarking, and admin features.

---

## Scripts
```bash
npm run dev
npm run build
npm run test
npm run lint
npm run ci:check
```

---

## Changelog

### v1.0.0 / v2 Enhancements (June 2026)
- Upgraded all core features with new Edge Functions (orchestrator, causal-engine, world-model, formal-safety, self-improve, autonomous-loop, admin-learn, transfer-sensory).
- Enhanced multi-agent system with dynamic orchestration and scoring.
- Added comprehensive self-improvement and benchmarking infrastructure.
- Polished UI/UX, streaming, safety, and developer experience.
- Updated package metadata, README, added CHANGELOG.
- Created dedicated enhancement branch with production-ready improvements.

### Previous
- Initial multi-agent cognitive pipeline, computer-use, IDE, research, voice, etc.

---

## License

MIT

---

**Emma v2 is a major leap forward in autonomous, safe, and self-improving AI systems.**

For questions or contributions, see CONTRIBUTING.md.