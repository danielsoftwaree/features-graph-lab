# FeatureGraph Lab — 1–2 Day MVP Guide

## 0. North Star

Build **one strong interactive case**, not a platform.

**FeatureGraph Lab** shows a business feature as a visual pipeline. A critical piece disappears, the system “fails”, and the user understands why that piece matters.

Core loop:

```txt
business problem → visual pipeline → missing piece → failure → business impact → lesson
```

---

## 1. MVP Scope

### Must have

- Landing page.
- Case cards.
- One full case page: **Case 001: Double Charge**.
- Node canvas.
- Clickable nodes with explanation drawer/panel.
- “Broken mode” toggle: one critical node disappears or becomes marked as missing.
- Fake test/status panel showing what failed.
- Business impact panel.
- Final takeaway.

### Nice to have

- Two extra case preview cards.
- Smooth edge animation.
- Highlight failed path.
- Small “solved case” badge.

### Do not build now

- Auth.
- Database.
- Real backend.
- Real test runner.
- User submissions.
- LeetCode-like solving.
- Case editor.
- AI-generated cases.
- Multi-user collaboration.

---

## 2. Canvas Research Verdict

Use:

```txt
@xyflow/react  // React Flow / XYFlow
```

Why:

- Best fit for **node + edge diagrams**.
- Custom nodes are React components.
- Built-in pan, zoom, drag, selection.
- Built-in MiniMap, Controls, Background, Panel.
- Custom edges are possible.
- Fastest path to a polished MVP.

Do not use for MVP:

### tldraw

Great for whiteboards and infinite canvas apps, but too broad for this MVP. You do not need freehand drawing, multiplayer, custom drawing tools, or a full whiteboard UX.

### Rete.js

Good for visual programming / executable node editors, but too heavy conceptually for now. You are not building a graph execution engine yet.

Decision:

```txt
React Flow now.
Maybe Rete much later if graphs become executable.
Maybe tldraw never, unless the product becomes a whiteboard.
```

Research links:

- React Flow: https://reactflow.dev/
- React Flow built-in components: https://reactflow.dev/learn/concepts/built-in-components
- React Flow custom edges: https://reactflow.dev/learn/customization/custom-edges
- tldraw SDK: https://tldraw.dev/
- Rete.js: https://retejs.org/

---

## 3. MVP Case List

### Full case

## Case 001: Double Charge

Business problem:

> A payment provider retries a webhook after a network issue. Without protection, the system may process the same payment event twice.

Missing piece:

```txt
Event Deduplication / Idempotency Guard
```

Failure:

```txt
duplicate webhook → second ledger entry → possible double charge
```

Business impact:

- Refunds.
- Support tickets.
- User trust damage.
- Chargeback risk.

Lesson:

> Payment systems need explicit protection against repeated events. Retries are normal; double-processing is the bug.

---

### Preview case 002: Referral Abuse

Business problem:

> A referral campaign looks successful, but fake accounts are draining bonus money.

Missing piece:

```txt
Abuse Detection / Velocity Check
```

Lesson:

> Growth mechanics without abuse protection can turn marketing budget into fraud payout.

---

### Preview case 003: Last Item Race

Business problem:

> Two users try to buy the last item at the same time.

Missing piece:

```txt
Stock Reservation
```

Lesson:

> Checkout is not just payment. Inventory must be reserved before final confirmation.

---

### Optional preview case 004: AI Tutor Wrong Feedback

Business problem:

> An AI tutor marks an incorrect student answer as correct.

Missing piece:

```txt
Answer Verification
```

Lesson:

> AI learning features need verification, not just generation.

---

## 4. Landing Page Structure

### Hero

Title:

```txt
Learn business logic by breaking real product features.
```

Subtitle:

```txt
FeatureGraph Lab is a visual lab where complex product mechanics are shown as node pipelines. Remove one critical piece, watch the system fail, and understand why it matters.
```

CTA:

```txt
Open Case 001: Double Charge
```

### Section: What this is

```txt
Not a course. Not a diagram gallery. Not LeetCode yet.

A solved visual breakdown of dangerous business bugs.
```

### Section: Cases

Show 3–4 cards:

- Double Charge — available.
- Referral Abuse — preview.
- Last Item Race — preview.
- AI Tutor Wrong Feedback — preview.

Each card needs:

- title;
- domain;
- one-line problem;
- missing piece;
- status: Available / Preview.

---

## 5. Case Page Structure

Case page sections:

```txt
1. Case header
2. Business situation
3. Visual pipeline canvas
4. Node detail panel
5. Broken mode panel
6. Fake test results
7. Business impact
8. Final lesson
```

### Case header

```txt
Case 001: Double Charge
Domain: Fintech / Payments
Status: Solved breakdown
Difficulty: Medium
```

### Business situation

Short and concrete:

```txt
A customer pays for an order. The payment provider sends a webhook. Because of a network retry, the same event arrives again. If the system processes both events, the customer may be charged twice.
```

### Canvas nodes

