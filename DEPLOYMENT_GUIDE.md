# Solar Vision Burkina ERP - Deployment Guide

## Quick Deployment Steps

### 1. Deploy to Vercel
- Go to [vercel.com](https://vercel.com)
- Click "New Project"
- Import this repository
- Deploy

### 2. Add Environment Variables in Vercel
After deployment, add these in Vercel Dashboard → Settings → Environment Variables:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SITE_URL=https://your-production-domain.com # e.g., https://solar-vision-burkina-erp.vercel.app
\`\`\`

### 3. Supabase Setup
- Create project at [supabase.com](https://supabase.com)
- Run the SQL schema from `scripts/complete_supabase_schema_final_correction_v2.sql`
- Get API keys from Settings → API
- **Important:** In Supabase, go to **Authentication -> URL Configuration** and set:
    - **Site URL:** Your Vercel deployment URL (e.g., `https://solar-vision-burkina-erp.vercel.app`)
    - **Redirect URLs:** Add your Vercel deployment URL and your local development URL (e.g., `http://localhost:3000/auth/callback`, `https://solar-vision-burkina-erp.vercel.app/auth/callback`)

### 4. First Admin User
- After logging in for the first time, get your user ID from Supabase (Authentication -> Users).
- Run this SQL query in Supabase SQL Editor to assign yourself the 'admin' role:

\`\`\`sql
INSERT INTO user_roles (user_id, role) VALUES ('your-user-id', 'admin');
\`\`\`

## 🏃‍♂️ Développement local

\`\`\`bash
npm install
npm run dev
\`\`\`

## 📊 Stack Technique

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth)
- **Déploiement**: Vercel
- **Icons**: Lucide React

## 📞 Support

Pour toute assistance technique, contactez l'équipe de développement.

---

**Solar Vision Burkina** - Powering sustainable energy solutions in Burkina Faso 🌞
\`\`\`

\`\`\`shellscript file="deploy.sh"
#!/bin/bash
# Deployment script for Solar Vision Burkina ERP

echo "🚀 Deploying Solar Vision Burkina ERP..."

# Install Vercel CLI if not installed
npm install -g vercel

# Deploy to Vercel
vercel --prod

echo "✅ Deployment complete!"
echo "📝 Don't forget to add your Supabase environment variables in Vercel dashboard"
