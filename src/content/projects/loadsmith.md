---
cover: ../../assets/covers/loadsmith.svg
coverAlt: "Replayed traffic curve drawn as neon bars"
title: loadsmith
summary: Distributed load-testing tool that replays production traffic against staging clusters.
period: 2024 — now
role: Author & maintainer
stack: [Go, gRPC, NATS, Prometheus]
repo: https://github.com/mustermann/loadsmith
updated: 2026-09-14
featured: true
---

## Why

Staging environments never fail the way production does. `loadsmith` records
live traffic from an ingress (OpenTelemetry tap or Envoy access logs), then
replays it with realistic concurrency curves against any target — so a
migration rehearsal looks like Tuesday, not like a tutorial.

## How it fits together

```mermaid alt="Traffic flows from the ingress tap into a capture store and is replayed against staging"
flowchart LR
  ingress[Ingress tap] --> capture[Capture]
  capture --> store[(Object storage)]
  store --> coord{Coordinator}
  coord -->|schedule| workers[Workers]
  workers --> target[Staging cluster]
  target --> report[Prometheus report]
```

## Highlights

- **Traffic replay** with rate-preserving schedules: diurnal curves, spikes,
  and step functions are captured from real data instead of being guessed.
- **Session integrity** — correlated requests stay correlated across workers,
  so caches, shopping carts and OAuth flows behave like the real thing.
- **Cheap to run**: a single 4-vCPU coordinator drives 40k concurrent logical
  users via preallocated goroutine pools. No runtime GC surprises.
- **Prometheus-first** reporting; Grafana dashboard ships in the repo.

## Numbers from a real rehearsal

- 12.4M requests replayed in a 2h window, 0 dropped sessions
- found a connection-pool starvation bug that synthetic tests missed
- adopted by 3 teams as standard pre-migration check

## Status

Used in anger at two companies. Contributions welcome — good first issues
are labelled `help-wanted`; the architecture decision records live in `docs/adr/`.