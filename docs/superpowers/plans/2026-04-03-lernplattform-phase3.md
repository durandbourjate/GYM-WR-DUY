# Lernplattform Phase 3: Fortschritt + Mastery

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan.

**Goal:** Mastery-Tracking pro Frage, Dauerbaustellen-Erkennung, priorisierte Block-Zusammenstellung — die App merkt sich was ein Kind kann und passt den Schwierigkeitsgrad an.

**Architecture:** FragenFortschritt in localStorage persistiert (Backend kommt spaeter). Mastery-Utils berechnen Stufen. Block-Builder priorisiert nach Mastery. Dashboard zeigt Fortschrittsbalken pro Thema.

**Spec:** `docs/superpowers/specs/2026-04-02-lernplattform-design.md` (Abschnitt 5)

**Branch:** Direkt auf `main`

## Mastery-Regeln (aus Spec)

| Stufe | Bedingung | Rueckfall |
|-------|-----------|----------|
| neu | Noch nie beantwortet | — |
| ueben | < 3x richtig in Folge | Aus gefestigt wenn falsch |
| gefestigt | 3x richtig in Folge | Aus gemeistert wenn falsch |
| gemeistert | 5x richtig in Folge ueber mind. 2 Sessions | → gefestigt wenn falsch |

Block-Zusammenstellung: 7 Thema (priorisiert) + 2 Luecken + 1 Gemeistert-Check

## Tasks

1. Fortschritt-Typen + Mastery-Utils mit Tests
2. Fortschritt-Store (localStorage-basiert) mit Tests
3. Block-Builder Mastery-Priorisierung erweitern + Tests
4. UebungsStore Integration + Dashboard Mastery-Badges
5. Gesamtverifikation + HANDOFF
