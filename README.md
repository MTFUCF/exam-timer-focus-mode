# Exam Timer Focus Mode

A buildless Azure Static Web Apps project that simulates a timed SC-900-style practice session with review feedback and a tiny Functions health endpoint.

## What it is

This project is a lightweight exam-prep simulator for running SC-900-style practice sessions with timing pressure, focus controls, and end-of-session review breakdowns. It stays intentionally buildless on the frontend so the repo is easy to review, explain, and deploy as an Azure Static Web Apps portfolio artifact.

## Features

- Welcome screen for exam mode, duration, and question-count selection
- 30 authored SC-900-flavored study questions pulled from `data/exam-questions.json`
- 15, 30, or 50 question sessions with timer, flags, keyboard shortcuts, and pause states
- Review screen with score, domain breakdown, incorrect answers, rationales, and source links
- Focus mode, fullscreen toggle, tab-switch pause indicator, and browser local history
- `GET /api/health` placeholder function to demonstrate Static Web Apps plus Functions wiring

## Configuration

This project has no required runtime secrets.

- Local: no `.env` or `local.settings.json` is required
- Azure Static Web Apps: no app settings are required for the current MVP
- Function route: `GET /api/health`

## Local development

```powershell
cd .\projects\exam-timer-focus-mode
npm install --prefix .\api
swa start . --api-location .\api
```

If needed:

```powershell
npm install -g @azure/static-web-apps-cli
```

## Push to GitHub

This project ships as its own standalone repo. To push it to a GitHub account (e.g., a separate cybersecurity-portfolio account), follow these steps.

### 1) Authenticate with the target account

Preferred: use GitHub CLI multi-account auth.

```bash
gh auth login
gh auth switch
gh auth status
```

Per-repo git config keeps commits under the right identity even if your global git config points at another account:

```bash
git config user.name "Matthew Faber"
git config user.email "<your-github-username>@users.noreply.github.com"
```

The noreply email keeps your personal email private. Replace `<your-github-username>` with the target account username.

### 2) Initialize, commit, and push

From the workspace root:

```bash
cd projects/exam-timer-focus-mode
git init -b main
git config user.name "Matthew Faber"
git config user.email "<your-github-username>@users.noreply.github.com"
git add .
git commit -m "Initial commit"
gh repo create <your-github-username>/exam-timer-focus-mode --public --source=. --remote=origin --push --description "A buildless Azure Static Web Apps project that simulates a timed SC-900-style practice session with review feedback and a tiny Functions health endpoint."
```

### 3) Create the Azure Static Web App

Create an Azure Static Web App via the Azure Portal or `az staticwebapp create`. When linking the GitHub repo, GitHub auto-injects the `AZURE_STATIC_WEB_APPS_API_TOKEN_*` secret. The included workflow `.github/workflows/azure-static-web-apps.yml` handles the rest.

### 4) Updating later

```bash
git add . && git commit -m "Describe the change" && git push
```

## Deploy

```powershell
cd .\projects\exam-timer-focus-mode
gh repo create <your-github-username>/exam-timer-focus-mode --public --source . --remote origin --push
az login
az extension add --name staticwebapp
az group create --name rg-exam-timer-focus-mode --location eastus2
az staticwebapp create --name exam-timer-focus-mode --resource-group rg-exam-timer-focus-mode --location eastus2 --source https://github.com/<your-github-username>/exam-timer-focus-mode --branch main --app-location "/" --api-location "api" --output-location ""
$token = az staticwebapp secrets list --name exam-timer-focus-mode --resource-group rg-exam-timer-focus-mode --query "properties.apiKey" -o tsv
gh secret set AZURE_STATIC_WEB_APPS_API_TOKEN_EXAM_TIMER_FOCUS_MODE --body "$token"
```

Workflow file: `.github/workflows/azure-static-web-apps.yml`

Add the deployment token secret before expecting GitHub Actions deploys to succeed.

## Tech stack

- Vanilla JavaScript
- Azure Static Web Apps
- Azure Functions (Node 20 — placeholder `GET /api/health` endpoint)
- Browser `localStorage` for local session history
- No frontend build step

## Notes

- Questions are original study-aid prompts and not real exam questions
- `staticwebapp.config.json` already excludes `/api/*` from SPA fallback behavior
- Browser history is saved with `localStorage` only

## Author

Matthew Faber
