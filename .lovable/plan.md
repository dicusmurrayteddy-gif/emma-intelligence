

# Make Emma an Amazing Cybersecurity Tool

A focused upgrade plan that turns the existing Computer-Use Agent + report flow into a real pentesting / bug-bounty platform — without touching chat, projects, research, or other modes.

## Goals
- Treat every run as a structured **engagement** with scope, evidence, and findings
- Force the agent to behave **ethically** (in-scope only, non-destructive)
- Produce **professional, exportable** reports the user can submit to HackerOne / Bugcrowd
- Keep all changes scoped to `ComputerUseAgent.tsx`, `emma-computer-use` edge function, and a few new files. Other modes untouched.

---

## 1. Engagement Setup (Scope + Rules of Engagement)

Before the agent runs, collect:
- **Target scope**: allowed domains/IPs (multi-line), out-of-scope list
- **Engagement type**: Bug bounty, Authorized pentest, CTF, Personal target
- **Authorization checkbox**: "I have written permission to test these targets"
- **Severity focus**: OWASP Top 10, API, Auth, IDOR, XSS, SSRF, etc.
- **Test intensity**: Passive recon / Active probing / Exploitation PoC

Stored on the engagement and embedded in the agent's system prompt + report header.

## 2. Scope-Enforcement Guardrails (edge function)

In `emma-computer-use/index.ts`:
- New `scopeAllowed(url, scope)` helper validating every `open_url` action against the allowed domains
- If the agent tries to navigate out-of-scope: **block the action**, return a `scope_violation` decision, and add it to the report as a guardrail event
- Add to the system prompt: "You MUST refuse destructive actions (DROP, DELETE, mass email, real payments). Only proof-of-concept payloads."
- Reject keystrokes containing obvious destructive payloads unless `allowExploitation` was checked

## 3. Structured Findings Model (replaces "errors = findings")

New `Finding` type tracked separately from `AgentStep`:
```
{ id, title, severity (Critical/High/Medium/Low/Info),
  category (XSS/IDOR/Auth/...), cvssVector?, cvssScore?,
  affectedUrl, description, reproductionSteps[],
  evidenceFrameIds[], request?/response?, remediation }
```

The agent gets a new action `report_finding` it can call mid-run. The reasoning JSON schema gets a `finding?` field. Findings appear in a dedicated UI panel and in the PDF.

## 4. CVSS + Severity Auto-Calculation

- Lightweight CVSS 3.1 base-score calculator (pure TS file `src/lib/cvss.ts`)
- AI is prompted to fill the vector (AV/AC/PR/UI/S/C/I/A); we compute the score and severity label
- Color-coded badges in report (Critical = red, High = orange, etc.)

## 5. Recon Toolbox (sandbox-side)

The E2B desktop already has a shell. Expose passive/active recon as first-class actions the AI can request:
- `dns_lookup`, `whois`, `http_headers`, `tech_fingerprint` (Wappalyzer-style header sniff), `robots_txt`, `sitemap_fetch`
- `port_scan_top100` (only if engagement type ≠ bug bounty — many programs forbid scanning)
- Each result becomes a timestamped artifact attached to the finding

Implemented as new cases in the edge function `execute` switch, running curl/dig/nmap inside the sandbox.

## 6. HTTP Request/Response Capture

Add a Burp-like proxy view by:
- Letting the AI request `http_capture { url, method, headers, body }` via curl in the sandbox
- Storing the full request + response pair as evidence on the finding
- Rendered as collapsible code blocks in the PDF (already supported by `mdToHtml`)

## 7. Evidence Improvements

- **Hash every screenshot** (SHA-256) and include the hash in the report — proves frames weren't tampered with
- **Sign the report** with a generation timestamp + agent-version footer
- **Frame-to-finding linking**: each finding shows the exact video timestamp(s) — clicking jumps the embedded `<video>` to that moment via `?t=` fragment

## 8. Report Upgrades (HTML/PDF)

Extend `downloadBugBountyReport`:
- New sections: **Engagement Summary**, **Scope**, **Methodology**, **Findings (sorted by severity)**, **Recon Data**, **Timeline**, **Appendix: All Steps**, **Evidence Integrity (hashes)**
- Severity-ordered finding cards with CVSS badge, affected URL, repro steps, remediation
- "Submit-ready" toggle that strips internal reasoning and keeps only finding-relevant content
- Export options: HTML+PDF (current), **Markdown** (for HackerOne), **JSON** (for tooling)

## 9. Persistence (Lovable Cloud)

New tables (RLS, owner-scoped):
- `engagements` (id, user_id, name, scope, rules, started_at, ended_at, status)
- `findings` (id, engagement_id, severity, category, cvss, …)
- `evidence_frames` (id, finding_id, base64_storage_path, sha256, captured_at, reasoning)

Lets users resume past engagements, build a history, and track which findings were submitted.

## 10. Safety Switches (UI)

In the agent panel header:
- **"In-Scope Only" lock** (default ON) — disables the action if violated
- **"PoC Only — No Exploitation"** toggle
- **Big red Stop & Wipe** button — destroys sandbox and clears local frames immediately

---

## Files Affected
- `src/components/ComputerUseAgent.tsx` — engagement form, findings panel, severity badges, report v2, safety toggles
- `supabase/functions/emma-computer-use/index.ts` — scope guard, recon actions, http_capture, finding-aware prompt, structured decision schema
- `src/lib/cvss.ts` (new) — CVSS 3.1 calculator
- `src/lib/scope.ts` (new) — URL scope matcher
- `src/lib/report-export.ts` (new) — HTML/PDF/Markdown/JSON exporters
- New migration: `engagements`, `findings`, `evidence_frames` tables with RLS

## Out of Scope (won't touch)
Chat, Projects IDE, Research, Voice, Memory, Auth, Paywall, Index layout — all untouched.

## Suggested Build Order
1. Engagement form + scope guardrails + safety toggles (foundation)
2. Findings model + `report_finding` action + UI panel
3. CVSS calculator + severity-styled report
4. Recon toolbox + HTTP capture
5. Persistence (DB tables) + history view
6. Markdown/JSON exports + evidence hashing

Pick a starting slice and approve, and I'll implement it.

