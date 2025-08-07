# Vercel ↔ GitHub Linking Checklist

Use this to confirm the Vercel project deploys from the correct repository and branch.

## 1) Confirm linked repository in Vercel
- Vercel → Project → Settings → Git
- "Git Repository" should be the exact owner/repo you expect.
- If wrong:
  1. Click "Disconnect"
  2. Click "Connect" and select the correct repo
  3. Save

## 2) Confirm production branch
- Vercel → Project → Settings → Production → Branch Tracking
- Ensure it's set to "main" (or your chosen prod branch).

## 3) Monorepo (if applicable)
- Vercel → Project → Settings → General → Build & Development Settings → Root Directory
- Set to the folder that contains your Next.js app (leave empty if your app is at repo root).
- Save.

## 4) Verify commit SHA matches
- Vercel → Project → Deployments → open latest deployment
- Note the "Triggered by commit <sha> on main" line.
- Locally:
  \`\`\`
  git rev-parse --short HEAD
  \`\`\`
- On GitHub: confirm the latest commit SHA on `main`.
- The SHAs should match (for a Git-triggered deployment from `main`).

## 5) Check GitHub App permissions
- Vercel → Project → Settings → Git → "Manage" for GitHub → ensure repository is accessible.
- GitHub → Settings → Integrations → GitHub Apps → Vercel → Configure → ensure repo is selected.

## 6) Ensure your local folder is linked to the right Vercel project
From your project folder:
\`\`\`
npx vercel link
npx vercel pull
\`\`\`
- Confirm `.vercel/project.json` exists and references the intended project.
- You can now `vercel deploy --prod` to deploy your local state to the same Vercel project.

## 7) Domain attached to the right project
- Vercel → Project → Settings → Domains
- Ensure your `*.vercel.app` or custom domain is attached to this project.
- If attached to a different project, remove it there and add it here.

## 8) Build settings sanity
- Framework preset: Next.js
- Default build command: `next build`
- Output: automatic (Next.js output handled by Vercel)
- No "Ignored Build Step" preventing builds unintentionally.

## 9) Final sanity
- Push to `main`:
  \`\`\`
  git push origin main
  \`\`\`
- Watch Vercel Deployments: a new build should start with your commit message.
- Open the build → confirm repo and commit SHA shown are correct.

Tip: For Supabase OAuth on preview deployments, add the preview URLs to Supabase Redirect URLs (wildcards for Vercel previews are supported). See Supabase docs for wildcard examples and Vercel preview URL guidance.
