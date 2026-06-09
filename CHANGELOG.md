# Changelog

All notable changes to Emma Intelligence will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-06-08

### Added
- **v2 Major Upgrade**: Comprehensive enhancements across the entire platform.
- New Edge Functions:
  - `emma-orchestrator`: Dynamic multi-agent coordination and debate scoring.
  - `emma-causal-engine`: Advanced causal reasoning and counterfactual analysis.
  - `emma-world-model`: Persistent world state tracking and simulation. **NEW: Newtonian Physics Integration** - Classical mechanics (F=ma, gravity, kinematics, forces, collisions) for physical entities. Hybrid AI + physics simulation for accurate trajectory prediction, object dynamics, and grounding real-world interactions. **EXPANDED TO ALL PHYSICS**: Multi-domain physics engine supporting Newtonian (classical), Electromagnetism (Coulomb's law, Lorentz force, EM fields), Thermodynamics (heat transfer, energy conservation, entropy), Quantum Mechanics (probabilistic amplitudes, uncertainty principle, superposition for micro-entities), Special & General Relativity (velocity-dependent time dilation, gravitational lensing/effects at extreme scales), and Particle Physics (basic interactions, decays, conservation laws). AI intelligently selects/applies appropriate physics regime(s) or combines them (e.g., relativistic EM, quantum thermo). Comprehensive hybrid simulation for any physical scenario.
  - `emma-formal-safety`: Constitutional AI safety and formal verification layers.
  - `emma-self-improve`: Automatic prompt evolution, meta-learning from usage patterns and benchmarks.
  - `emma-autonomous-loop`: Long-horizon autonomous task execution with self-correction.
  - `emma-admin-learn`: Admin dashboard insights, learning pattern detection, and controls.
  - `emma-transfer-sensory`: Multi-modal sensory input processing (vision, audio, structured data).
- Expanded database schema support for improvement_logs, benchmark_runs, learning_patterns, prompt_evolutions, admin_insights, goals, and api_keys. World model state now includes multi-physics properties per entity.
- Enhanced multi-agent cognitive pipeline with orchestration, causal modeling, and world model integration.
- Upgraded Computer-Use Agent with better planning, error recovery, and world model context (now includes full physics simulation across domains for physical tasks).
- Polished Project IDE, Research, Voice, Artifacts, and all existing modes with improved UX, streaming performance, and cross-mode capabilities.
- Formal safety and alignment improvements.
- Comprehensive benchmarking and self-improvement infrastructure.
- Updated documentation: Major README overhaul with v2 features section, expanded Edge Functions table, new Changelog.
- Package upgrades: Renamed to `emma-intelligence`, version bumped to 1.0.0, added keywords, description, author, and license metadata.
- New dedicated enhancement branch `feature/v2-enhancements`.

### Changed
- All core features improved, upgraded, and enhanced for production readiness and deeper capabilities. World model is now a **Universal Physics Simulator**.
- Tech stack and dependencies metadata modernized.
- CI and testing infrastructure highlighted with safety and coverage checks.

### Fixed / Improved
- Better error handling, streaming (SSE), accessibility, and responsive design across the UI.
- Documentation clarity and completeness for all 20+ Edge Functions and advanced capabilities.

## [0.1.0] - Previous Release

- Initial release with core multi-agent pipeline (Builder, Critic, Skeptic, Inventor), Computer-Use via E2B, Project IDE with Monaco + GitHub integration, Deep Research, Voice Mode, Artifacts, Memory, Think/Builder modes, and foundational Edge Functions (emma-chat, emma-computer-use, emma-research, etc.).

---

**Full history available via git commits.**