```txt
Checkout Started
Create Payment Intent
Provider Authorization
Webhook Received
Event Deduplication / Idempotency Guard
Ledger Entry
Order Confirmed
Reconciliation
Customer Notification
```

### Broken mode

Button/toggle:

```txt
Break the system
```

When enabled:

- mark `Event Deduplication / Idempotency Guard` as missing;
- highlight the path from webhook to ledger;
- show failed fake tests;
- show business damage.

### Fake test results

```txt
✅ normal checkout creates one payment
❌ duplicate webhook must not create second ledger entry
❌ payment retry must be safe after timeout
✅ customer receives confirmation once
```

### Final lesson

```txt
The bug is not that the provider retried the event. Retries are expected. The bug is that the product pipeline did not guarantee safe repeated processing.
```

---

## 6. Your Role vs AI Role

You own meaning.

AI owns routine.

### You must decide yourself

- What the case teaches.
- Which node is critical.
- What breaks without it.
- What the user should feel.
- Which details are noise.
- Whether the page is understandable.
- Whether the MVP looks sharp enough to share.

### AI can help with

- Project setup.
- Boilerplate layout.
- Component scaffolding.
- TypeScript cleanup.
- CSS polish.
- Refactoring.
- Generating variants after you define the direction.

Rule:

```txt
AI can implement structure, but cannot choose the lesson.
```

---

## 7. Anti-Vibecoding Rules

Before asking AI to code, write this yourself:

```txt
What am I building?
Why does this screen exist?
What should the user understand after this?
What is out of scope?
```

After AI writes code, explain it out loud before accepting it:

```txt
What files changed?
What component owns the main behavior?
Where is the case data stored?
How does broken mode work?
What can I delete without breaking the MVP?
```

If you cannot explain the code, do not merge it.

---

## 8. Build Plan

## Phase 1 — Product skeleton

You write:

- project name;
- landing title;
- landing subtitle;
- case list;
- exact text for Case 001.

AI may create:

- project scaffold;
- basic routing;
- placeholder layout.

Checkpoint:

```txt
Can I explain the product in 20 seconds?
```

---

## Phase 2 — Static pages

You build or review:

- landing page sections;
- case cards;
- case page layout.

AI may help with:

- responsive layout;
- styling;
- card components.

Checkpoint:

```txt
Does the page make sense without interaction?
```

---

## Phase 3 — Canvas

You decide:

- node names;
- node order;
- which node is critical;
- which path should fail.

AI may implement:

- React Flow canvas;
- nodes and edges;
- fit view;
- minimap/controls/background.

Checkpoint:

```txt
Can a stranger understand the pipeline in 10 seconds?
```

---

## Phase 4 — Node details

You write for every important node:

```txt
Why it exists
What it protects
What breaks without it
```

AI may implement:

- click-to-open detail panel;
- selected node state;
- visual styling.

Checkpoint:

```txt
Does every node justify its existence?
```

---

## Phase 5 — Broken mode

You decide:

- what disappears;
- what fails;
- what business damage appears.

AI may implement:

- toggle;
- missing node state;
- failed path highlight;
- fake test panel.

Checkpoint:

```txt
Does the failure feel obvious and painful?
```

---

## Phase 6 — Polish

You personally test:

- first impression;
- readability;
- mobile fallback;
- whether it feels like a product, not a toy.

AI may help with:

- spacing;
- animation;
- microcopy;
- cleanup.

Checkpoint:

```txt
Would I proudly send this GitHub link to someone?
```

---

## 9. Definition of Done

MVP is done when:

- landing page explains the idea quickly;
- Case 001 opens cleanly;
- canvas is readable;
- clicking nodes shows useful explanation;
- broken mode makes one missing piece obvious;
- fake tests connect to the missing piece;
- business impact is visible;
- the final lesson is clear;
- there is no backend/auth/database;
- you can explain every important file yourself.

---

## 10. YouTube-Style Narrative

Use this as your internal script while building:

```txt
I am not building a fintech SaaS.
I am building one visual explanation of a dangerous fintech bug.

First, I show the happy path.
Then I remove the protection layer.
Then the system fails.
Then I explain the business damage.

The goal is not to solve everything.
The goal is to make one invisible business guarantee visible.
```

---

## 11. First Codex / Claude Code Prompt

Use this only after you write the product text yourself.

```txt
Create a minimal Next.js + TypeScript app for FeatureGraph Lab.

Scope:
- landing page with hero and case cards;
- case page for /cases/double-charge;
- use @xyflow/react for a static node canvas;
- no backend;
- no auth;
- no database;
- use local static case data;
- keep components simple and readable;
- do not invent extra features.

Important:
I want to understand and edit the code myself, so prefer clarity over abstraction.
Before implementing, create a small file/component plan.
```

---

## 12. Final Reminder

Build one strong artifact.

Not a platform.
Not a course.
Not an AI app.

Just this:

```txt
One business feature.
One missing piece.
One visible failure.
One clear lesson.
```
