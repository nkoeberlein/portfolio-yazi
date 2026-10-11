---
cover: ../../assets/covers/taming-the-tail.svg
coverAlt: "Latency histogram with a long tail and a p99 marker"
title: "Taming the tail — 12 s to 400 ms p99 on a checkout flow"
summary: "A war story about killing tail latency: queueing theory, budget arithmetic, and the three fixes that actually mattered."
published: 2026-03-10
tags: [performance, distributed-systems, postmortem]
---

Our checkout p99 was 12 seconds. The median was 180 ms. That spread is not a
slow server; that is a queueing problem. Here is how we got p99 to 400 ms —
and which promising ideas did nothing at all.

## The arithmetic first

At 180 ms median and 12 s p99, utilization was pushing the knee of the
hockey stick. All tuning debates are decoration until utilization drops.
So the entire project was: find the queues, shrink them.

## The three fixes that mattered

**1. Session-wide request coalescing (−4.1 s at p99).**
A checkout made 9 calls to inventory; 7 of them duplicated the same product
lookup within one request. A per-request coalescing cache (singleflight, 20 ms
window) turned 9 hits into 3. Boring, huge.

**2. Killing the distributed transaction (−3.8 s at p99).**
Payment + reservation + coupon in one saga, with a lock held across 3
services. We replaced it with an intent record + idempotent workers: locks
became timestamps, contention vanished, and the failure story was easier to
explain to new engineers. Latency followed.

```mermaid alt="Checkout writes an intent record and returns; idempotent workers reserve stock and charge the payment afterwards"
sequenceDiagram
  participant C as Checkout
  participant I as Intent log
  participant W as Worker
  participant P as Payment
  C->>I: write intent
  I-->>C: accepted
  W->>I: claim intent
  W->>P: charge (idempotency key)
  P-->>W: ok
  W->>I: mark done
```

**3. A p99 budget per query family (−2.6 s).**
Three "cached" queries were cache-invalidating themselves via writes from the
same request. The budget dashboard exposed the family as `p99: 9.4s, budget: 50ms` —
nobody had ever looked at it through that lens. Fix: read from
replicas with a 200 ms acceptable staleness window.

## What looked promising but wasn't

- Rewriting the hot service in Rust: −0 ms at p99 (it was never CPU-bound).
- Retries everywhere: they multiplied load precisely when the system was
  drowning. We added a retry budget instead — max 10% of requests may retry.
- Adding a caching layer on top: hid the first queue, made the second
  harder to see.

## The takeaway

Tail latency is queueing theory wearing a hoodie. Measure utilization, find
the queues, delete work instead of speeding it up. None of this needed a
runtime rewrite; it needed arithmetic and the honesty to look at a budget
dashboard nobody had opened since the sprint it was built in.