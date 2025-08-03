# Deployment Guide for Solar Vision Burkina ERP on Vercel

This guide provides detailed steps for deploying the Solar Vision Burkina ERP application to Vercel.

## 1. Prepare Your Project

Before deploying, ensure your project is ready:

-   **All changes committed**: Make sure all your latest code changes are committed and pushed to your Git repository (GitHub, GitLab, Bitbucket).
-   **Environment Variables**: You should have a `.env.local` file for local development. For Vercel, you will configure these directly in the Vercel dashboard.
-   **Supabase Setup**: Ensure your Supabase project is set up, and the database schema (from `scripts/complete_supabase_schema.sql` or incremental scripts) is applied.

## 2. Connect Your Git Repository to Vercel

If you haven't already, connect your Git repository to Vercel:

1.  Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click "Add New..." > "Project".
3.  Select your Git provider (GitHub, GitLab, Bitbucket) and import the repository where your ERP project is located.
4.  If prompted, grant Vercel access to your repository.

## 3. Configure Environment Variables on Vercel

Your application relies on Supabase environment variables. These need to be configured in your Vercel project settings.

1.  In your Vercel project dashboard, go to "Settings" > "Environment Variables".
2.  Add the following environment variables:
    -   **`NEXT_PUBLIC_SUPABASE_URL`**: Your Supabase Project URL.
        -   *Value*: Found in your Supabase project settings under `API` > `Project URL`.
    -   **`NEXT_PUBLIC_SUPABASE_ANON_KEY`**: Your Supabase Anon Key.
        -   *Value*: Found in your Supabase project settings under `API` > `Project API keys` > `anon public`.
    -   **`NEXT_PUBLIC_SITE_URL`**: The public URL of your Vercel deployment.
        -   *Value*: For production, this will be your Vercel domain (e.g., `https://your-project-name.vercel.app`). For preview deployments, Vercel automatically sets this. You can initially set it to your primary domain if you have one, or leave it blank if you're relying on Vercel's default domain.

    **Important**: Ensure these variables are available for both "Production" and "Preview" environments.

## 4. Deployment

Vercel automatically detects Next.js projects. Once your repository is connected and environment variables are set, Vercel will trigger a new deployment.

-   **Automatic Deployments**: By default, Vercel deploys every push to your production branch (usually `main` or `master`) and creates preview deployments for every pull request.
-   **Manual Deployment**: You can also trigger a deployment manually from your Vercel project dashboard by clicking the "Deploy" button.

### Troubleshooting Deployment Errors

If your deployment fails, check the build logs on Vercel. Common issues include:

-   **Missing Environment Variables**: Double-check that all required environment variables are correctly set in Vercel.
-   **Build Command Errors**: If you have a custom build command, ensure it's correct. (For Next.js, `next build` is usually sufficient and auto-detected).
-   **Dependency Issues**: Ensure your `package.json` is correct and all dependencies can be installed.
-   **`useFormState` or `useState` errors during build**: If you encounter errors related to client-side hooks during the build (e.g., `TypeError: Cannot read properties of undefined (reading 'useFormState')`), this often means a client component is being server-rendered or statically generated when it shouldn't be.
    -   **Solution**: Ensure your client components that use these hooks are wrapped with `dynamic(() => import('YourComponent'), { ssr: false })` in their parent `page.tsx` files. Also, ensure you have an `isClient` check within the client component itself:
        \`\`\`typescript
        "use client"
        import { useState, useEffect } from 'react';
        // ... other imports

        export default function YourFormComponent() {
          const [isClient, setIsClient] = useState(false);

          useEffect(() => {
            setIsClient(true);
          }, []);

          if (!isClient) {
            return <div>Loading form...</div>; // Or a skeleton loader
          }

          // ... rest of your client component code using useFormState, useState etc.
        }
