

## Root Cause Analysis (Definitive)

I read the **official E2B Desktop SDK source code** (`@e2b/desktop` on GitHub) and compared it line-by-line with our edge function. The black screen is caused by **multiple critical deviations** from how E2B expects the desktop to be initialized.

### What the official SDK does vs what we do

```text
STEP              SDK (_start method)                   OUR CODE (kickstartDesktop)
─────────────     ──────────────────────                 ─────────────────────────────
Xvfb flags        -retro -dpi 96 -nolisten tcp/unix     -ac only
Xvfb verify       xdpyinfo -display :0 (polls)          test -S /tmp/.X11-unix/X0
XFCE start        startxfce4 (background, timeoutMs:0)  nohup bash -lc 'dbus-launch --exit-with-session startxfce4' (complex chain)
WM check          ps aux | grep PID                     pgrep -f xfce4-session (matches grep itself!)
DISPLAY env       Set at sandbox creation via envs       Never set, only passed per-command
Screenshot        scrot --pointer /tmp/screenshot-X.png  scrot /tmp/screenshot.png --overwrite
Mouse/keyboard    xdotool                                pyautogui (requires separate Python + pip)
Live view         x11vnc + noVNC on port 6080            None (streamUrl always null)
```

### Why the screen stays black

1. **False positive process detection**: `pgrep -f xfce4-session` matches the bash wrapper process or itself, so it always reports "wm-already-running" even if XFCE never actually started rendering.
2. **XFCE startup chain is broken**: The `nohup bash -lc 'dbus-launch --exit-with-session startxfce4'` chain is unreliable — `bash -lc` sources login profiles that may block, and the `exec` inside nohup can silently fail.
3. **Missing Xvfb flags**: Without `-retro`, the Xvfb framebuffer may not initialize properly for screenshot capture.
4. **No DISPLAY in sandbox environment**: Unlike the SDK which passes `DISPLAY=:0` at sandbox creation, our code only sets it per-command — XFCE's child processes may not inherit it.
5. **`pyautogui` may not be installed**: The desktop template has `xdotool` pre-installed but not necessarily Python's pyautogui package.

---

## Implementation Plan

### 1. Align `kickstartDesktop()` with the official SDK exactly

Rewrite to match the SDK's `_start()` method:

- **Xvfb**: Start with `-ac -screen 0 1024x768x24 -retro -dpi 96 -nolisten tcp -nolisten unix` flags, run in background
- **Verify display**: Use `xdpyinfo -display :0` in a polling loop (up to 10s), not socket file check
- **Start XFCE**: Run just `DISPLAY=:0 startxfce4` as a background command — no nohup/bash-lc/dbus-launch wrapper
- **Track XFCE PID**: Store PID and check with `ps aux | grep PID` (like SDK does) instead of loose `pgrep -f`

### 2. Set `DISPLAY=:0` at sandbox creation

Pass `DISPLAY: ":0"` in the `envs` field of the `createSandbox` POST body, matching the SDK's behavior.

### 3. Switch from `pyautogui` to `xdotool`

Replace all `execute` action handlers:
- `click` → `xdotool mousemove --sync X Y && xdotool click 1`
- `double_click` → `xdotool mousemove --sync X Y && xdotool click --repeat 2 1`
- `type` → `xdotool type --delay 20 "text"` (chunked for long strings)
- `hotkey` → `xdotool key ctrl+a` etc
- `scroll` → `xdotool click --repeat N 4/5`

This eliminates the Python dependency and matches the SDK.

### 4. Add VNC live streaming

Implement what the SDK's `VNCServer` class does:
- Start `x11vnc` on port 5900 against DISPLAY=:0
- Start noVNC proxy on port 6080
- Return the stream URL: `https://6080-{sandboxId}.e2b.app/vnc.html?autoconnect=true&resize=scale`
- Set `streamUrl` in the `start_session` response so the frontend shows a live iframe instead of polling screenshots

### 5. Fix screenshot to match SDK

Use `scrot --pointer /tmp/screenshot-{random}.png` (with `--pointer` flag and unique filenames) instead of `--overwrite`.

### 6. Improve `getDesktopStage()` verification

- Use `xdpyinfo -display :0` for display check (not just pgrep)
- Use `xdotool getwindowfocus` to verify a window is actually visible (not just process detection)
- These are the same checks the SDK uses

### 7. Update frontend for live stream

- When `streamUrl` is returned, show the VNC iframe immediately — no screenshot polling needed
- Keep screenshot-based approach as fallback when VNC isn't available
- The VNC view is interactive, so users can also watch in real-time

---

### Files to update

- `supabase/functions/emma-computer-use/index.ts` — all backend changes
- `src/components/ComputerUseAgent.tsx` — VNC stream display, minor adjustments

### Expected outcome

- Desktop renders within 10-15 seconds (matching SDK behavior)
- Live VNC stream visible in the UI immediately
- No more "black screen" loops — xdpyinfo + xdotool getwindowfocus confirm actual rendering
- Mouse/keyboard actions work reliably via xdotool
- If boot fails, the failure reason is precise (e.g., "xdpyinfo failed after 10s" vs "wm-already-running but no visible windows")

