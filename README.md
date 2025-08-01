# Solar Vision Burkina ERP

Système de gestion commerciale pour Solar Vision Burkina - Un ERP complet pour la gestion des ventes, achats, inventaire et finances.

## 🚀 Déploiement Rapide

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/solar-vision-burkina-erp)

## 📋 Fonctionnalités

- ✅ **Authentification sécurisée** avec Supabase Auth (Magic Links)
- ✅ **Gestion des rôles** (Admin, Stock Manager, Commercial, Finance, Visitor, Seller)
- ✅ **Tableau de bord** avec statistiques en temps réel
- ✅ **Gestion d'inventaire** avec alertes de stock bas
- ✅ **Module de ventes** avec différents plans de prix
- ✅ **Suivi des achats** et fournisseurs
- ✅ **Suivi des dépenses** par catégorie
- ✅ **Rapprochement bancaire** (Mobile Money + Banque)
- ✅ **Interface en français**
- ✅ **Responsive design**

## 🛠️ Configuration

### 1. Variables d'environnement

Créez un fichier `.env.local` avec :

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
\`\`\`

### 2. Base de données Supabase

Exécutez le script SQL fourni dans `scripts/complete_supabase_schema_final_correction_v2.sql`

### 3. Premier utilisateur admin

Après connexion, ajoutez votre rôle admin dans Supabase :

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
