# Deployment Guide for Solar Vision Burkina ERP

This guide provides instructions for deploying the Solar Vision Burkina ERP application.

## Prerequisites

Before deploying, ensure you have the following:

1.  **Node.js and npm/Yarn:** Installed on your local machine.
2.  **Git:** Installed and configured.
3.  **Vercel Account:** A Vercel account and the Vercel CLI installed (`npm i -g vercel`).
4.  **Supabase Project:** A Supabase project set up with the necessary database schema and Row Level Security (RLS) policies.
    *   You can use the SQL scripts provided in the `scripts/` directory to set up your Supabase database.
    *   Ensure you have enabled the `uuid-ossp` extension in your Supabase project (Database -> Extensions -> search for `uuid-ossp` and enable it).

## Environment Variables

The application requires the following environment variables. These should be set in your Vercel project settings.

*   `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL.
*   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase public anon key.
*   `NEXT_PUBLIC_SITE_URL`: The public URL of your deployed application (e.g., `https://your-app-name.vercel.app`). This is used for Supabase Auth callbacks.

**How to set environment variables in Vercel:**

1.  Go to your Vercel project dashboard.
2.  Navigate to **Settings** -> **Environment Variables**.
3.  Add each variable with its corresponding value.

## Deployment Steps

### 1. Clone the Repository

First, clone your project repository to your local machine:

\`\`\`bash
git clone <your-repository-url>
cd solar-vision-burkina-erp
\`\`\`

### 2. Install Dependencies

Install the project dependencies using npm or Yarn:

\`\`\`bash
npm install
# or
yarn install
\`\`\`

### 3. Set up Supabase Database

If you haven't already, set up your Supabase database using the provided SQL scripts.

1.  Go to your Supabase project dashboard.
2.  Navigate to **SQL Editor**.
3.  Open `scripts/supabase_schema.sql` (or `scripts/complete_supabase_schema.sql` for the full schema) from your cloned repository.
4.  Paste the content into the SQL editor and run it. This will create the necessary tables and RLS policies.
5.  (Optional) If you want to insert initial stock data, run the `scripts/insert_initial_stock.sql` script, remembering to replace `'YOUR_USER_ID'` with an actual user ID from your `auth.users` table.

### 4. Configure Supabase Auth Redirect URL

For Supabase authentication to work correctly, you need to add your Vercel deployment URL to Supabase's redirect URLs.

1.  Go to your Supabase project dashboard.
2.  Navigate to **Authentication** -> **URL Configuration**.
3.  Add your Vercel deployment URL (e.g., `https://your-app-name.vercel.app`) to the **Redirect URLs** list.
    *   Also add `http://localhost:3000` for local development.

### 5. Deploy to Vercel

You can deploy your application to Vercel using the Vercel CLI or by connecting your Git repository directly to Vercel.

#### Option A: Deploy using Vercel CLI

\`\`\`bash
vercel
\`\`\`

Follow the prompts. Vercel will detect it's a Next.js project and build it.

#### Option B: Deploy via Git Integration (Recommended)

1.  Push your code to a Git repository (e.g., GitHub, GitLab, Bitbucket).
2.  Go to your Vercel dashboard and click "Add New Project".
3.  Import your Git repository.
4.  Vercel will automatically detect the Next.js framework and configure the build settings.
5.  Ensure your environment variables are set in the Vercel project settings as described above.
6.  Vercel will automatically deploy your application on every push to the connected branch.

### 6. Post-Deployment

After a successful deployment, your application will be live at the URL provided by Vercel.

*   **Troubleshooting Builds:** If your build fails, check the build logs in your Vercel dashboard (Project -> Deployments -> select failed deployment -> Build Logs). Common issues include missing environment variables, incorrect `package.json` dependencies, or build command errors.

If you encounter any issues, refer to the Vercel documentation or seek support.
