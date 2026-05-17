# Manual Testing Guide

Project: **Exam Timer + Focus Mode Practice Simulator**  
Baseline date: **2026-05-16**

## P0 — must pass before this repo is public
- [ ] The README title, tagline, live demo URL, and author block all match Exam Timer + Focus Mode Practice Simulator.
- [ ] The static shell loads from `python -m http.server 4280` with no broken relative links.
- [ ] `api/package.json` installs cleanly with `npm install` on Node 20.
- [ ] The placeholder Azure Function starts locally with `npm run start` once Azure Functions Core Tools are available.
- [ ] `staticwebapp.config.json` preserves SPA-style refreshes while leaving `/api/save-session` reachable.
- [ ] The placeholder function returns a JSON response that future timer code can call without contract ambiguity.
- [ ] README deploy instructions document Azure Static Web Apps with `--api-location "api"`.
- [ ] The project framing makes it clear that backend scope is intentionally minimal for the first version.

## P1 — should pass before first feature-complete share
- [ ] `staticwebapp.config.json` allows SPA-style refreshes without intercepting `/api/*` routes.
- [ ] The root page remains readable at 320px, 768px, and 1440px wide.
- [ ] Chrome and Edge show no console errors on initial load.
- [ ] The API placeholder response is plain JSON and easy for the future frontend to consume.
- [ ] The landing page leaves obvious room for timer controls, focus toggle, and session summary output.
- [ ] The API stub naming matches the domain language of practice sessions instead of generic sample code.
- [ ] The README and Copilot instructions stay aligned on keeping the frontend buildless.
- [ ] The planned UI tone feels disciplined and study-oriented, not playful.

## P2 — polish and follow-up checks
- [ ] Environment variables are documented in `.env.example` when the project needs them, but no real values are committed.
- [ ] The roadmap still separates immediate MVP work from later polish or content depth.
- [ ] The project can be published without adding a frontend build step unless future scope truly requires one.
- [ ] The placeholder page looks acceptable in both light and dark system themes.
- [ ] Roadmap items stay centered on timer usefulness and simple analytics rather than feature sprawl.
- [ ] The repo can later add a screenshot and small CSS/JS files without structural churn.
- [ ] The Azure-specific files are minimal but production-shaped enough to teach the deployment model.
- [ ] The placeholder API leaves space for future data validation without pretending it already exists.
