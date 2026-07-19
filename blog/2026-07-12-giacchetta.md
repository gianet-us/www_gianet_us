---
slug: dual-process-containers-apicurio-discovery
title: "Dual-Process Containers & Dynamic Agent Discovery"
authors: [giacchetta]
tags: [ai-engineer, ai-agent, ai-a2a]
---
## Dual-Process Containers & Dynamic Agent Discovery

🍝 Hardcoding peer-to-peer IPs in a multi-agent network creates unmanageable spaghetti code.

We eliminated static routing entirely this week and forced our agent containers to pull double duty. We deployed an in-memory Apicurio Registry (apicurio-registry-mem:2.4.14.Final) to act as the centralized nervous system for service discovery.

🛠️ Here is the mechanical reality of the container runtimes:

- ⚙️ PM2 as PID 1: We abandoned single-process containers. PM2 now manages two simultaneous processes per container: the a2a-bridge (our Express HTTP server) and the openclaw-gateway.

- 🪲 Crushing the npx Bug: We sidestepped a known PM2 argument-stripping bug by routing the OpenClaw Gateway invocation strictly through npx (npx openclaw gateway run).

- 📡 Automated Registration: At boot, the A2A Express Bridge pauses for a 5-second health buffer, then automatically pushes an Agent Card (/.well-known/agent.json) to Apicurio.

🌐 Every container now independently broadcasts its role, supported protocols (A2A, JSON-RPC 2.0), and endpoint to the openclaw-net network.

Dynamic discovery is online.
