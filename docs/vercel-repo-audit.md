# Quick Audit: Vercel ↔ GitHub linkage

1. Vercel → Project → Settings → Git  
   - Connected Git Repository should be: `samaziz679/solar-vision-burkina-erp`

2. Vercel → Project → Settings → Production  
   - Branch Tracking: `main`

3. Deployments tab  
   - Latest Production deployment shows “Source: main” and a commit SHA.  
   - Compare with GitHub `main` HEAD and local `HEAD` (see `docs/sha-comparison-steps.md`).

4. If using a subfolder app (monorepo)  
   - Settings → General → Build & Development Settings → Root Directory must point to your Next.js app’s folder (leave empty if app is at repo root).

5. Local CLI sanity  
   \`\`\`bash
   npx vercel link        # link local folder to the correct Vercel project
   npx vercel pull        # pull env vars and project settings
