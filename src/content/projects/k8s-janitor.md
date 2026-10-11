---
title: k8s-janitor
summary: Kubernetes operator that keeps namespaces clean — TTLs on everything, evidence on every kill.
period: 2023 — now
role: Author & maintainer
stack: [Rust, kubebuilder-style, Helm, CI runners]
repo: https://github.com/mustermann/k8s-janitor
updated: 2026-08-30
featured: true
---

## Why

Every long-lived cluster drifts towards junk: forgotten preview environments,
dangling PVCs, images nobody admits to. `k8s-janitor` is an operator that
applies TTLs declaratively — per namespace, per resource kind — and deletes
with an audit trail instead of vibes.

## Design decisions

- **Deletion is a two-phase handshake**: resources are marked, a grace window
  runs, and only then does the garbage-collection fire. Every step is a
  Kubernetes event, so nothing disappears silently.
- **Budgets instead of ages**: policies can say "keep the 5 most recent
  deployments" or "max 40 GB of PVCs per team" — patterns that age-based
  cleanup scripts never got right.
- **Written in Rust** on `kube-rs`: ~14 MiB image, 12 MB RSS, single static
  binary. The controller reconciles 10k objects in under 800 ms.

## In production

Running against 6 clusters (~900 nodes total) since early 2024, has reclaimed
≈ 11 TiB of PVC space so far. The `dry-run` mode is the most-used feature —
people trust it because it shows its work.