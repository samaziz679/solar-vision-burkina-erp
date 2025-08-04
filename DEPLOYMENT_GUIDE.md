# Deployment Guide for Solar Vision ERP

This guide outlines the steps to deploy the Solar Vision ERP application to Vercel.

## Prerequisites

*   A Vercel account.
*   A Supabase project with your database schema set up.
*   Your Supabase project URL and API keys (Anon Key and Service Role Key).
*   Node.js (v18 or higher) and pnpm (or npm/yarn) installed locally for testing.

## Deployment Steps

### 1. Connect to Git Repository

Ensure your project is connected to a Git repository (GitHub, GitLab, Bitbucket).

1.  Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click "Add New..." -> "Project".
3.  Select your Git provider and import the repository containing this project.

### 2. Configure Environment Variables

This is a **CRITICAL** step. Your application relies on Supabase environment variables. These must be set directly in your Vercel project settings.

1.  In your Vercel project dashboard, navigate to **Settings** -> **Environment Variables**.
2.  Add the following environment variables:

    *   **`SUPABASE_URL`**: Your Supabase Project URL.
        *   *Value Example*: `https://your-project-ref.supabase.co`
        *   *Scope*: Production, Preview, Development
    *   **`SUPABASE_SERVICE_ROLE_KEY`**: Your Supabase Service Role Key. This key has elevated privileges and should **ONLY** be used on the server-side (e.g., in Server Components or API Routes).
        *   *Value Example*: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (found in Supabase Project Settings -> API -> Project API keys -> `service_role` `secret`)
        *   *Scope*: Production, Preview, Development
    *   **`NEXT_PUBLIC_SUPABASE_URL`**: Your Supabase Project URL. This is prefixed with `NEXT_PUBLIC_` to make it available on the client-side.
        *   *Value Example*: `https://your-project-ref.supabase.co`
        *   *Scope*: Production, Preview, Development
    *   **`NEXT_PUBLIC_SUPABASE_ANON_KEY`**: Your Supabase Anon Key. This key has limited privileges and is safe to use on the client-side.
        *   *Value Example*: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (found in Supabase Project Settings -> API -> Project API keys -> `anon` `public`)
        *   *Scope*: Production, Preview, Development
    *   **`NEXT_PUBLIC_SITE_URL`**: The public URL of your deployed application. This is used for Supabase authentication redirects.
        *   *Value Example*: `https://your-app-name.vercel.app` (for preview deployments, this will be dynamic)
        *   *Scope*: Production, Preview, Development

    **Important Notes:**
    *   Ensure there are no leading/trailing spaces in the variable values.
    *   The `SUPABASE_SERVICE_ROLE_KEY` is highly sensitive. Never expose it to the client-side.
    *   The `NEXT_PUBLIC_SITE_URL` should match the "Site URL" in your Supabase Authentication settings (under "URL Configuration" -> "Site URL" and "Redirect URLs").

### 3. Build and Deploy

Vercel will automatically detect your Next.js project and the `pnpm-lock.yaml` file.

1.  **Local Testing (Recommended):**
    Before pushing, run the following commands locally to ensure everything builds correctly:
    \`\`\`bash
    npm install # or pnpm install if you have pnpm configured globally
    npm run build
    \`\`\`
    Address any errors that appear locally.

2.  **Trigger Deployment:**
    *   Push your code to the connected Git repository. Vercel will automatically trigger a new deployment.
    *   Alternatively, you can manually trigger a deployment from the Vercel dashboard by navigating to your project and clicking "Deploy".

### 4. Post-Deployment

*   **Verify Deployment:** Once the deployment is complete, visit the deployed URL to ensure the application is running as expected.
*   **Check Logs:** If you encounter issues, check the build and runtime logs in your Vercel dashboard for error messages.

## Troubleshooting Common Issues

*   **"Supabase URL and Key are required" error**: Double-check that all Supabase environment variables are correctly set in Vercel's project settings, including `SUPABASE_SERVICE_ROLE_KEY` for server-side operations.
*   **`useActionState` import errors**: Ensure your `package.json` specifies React 19 canary versions (`"react": "19.0.0-canary-..."`, `"react-dom": "19.0.0-canary-..."`) and that `useActionState` is imported from `react`.
*   **Component not exported errors**: Verify that all components mentioned in the error logs (e.g., `BankingForm`, `ClientForm`) are explicitly exported using `export function ComponentName(...)` in their respective files.
*   **Node.js API in Edge Runtime warnings**: These are typically warnings and might not block the build, but indicate that certain Node.js APIs are being used in an Edge environment (like `middleware.ts`). While `@supabase/ssr` handles this for Supabase, be mindful of other Node.js specific code in Edge functions.

If you continue to face issues, please provide the full build logs from Vercel for further assistance.
\`\`\`

**4. `README.md`**
Project README.
