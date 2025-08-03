# Deployment Guide for Solar Vision Burkina ERP

This guide outlines the steps to deploy the Solar Vision Burkina ERP application to Vercel.

## Prerequisites

Before you begin, ensure you have the following:

1.  **Vercel Account:** A Vercel account. If you don't have one, sign up at [vercel.com](https://vercel.com/).
2.  **GitHub Account:** A GitHub account. The project is typically deployed from a GitHub repository.
3.  **Supabase Project:** A Supabase project with your database schema set up and populated with initial data.
    *   Ensure your Supabase project URL and Anon Key are available.
4.  **Node.js and npm/yarn:** Installed on your local machine if you plan to run the project locally or manage dependencies.

## Deployment Steps

### 1. Connect to GitHub (if not already)

Vercel integrates seamlessly with GitHub for automatic deployments.

*   **Fork the Repository:** If you received this project as a repository, it's best to fork it to your own GitHub account.
*   **Import Project to Vercel:**
    1.  Go to your Vercel Dashboard.
    2.  Click "Add New..." -> "Project".
    3.  Select "Import Git Repository" and choose your forked `solar-vision-burkina-erp` repository.

### 2. Configure Environment Variables

The application requires environment variables to connect to your Supabase project.

*   In your Vercel project settings, navigate to **Settings** -> **Environment Variables**.
*   Add the following environment variables:
    *   `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL (e.g., `https://your-project-ref.supabase.co`)
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase public anon key.
    *   `NEXT_PUBLIC_SITE_URL`: The public URL of your deployed Vercel application (e.g., `https://your-project-name.vercel.app`). This is used for Supabase Auth callbacks.

    **Important:** Ensure these variables are available for **Preview** and **Production** environments.

### 3. Verify Root Directory (if applicable)

If your `package.json` and Next.js application are not in the root of your Git repository (e.g., they are in a `frontend/` subdirectory), you need to configure the **Root Directory** in Vercel.

*   In your Vercel project settings, navigate to **Settings** -> **General**.
*   Adjust the **Root Directory** to point to the correct subdirectory (e.g., `frontend/`). If your project is at the root, you can leave this blank or set it to `./`.

### 4. Trigger a Deployment

Once your repository is connected and environment variables are set, Vercel will automatically attempt to deploy your project on every push to the connected Git branch (usually `main`).

*   **Initial Deployment:** Vercel will automatically trigger a build after you import the project.
*   **Manual Redeployment:** If you need to trigger a deployment manually (e.g., after changing environment variables or if a build failed):
    1.  Go to your Vercel project dashboard.
    2.  Navigate to the **Deployments** tab.
    3.  Find the latest commit and click the "Redeploy" button. You can choose to "Clear Build Cache" for a fresh build, which is often helpful for debugging.

### 5. Monitor Deployment Logs

During the deployment process, monitor the build logs on Vercel for any errors or warnings. These logs provide crucial information for troubleshooting.

*   From the Vercel project dashboard, click on the active deployment to view its build logs.

### 6. Post-Deployment

*   **Access the Application:** Once the deployment is successful, Vercel will provide a unique URL for your application (e.g., `https://your-project-name.vercel.app`).
*   **Supabase Auth Callback:** Ensure that the `NEXT_PUBLIC_SITE_URL` environment variable matches the actual deployed URL for Supabase authentication to work correctly. You might also need to add this URL to your Supabase project's "Authentication -> URL Configuration -> Site URL" and "Redirect URLs".

## Troubleshooting Common Issues

*   **"No Next.js version detected"**:
    *   Ensure `next` is listed in `dependencies` or `devDependencies` in `package.json`.
    *   Verify the **Root Directory** setting in Vercel is correct.
*   **`npm install` errors (E404, etc.)**:
    *   Check for typos in `package.json` dependency names or versions.
    *   Ensure the specified package versions exist on npm.
    *   Try `npm install` locally to replicate and debug.
*   **`TypeError: Cannot read properties of undefined (reading '$$FORM_ACTION')`**:
    *   This often indicates an issue with Server Actions during static rendering.
    *   Ensure all Server Actions are correctly defined with `'use server'`.
    *   Verify that data fetching in `page.tsx` or `layout.tsx` files is robust and handles potential `null` or `undefined` states, especially for data used by client components or forms.
    *   Temporarily remove image upload logic or other complex form fields to isolate the issue.
    *   Add `console.log` statements in your Server Actions to trace execution during the build.

If you encounter persistent issues, you can reach out to Vercel Support at [vercel.com/help](https://vercel.com/help).
