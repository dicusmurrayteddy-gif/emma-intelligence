

# Emma ASI/AGI Feature Audit & Plan to 100%

## Current Completion by Feature Category

### 1. Core Chat Interface — 85%
**Done:** Streaming AI chat, markdown rendering, dark mode, split-pane layout, sidebar, welcome screen, suggestion cards, auto-scroll
**Missing:**
- File attachment button exists but does nothing (no upload logic)
- No syntax highlighting in code blocks (rehype-highlight not wired)
- No "Open in Editor" button on code blocks to send code to Monaco panel
- No conversation rename UI (hook exists but no inline editing)

### 2. Authentication & Persistence — 90%
**Done:** Email/password login + signup, session management, RLS on conversations/messages, profiles table with trigger, persistent message history
**Missing:**
- No email verification flow guidance
- No password reset page
- No OAuth providers (Google, GitHub)

### 3. IDE / Code Editor — 40%
**Done:** Monaco editor with tabs, multi-file support, syntax highlighting, vs-dark theme
**Missing:**
- No connection between chat code blocks → editor ("Open in Editor" button)
- No sandboxed code execution (needs E2B API)
- No terminal output panel
- No live preview iframe
- No "Fix this error" loop
- No file persistence (files lost on refresh)

### 4. Agent Swarm — 35%
**Done:** 6 agent cards with status indicators, animated cycling during processing, swarm log
**Missing:**
- Purely cosmetic — no real agent routing or specialized system prompts
- No Director → sub-agent task delegation logic
- No self-improvement / post-task review
- No autonomous long-running workflows
- No real task planning with approval checkpoints

### 5. Image Generation — 75%
**Done:** Edge function using Gemini image model, `/image` command detection, inline display, download button
**Missing:**
- No image editing/variation capabilities
- No image understanding (upload image → describe)
- No gallery/history of generated images

### 6. Video Generation — 0%
**Missing:** Everything. Needs external API (Kling/Runway/Luma), edge function, scene stitching, upload/edit flow

### 7. Audio / Voice — 25%
**Done:** Speech-to-text input via Web Speech API, mic toggle button
**Missing:**
- No text-to-speech output (needs ElevenLabs or browser TTS)
- No voice cloning
- No music generation (needs Suno API)
- No speaker button on messages

### 8. File & GitHub Integration — 5%
**Done:** Paperclip button exists in UI (non-functional)
**Missing:**
- No file upload to storage
- No file understanding / RAG
- No GitHub integration (clone, PR, issues, search)
- No drag-and-drop

### 9. Search & Memory — 10%
**Done:** Conversations and messages persist in DB
**Missing:**
- No vector embeddings / semantic search
- No web search (needs Perplexity)
- No knowledge graph visualization
- No RAG pipeline
- No cross-conversation memory

### 10. Dashboard & Analytics — 45%
**Done:** Dashboard page with conversation/message counts, mock token usage chart, agent list, capabilities list
**Missing:**
- Real token usage tracking (not mock data)
- No predictive analytics
- No Jupyter-style notebooks
- No project velocity tracking
- No cost curves

### 11. Conversation Branching — 80%
**Done:** Branch button on messages, creates new conversation with copied messages, visual toast feedback
**Missing:**
- No visual branch indicator in sidebar (tree view)
- No merge capability

### 12. Multi-User / RBAC — 0%
**Missing:** No organizations table, no role system, no shared workspaces

### 13. Integrations (Notion, Slack, Linear, SQL) — 0%
**Missing:** Everything

### 14. Computer Use / Desktop Control — 0%
**Missing:** Everything (needs Browserbase/Anthropic API)

### 15. Custom Tool Builder — 0%
**Missing:** Everything

### 16. Sidebar "Agents" Link — BUG (404)
The sidebar links to `/agents` but no route exists. Needs to either remove the link or add a route.

---

## Summary Table

