---
slug: engineering-resilient-multi-agent-systems-gateway-websockets
title: "Engineering Resilient Multi-Agent Systems: Gateway WebSockets and Guardrail Enforcement"
authors: [giacchetta]
tags: [ai-engineer, ai-agent, ai-a2a]
---
## Engineering Resilient Multi-Agent Systems: Gateway WebSockets and Guardrail Enforcement

Ripped out fragile CLI wrappers and replaced them with full-lifecycle Gateway WebSocket orchestration. Silent sub-agent drops are dead. We stress-test the architecture until it breaks, document the exact failure boundaries, and hardcode stability at the protocol level.

⚡ **Gateway WebSocket Lifecycle Architecture**

* Ditched the fire-and-forget child-process CLI execution that was silently dropping sub-agent responses.
* Engineered direct Gateway WebSocket state management (`connect` ➔ `agent` ➔ event subscription ➔ resume `runId` for final payload synthesis) for guaranteed completion tracking.

⚙️ **Fleet Parity & Network-Level A2A Delegation**

* Upgraded Coder to Phase 1 parity with Researcher: established orchestrator-only routing and unconstrained sub-agent tool execution (`exec`, `web_fetch`).
* Wired cross-agent A2A delegation: routed Researcher's reviewer to delegate code specs directly to Coder over the network (`POST http://coder:3000/a2a/tasks`).

🛡️ **Orchestrator Guardrail Enforcement**

* Hardcoded 3 deterministic control-flow rules in `main/IDENTITY.md` to kill early-termination failure modes:
* **Atomic Handoffs:** Enforced `sessions_spawn(reviewer)` and `sessions_yield` back-to-back in a single turn—zero orphaned processes.
* **Truncation Routing:** Forced raw forwarding of truncated executor output straight to review without prompt-level narrative repairs.
* **Error Handling:** Guaranteed atomic forwarding of executor error/empty states directly to the reviewer alongside the blueprint.

🔬 **Empirical Testing & Reality-Driven Limitations**

* Executed 5 rigorous end-to-end integration tests across the agent network.
* **The Hard Reality:** Proven that prompt-level negative constraints (*"FORBIDDEN FROM WRITING CODE"*) get overridden by the agent's task-completion instincts. Soft-prompting fails at scale. Opened Issues #6, #7, and #8 to move from prompt engineering to structural runtime enforcement.

Stop relying on prompt-level magic. Test the boundaries, log the failures, and enforce control at the runtime layer. On to structural enforcement. 💥