# Verify Vercel Deployment Commit SHA

Goal: Confirm your Production deployment is built from the exact commit on GitHub `main` (and your local `HEAD`).

## 0) Screenshots for reference
- GitHub latest commit (main):  
  ![](/docs/github-main-commit.png)
- Vercel Deployments list (Production):  
  ![](/docs/vercel-deployments-list.png)

## 1) Get the SHA from GitHub (remote main)
Copy the short SHA of the top commit on GitHub (e.g., `f5a73ff` from the screenshot), or use:

\`\`\`bash
git fetch origin
git rev-parse --short origin/main
\`\`\`

## 2) Get the SHA from your local repo
\`\`\`bash
git checkout main
git pull --ff-only
git rev-parse --short HEAD
\`\`\`

## 3) Get the SHA from Vercel (Production)
- Vercel → Project → Deployments → click the latest Production deployment → in “Deployment Details,” copy the short SHA next to “Source: main” (it’s a link to the commit).

Tip: The Deployments list may show “Redeploy of …”. Always click into the deployment to see the actual commit SHA.

## 4) Compare
All three should match:
- Vercel Production deployment SHA
- GitHub `origin/main` SHA
- Local `HEAD` (on `main`) SHA

## 5) Resolve mismatches
- Local `HEAD` ≠ `origin/main` → push:
\`\`\`bash
git push -u origin main
\`\`\`

- `origin/main` ≠ Vercel Production deployment:
  - The latest commit hasn’t deployed yet or you’re viewing an older deployment.
  - Options:
    - Push a new commit to `main` to trigger a fresh deploy, or
    - In Vercel Deployments, open the desired commit’s deployment and click **Redeploy**, or
    - CLI:
      \`\`\`bash
      npx vercel redeploy <deployment-url-or-id> --target=production
      \`\`\`

## 6) Sanity checks
- Vercel → Settings → Git: Connected repo must be `samaziz679/solar-vision-burkina-erp`.
- Vercel → Settings → Production: Branch Tracking should be `main`.
- If your app lives in a subfolder, set Root Directory under Settings → General → Build & Development Settings.