| Feature | Current | Achievable in Lovable |
|---|---|---|
| Core Chat | 85% | 100% |
| Auth & Persistence | 90% | 95% (no OAuth without connector) |
| IDE / Code Editor | 40% | 70% (no execution without E2B) |
| Agent Swarm | 35% | 65% (UI + prompt routing, no true autonomy) |
| Image Generation | 75% | 90% |
| Video Generation | 0% | 10% (UI scaffold only) |
| Audio / Voice | 25% | 50% (browser TTS, no cloning/music) |
| File & GitHub | 5% | 40% (upload + storage, GitHub needs API key) |
| Search & Memory | 10% | 30% (basic search, no vector DB) |
| Dashboard | 45% | 75% (real stats, charts, no notebooks) |
| Conversation Branching | 80% | 95% |
| Multi-User / RBAC | 0% | 60% (DB + RLS, no full workspace UI) |
| Integrations | 0% | 10% (scaffolding) |
| Computer Use | 0% | 0% (external API only) |
| Tool Builder | 0% | 30% (UI scaffold) |

---

## Plan to Maximize All Categories

### Step 1: Fix 404 Bug + Quick Wins (Chat → 100%, Branching → 95%)
- Remove `/agents` sidebar link OR add `/agents` route that renders agent swarm full-page
- Add `rehype-highlight` to ChatMessage for syntax-highlighted code blocks
- Add "Open in Editor" button on code blocks that sends content to CodeEditor
- Add inline conversation rename in sidebar (double-click title)
- Add branch indicator icon on branched conversations in sidebar

### Step 2: File Upload & Understanding (File → 40%)
- Create Supabase storage bucket `chat-uploads`
- Wire Paperclip button → file picker → upload to storage → send URL to AI with prompt "Analyze this file"
- Support drag-and-drop on chat area
- Display uploaded files inline in chat

### Step 3: Enhanced IDE Panel (IDE → 70%)
- Bidirectional code block ↔ editor integration
- Add terminal-style output panel (display-only, shows AI responses about code)
- Add "Run" button UI that shows "Code execution requires E2B API key" prompt
- Persist editor files in localStorage

### Step 4: Smart Agent Routing (Agents → 65%)
- Create dedicated `/agents` page with full agent swarm view
- Route different query types to different system prompts (code questions → Coder prompt, research → Researcher prompt)
- Add agent selection dropdown in chat input
- Post-task summary card showing which "agents" contributed

### Step 5: Voice Output + Browser TTS (Voice → 50%)
- Add browser-native `speechSynthesis` TTS on assistant messages (speaker button)
- Voice mode toggle that auto-reads responses
- No API key required for basic TTS

### Step 6: Dashboard + Real Analytics (Dashboard → 75%)
- Track actual token estimates per message (word count * 1.3)
- Store token counts in message metadata
- Replace mock data with real aggregated queries
- Add message-per-day chart with real data
- Add conversation length distribution

### Step 7: Image Generation Polish (Image → 90%)
- Add image understanding: upload image → AI describes/analyzes it
- Add image variation: "Edit this image" with follow-up prompt
- Gallery view of all generated images

### Step 8: Database for RBAC Scaffold (RBAC → 30%)
- Create `organizations` and `org_members` tables
- Add `user_roles` table per Lovable guidelines
- RLS policies for org-scoped data
- UI: settings page showing org membership (no invite flow yet)

### Step 9: API Scaffolding for External Services
- Create edge function stubs for: E2B execution, web search, GitHub operations
- Each returns clear "API key not configured" message
- Settings page showing integration status and instructions
- Ready to wire up when user adds API keys

### Technical Details

**Files to create/modify (~20 files):**
- New: `src/pages/Agents.tsx`, `src/pages/Settings.tsx`, `src/components/FileUpload.tsx`, `src/components/CodeBlockActions.tsx`, `src/components/VoiceOutput.tsx`
- New edge functions: `supabase/functions/emma-web-search/index.ts` (stub), `supabase/functions/emma-code-exec/index.ts` (stub)
- Modified: `App.tsx` (add routes), `EmmaSidebar.tsx` (fix /agents, add rename), `ChatMessage.tsx` (code block actions, TTS button), `ChatInput.tsx` (file upload), `CodeEditor.tsx` (receive from chat), `RightPanel.tsx` (terminal tab), `Dashboard.tsx` (real data), `Index.tsx` (file upload handling)
- Migration: `organizations`, `org_members`, `user_roles` tables, storage bucket

**Dependencies:** `rehype-highlight`, `highlight.js` (for code block styling)

