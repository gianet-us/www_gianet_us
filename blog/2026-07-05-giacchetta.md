---
slug: virtualizing-agent-fleet-tart-podman
title: "Virtualizing the Agent Fleet: Tart, Fedora, and Rootless Podman"
authors: [giacchetta]
tags: [ai-engineer, ai-agent, ai-a2a]
---
## Virtualizing the Agent Fleet: Tart, Fedora, and Rootless Podman

🛑 We don't tolerate "it works on my machine" in autonomous AI deployment.

This week, we architected a bulletproof, containerized virtualization pipeline for the OpenClaw network. We bypassed standard Docker Desktop bloat and went straight to the metal. 🤘

👇 Here is the exact infrastructure stack we locked into place:

- 🖥️ The Hypervisor Layer: A macOS host running a dedicated Fedora VM via the Tart hypervisor (poc-openclaw-01).

- 🐳 Rootless Containerization: Deployed a shared openclaw-net bridge using Podman and podman-compose within the Fedora VM for complete service isolation.

- 📂 VirtioFS Mounts & SELinux: We mounted the local macOS workspace directly into the containers at /app using VirtioFS. To survive VirtioFS shadowing our dependencies, we forced global installs of OpenClaw and Express on a `node:24-trixie-slim` image and pointed the `NODE_PATH` environment variable directly to `/usr/local/lib/node_modules`.

- 🔓 Permissions Bypass: We globally shifted the Fedora VM's SELinux to Permissive mode to cleanly bypass container labeling conflicts during this PoC phase.

⚡ Any change to the agent configuration files on the host instantly hits the running containers without a single image rebuild.

This is how you build a resilient, developer-hostile-proof foundation.
