---
cover: ../../assets/covers/mono-tui.svg
coverAlt: "Mock-up of a three-pane terminal UI"
title: mono-tui
summary: Opinionated Rust toolkit for building terminal UIs with monospace discipline.
period: 2025 — now
role: Author & maintainer
stack: [Rust, crossterm, ratatui]
repo: https://github.com/mustermann/mono-tui
updated: 2026-08-12
featured: false
---

## What

A small (2.5k SLOC) library on top of `ratatui` encoding the layout rules
that make terminal UIs feel *precise*: column alignment in `ch` units,
baseline grids for lists, and a `Table` that never scrolls a row under the
header by accident.

## Why open-source it

The best way to sharpen an opinion is to publish it. mono-tui encodes what I
learned building internal TUI dashboards for release automation — and the
issues section doubles as a design review by strangers, which is better than
any linter.

## Notables

- zero panics in public API: layout math saturates instead of asserting
- snapshot tests render every example into golden ANSI dumps, so a glyph
  regression is visible in the PR diff
- honest about scope: it is not a framework, it is a set of widgets with
  strong defaults