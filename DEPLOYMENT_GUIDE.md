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
\`\`\`

### 3. Supabase Setup
- Create project at [supabase.com](https://supabase.com)
- Run the SQL schema (provided separately)
- Get API keys from Settings → API

### 4. Test
- Visit your deployed URL
- Try logging in with magic link
- Create admin user in database

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
