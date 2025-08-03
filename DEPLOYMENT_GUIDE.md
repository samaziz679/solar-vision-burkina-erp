# Solar Vision Burkina ERP Deployment Guide

This guide provides instructions for deploying the Solar Vision Burkina ERP application to Vercel.

## Prerequisites

Before you begin, ensure you have the following:

1.  **Vercel Account**: If you don't have one, sign up at [vercel.com](https://vercel.com/).
2.  **Supabase Project**: A Supabase project with your database schema set up.
3.  **Git Repository**: Your project code pushed to a Git repository (GitHub, GitLab, Bitbucket).

## Environment Variables

The application requires the following environment variables to be set in your Vercel project settings:

*   `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL.
*   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase project's public anon key.
*   `NEXT_PUBLIC_SITE_URL`: The public URL of your deployed Vercel application (e.g., `https://your-app.vercel.app`). This is used for Supabase authentication callbacks.

**How to set environment variables in Vercel:**

1.  Go to your Vercel project dashboard.
2.  Navigate to "Settings" -> "Environment Variables".
3.  Add each variable with its corresponding value. Ensure they are available for the correct environments (e.g., "Production", "Preview", "Development").

## Deployment Steps

### 1. Link Your Git Repository

If you haven't already, import your Git repository into Vercel:

1.  Go to your Vercel dashboard and click "Add New..." -> "Project".
2.  Select your Git provider and choose the repository containing your ERP project.
3.  Click "Import".

### 2. Configure Project Settings

Vercel will automatically detect that this is a Next.js project. You typically don't need to change much, but double-check:

*   **Framework Preset**: Next.js
*   **Root Directory**: If your project is in a monorepo or a subdirectory, ensure this is set correctly. Otherwise, leave it as default.
*   **Build & Output Settings**: Usually, the defaults are fine.
    *   Build Command: `next build`
    *   Output Directory: `public`

### 3. Set Up Supabase Authentication Callback URL

For Supabase authentication to work correctly after deployment, you need to add your Vercel deployment URL to your Supabase project's authentication settings.

1.  Go to your Supabase project dashboard.
2.  Navigate to "Authentication" -> "URL Configuration".
3.  Add your Vercel deployment URL (e.g., `https://your-app.vercel.app`) to the "Site URL" field.
4.  Also, add the full callback URL to "Redirect URLs" if you are using email/OAuth providers: `https://your-app.vercel.app/auth/callback`.

### 4. Deploy

Once your environment variables are set and Supabase is configured:

1.  From your Vercel project dashboard, go to the "Deployments" tab.
2.  You can trigger a new deployment by pushing changes to your linked Git branch (e.g., `main` or `master`).
3.  Alternatively, you can manually trigger a deployment by clicking "Deploy" on the latest commit.

Vercel will build and deploy your application. You can monitor the build logs in the Vercel dashboard.

## Post-Deployment

*   **Verify Deployment**: Once deployed, visit your application's URL to ensure everything is working as expected.
*   **Test Forms**: Thoroughly test all forms (Inventory, Sales, Purchases, Expenses, Clients, Suppliers, Banking) to ensure data submission and updates work correctly with Supabase.
*   **Check Logs**: If you encounter any issues, check the Vercel deployment logs and runtime logs for errors.

## Troubleshooting

*   **`TypeError: useFormState is not a function`**: Ensure your `react` and `react-dom` versions are compatible with `useActionState` (React 19+). If you're on an older version, you might need to stick with `useFormState` or upgrade React. This project uses `useActionState`.
*   **Supabase Connection Errors**: Double-check your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` environment variables in Vercel. Ensure they are correct and accessible.
*   **Authentication Redirect Issues**: Verify that your "Site URL" and "Redirect URLs" in Supabase Authentication settings match your Vercel deployment URL.
*   **Build Failures**: Review the build logs in Vercel for specific error messages. These often point to missing dependencies, syntax errors, or configuration issues.

If you need further assistance, refer to the Vercel documentation or Supabase documentation.
