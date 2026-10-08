# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Catalan-speaking One Piece fans watching the anime in Catalan, on phone and desktop in equal measure (the phone use is often via the installed PWA). They are mid-binge: they want to find the next episode, resume where they left off, and keep a sense of how far through the story they are.

## Product Purpose

A client on top of the Catalan-dubbed/subtitled One Piece episodes published by Xarxa Catalana. It makes watching them more comfortable: browse by saga/episode, play in a custom video player, and track progress. Success is a fan picking up the series again in a couple of taps.

## Positioning

Progress tracking (watched state and resume point per episode, stored locally) and an installable, app-like experience (PWA) with its own player, layered over Xarxa Catalana's content. Neighbouring options (the source site, a plain video list) offer neither.

## Operating Context

Single-page React app (Vite, React Router) with two routes: `/` (landing with parallax hero) and `/capitols` (saga/episode browser and player). Episode metadata is the static `public/data/episodes.json`; videos stream from `multimedia.xarxacatala.cat`. Progress lives in `localStorage` (`opc_progress`). Deployed on Vercel.

## Capabilities and Constraints

- No backend, no accounts; all user state is client-side.
- All visible text, aria-labels, `<html lang>` and routes are in Catalan, with no exceptions. New content must enter in Catalan.
- Videos are not owned by the project: a visible, clickable credit to `onepiece.xarxacatala.cat` must always appear (landing credits modal, chapters sidebar `.source-credit`, and any new view showing episodes/videos).
- Saga names come from `episodes.json` (already Catalan).
- Open: the stack and build are settled by the existing codebase; `style.md` is the current written visual reference and is not yet a DESIGN.md.

## Brand Commitments

Name: "One Piece Cat" / "One Piece en Català". The project owner's own logo (`public/brand/one_piece_catala_logo.png`) and Going Merry parallax illustrations (`public/parallax/`) are in use; their use is the owner's responsibility.

## Evidence on Hand

Real episode data (`public/data/episodes.json`), 30 saga cover images (`public/season_covers/`), owner logo and parallax art. No testimonials, user counts or usage data exist; do not fabricate any.

## Product Principles

1. Resume first: getting back to the right episode should take the fewest possible steps.
2. Catalan is the product's identity, not a localization layer.
3. Credit the source: Xarxa Catalana's work is always visibly attributed.
4. Equal citizens: phone and desktop are both primary; the installed-app feel matters on both.
5. Local and private by default: no accounts, nothing leaves the device.

## Accessibility & Inclusion

Baseline WCAG AA (contrast, keyboard operation, visible focus, reduced motion respected) with no further product-specific requirement established.
