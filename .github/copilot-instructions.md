# Copilot instructions for Exam Timer + Focus Mode Practice Simulator

Exam Timer + Focus Mode Practice Simulator is a focused cybersecurity portfolio project owned by Matthew Faber. The goal is straightforward: A lightweight frontend plus Azure Functions placeholder backend for running timed study sessions, tracking simple summaries, and demonstrating Azure Static Web Apps structure without overbuilding the UI. Deployment target is Azure Static Web Apps with Azure Functions. The stack is HTML5, CSS3, Vanilla JavaScript, Azure Static Web Apps, Azure Functions (Node 20). Keep the repo easy to review, easy to explain in an interview, and easy to deploy from a clean branch.

When helping here, bias toward the smallest useful implementation. Preserve the deliberate no-build-step approach for the frontend. If the project uses Azure Functions, keep Node tooling isolated to `api/` and do not introduce root-level package management. Prefer plain HTML, CSS, and vanilla JavaScript that a recruiter can understand quickly by opening the repo.

What Copilot should help with:
- Build timer controls, focus-mode UI states, and session summaries with plain browser APIs first.
- Keep API contracts small and predictable so a later persistence decision stays easy.
- Make the app feel calm and purposeful rather than gamified.

Domain guardrail: This is an exam-prep utility, not a productivity tracker SaaS clone; keep the scope on timing, focus, and practice-session feedback. Treat copy, labels, and examples as reviewable cybersecurity content, not filler text.

What to avoid:
- Do not add a frontend framework just to manage timer state.
- Do not invent authentication or storage requirements before the MVP needs them.
- Do not let the API placeholder drift away from Azure Functions conventions.

Keep README examples, testing steps, and placeholder UI text aligned whenever scope changes. This project has no secret-bearing runtime configuration in-repo. If you add data files later, keep them human-readable and stable so Matthew or another reviewer can audit the content without reverse engineering generated output.
