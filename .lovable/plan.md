

## Plan: Remove HITL & Fix Agent Layout

### 1. Remove HITL functionality
- Delete `SENSITIVE_ACTIONS`, `HIGH_RISK_PATTERNS`, `assessRisk`, `pendingApproval` state, `approvalResolverRef`, `waitForApproval`, `handleApproval`, `getRiskBadge`
- Remove the HITL approval banner (lines 528-553)
- Remove the risk assessment and approval gate in `runAgentLoop` (lines 336-355) so actions execute immediately
- Remove `ShieldAlert` import and the "HITL Active" indicator in the reasoning panel header
- Remove `awaiting_approval` status styling and references
- Update subtitle text to remove HITL mention

### 2. Fix reasoning panel scrollbar & layout
- The right panel already has `flex-1 min-h-0 overflow-y-auto` which should work, but the parent `ResizablePanelGroup` needs the panel to fully constrain height
- Ensure `ResizablePanel` for reasoning has `overflow-hidden` so the inner flex layout can properly constrain and scroll
- The desktop view panel (left) already uses `min-h-0` — confirm no extra spacing is introduced

### Files changed
- `src/components/ComputerUseAgent.tsx` — all changes in this single file

