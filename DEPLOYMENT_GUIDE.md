# Deployment Guide for Solar Vision Burkina ERP

This guide provides instructions for deploying the Solar Vision Burkina ERP application to Vercel.

## Prerequisites

Before you begin, ensure you have the following:

1.  **Vercel Account**: A Vercel account. If you don't have one, sign up at [vercel.com](https://vercel.com/).
2.  **Vercel CLI**: Installed Vercel CLI. You can install it globally using npm:
    \`\`\`bash
    npm install -g vercel
    \`\`\`
3.  **Git Repository**: Your project code pushed to a Git repository (GitHub, GitLab, Bitbucket).
4.  **Supabase Project**: A Supabase project set up with your database schema.
    *   Ensure your `public.products` table has an `image` column of type `text`.
    *   Ensure your `public.expenses` table has `expense_date` and `notes` columns.
    *   Ensure your `public.bank_entries` table has `date` and `type` columns.
5.  **Environment Variables**: The necessary environment variables from your Supabase project.

## Environment Variables

You will need to configure the following environment variables in your Vercel project settings.

### Required for Supabase Integration

*   `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL.
*   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase public anon key.
*   `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (for server-side operations, keep this secret).

### Other Environment Variables

*   `NEXT_PUBLIC_SITE_URL`: The public URL of your deployed application (e.g., `https://your-app.vercel.app`). This is often automatically set by Vercel.

**How to add Environment Variables in Vercel:**

1.  Go to your Vercel project dashboard.
2.  Navigate to "Settings" -> "Environment Variables".
3.  Add each variable with its corresponding value. Ensure `NEXT_PUBLIC_` variables are marked as "Frontend" (or "Preview" and "Production") and `SUPABASE_SERVICE_ROLE_KEY` is marked as "Serverless Function" (or "Production").

## Deployment Steps

### 1. Link Your Project to Vercel

If you haven't already, link your local project to a Vercel project:

\`\`\`bash
vercel link
\`\`\`

Follow the prompts to link to an existing project or create a new one.

### 2. Deploy from Vercel CLI

You can deploy your project directly from the Vercel CLI. This will trigger a new deployment based on your current local code.

\`\`\`bash
vercel deploy
\`\`\`

Alternatively, if your project is connected to a Git repository, Vercel will automatically deploy every push to your configured branch (usually `main` or `master`).

### 3. Verify Deployment

After the deployment is complete, Vercel will provide a deployment URL. Open this URL in your browser to verify that the application is running correctly.

### 4. Database Seeding (Optional)

If you have SQL scripts to seed your database (e.g., `scripts/insert_initial_stock.sql`), you can run them using a SQL client or Supabase's SQL Editor.

**Example using Supabase SQL Editor:**

1.  Go to your Supabase project dashboard.
2.  Navigate to "SQL Editor".
3.  Paste the content of your SQL script (e.g., `scripts/insert_initial_stock.sql`) into the editor.
4.  Click "RUN".

## Troubleshooting

*   **Build Errors**: If your deployment fails during the build process, check the Vercel deployment logs for detailed error messages. Common issues include missing environment variables, syntax errors, or dependency problems.
*   **Runtime Errors**: If the application deploys but doesn't function correctly, check the serverless function logs in your Vercel dashboard.
*   **Supabase Connection Issues**: Ensure your Supabase URL and Anon Key are correctly configured as environment variables in Vercel. Also, verify that your Supabase database is accessible and your RLS (Row Level Security) policies are correctly set up if you are using them.

For more detailed information on Vercel deployments, refer to the [Vercel documentation](https://vercel.com/docs/deployments/overview).
