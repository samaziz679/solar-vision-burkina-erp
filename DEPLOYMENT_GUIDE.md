# Deployment Guide for Solar Vision Burkina ERP

This guide outlines the steps to deploy the Solar Vision Burkina ERP application to Vercel.

## Prerequisites

Before you begin, ensure you have the following:

1.  **Vercel Account**: A Vercel account. If you don't have one, sign up at [vercel.com](https://vercel.com/).
2.  **Git Repository**: Your project code pushed to a Git repository (GitHub, GitLab, or Bitbucket).
3.  **Supabase Project**: A Supabase project set up with your database schema and data.
    *   Ensure your Supabase project has the necessary tables and RLS policies configured as per the `scripts/complete_supabase_schema_final_correction_v2.sql` file.
    *   You will need your Supabase Project URL, Anon Key, and Service Role Key.

## Deployment Steps

### 1. Connect Your Git Repository to Vercel

1.  Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click on "Add New..." and select "Project".
3.  Choose your Git provider (GitHub, GitLab, or Bitbucket) and connect your repository.
4.  Select the `solar-vision-burkina-erp` repository.

### 2. Configure Environment Variables

This is a **CRITICAL** step. Your application relies on Supabase environment variables.

1.  In your Vercel project settings, navigate to `Settings` > `Environment Variables`.
2.  Add the following environment variables. Make sure to select "Production", "Preview", and "Development" for all of them.

    *   `SUPABASE_URL`: Your Supabase Project URL (e.g., `https://your-project-id.supabase.co`)
    *   `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase Service Role Key (found in Supabase Dashboard -> Project Settings -> API -> Project API keys -> `service_role` `secret`). This is used for server-side operations.
    *   `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL (same as `SUPABASE_URL`, but prefixed for client-side access).
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Key (found in Supabase Dashboard -> Project Settings -> API -> Project API keys -> `anon` `public`). This is used for client-side access.

    **Example:**
    \`\`\`
    SUPABASE_URL=https://abcdefghijk.supabase.co
    SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
    NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijk.supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_public_key_here
    \`\`\`

### 3. Build and Deployment Settings

Vercel should automatically detect Next.js.

1.  **Framework Preset**: Ensure it's set to `Next.js`.
2.  **Root Directory**: If your project is in a monorepo or a subdirectory, ensure the "Root Directory" is correctly set to the directory containing your `package.json` (e.g., `./`).
3.  **Build Command**: `npm run build` (Vercel usually auto-detects this).
4.  **Output Directory**: `.next` (Vercel usually auto-detects this).

### 4. Deploy

1.  After configuring the environment variables and build settings, click the "Deploy" button.
2.  Vercel will start the build process. Monitor the build logs for any errors.

### 5. Post-Deployment

1.  Once the deployment is successful, Vercel will provide you with a unique deployment URL.
2.  Access your application via this URL.
3.  If you encounter any issues, check the Vercel build logs (`Deployments` tab in your project dashboard) for detailed error messages.

## Troubleshooting Common Deployment Issues

*   **"Supabase URL and Key are required" error**: This almost always means your environment variables are not set correctly in Vercel. Double-check step 2.
*   **"Attempted import error: 'X' is not exported from 'Y'"**: This indicates a mismatch between how a component/function is exported and imported. Ensure `export` statements are correct (e.g., `export function MyComponent` vs. `export default MyComponent`) and imports match (e.g., `import { MyComponent }` vs. `import MyComponent from`).
*   **Edge Runtime errors (e.g., `process.version` not supported)**: This typically happens if Supabase client creation is attempted in an Edge function or middleware without explicitly setting the runtime to Node.js. The provided `middleware.ts` should have `runtime: "nodejs"` to mitigate this.
*   **Build Timeouts or Memory Issues**: If your build takes too long or runs out of memory, review Vercel's [Troubleshooting Build Errors](https://vercel.com/docs/deployments/troubleshoot-a-build) documentation [^1]. This might involve optimizing dependencies or build processes.

If you continue to face issues, provide the full build logs from Vercel for further assistance.
