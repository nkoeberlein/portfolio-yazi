---
title: Rust in a Go shop — a field report
summary: Two years of shipping Rust services next to a Go fleet. Where it paid off, where it didn't, and the hiring math nobody expects.
published: 2025-11-02
tags: [rust, go, engineering-culture]
---

We added Rust to a 40-service Go fleet and expected friction. We got friction —
just not where the blog posts said it would be.

## Where Rust paid off immediately

- **The proxy/border layer.** Our traffic recorder needed predictable p99 on
  allocation-heavy paths. Rewrite took 6 weeks; GC-pause tail risk on the
  ingress went to zero. This is Rust's honest use case: not "faster", but
  "provably no GC tail".
- **Anything parsing untrusted input.** The borrow checker made the unsafe
  class of bugs — use-after-free on shared buffers, index panic under load —
  a compile error instead of a quarterly incident.

## Where it was not worth it

- **CRUD services.** A Postgres-backed API with 15 endpoints is faster to
  write in Go, faster to onboard into, and nobody has ever paid us for the
  memory savings of a request handler.
- **The glue layer.** Half the value of Go is that any engineer can read any
  file. Rust code needs deliberate design review culture, or it becomes very
  beautiful very private code.

## The hiring math nobody expects

We feared a Rust hiring gap. Reality: 3 strong hires came *because* of Rust
(people self-select toward systems work), and Go engineers picked it up in
about 6 weeks for service-shaped code. The real cost was not hiring — it was
**review bandwidth**: Rust PRs from juniors need a patient senior, and you
only have as much Rust review capacity as you have Rust seniors.

## Rules we ended up with

1. Rust for border services, parsers, and latency-critical paths.
2. Go for business logic and CRUD.
3. A service in Rust needs at least 2 Rust owners — one is a bus factor,
   zero is a museum.
4. Every new service defaults to Go; choosing Rust requires naming the
   latency or safety budget it is buying.

Not a war, just a toolbox with a second drawer.