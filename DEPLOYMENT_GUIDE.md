# Deployment Guide for Shop Management System

This guide provides instructions on how to deploy the Shop Management System to Vercel.

## Prerequisites

Before you begin, ensure you have the following:

- A Vercel account.
- A Supabase account with your database set up and schema applied.
- Node.js (v18 or higher) and npm installed on your local machine.
- Git installed on your local machine.

## 1. Clone the Repository

First, clone your project repository from GitHub:

\`\`\`bash
git clone [YOUR_REPOSITORY_URL]
cd [YOUR_PROJECT_DIRECTORY]
\`\`\`

## 2. Set Up Environment Variables

The application requires environment variables for Supabase integration.

1.  **Supabase Project Setup**:
    If you haven't already, create a new project in Supabase.
    Go to `Project Settings` -> `API` to find your `SUPABASE_URL` and `SUPABASE_ANON_KEY`.

2.  **Vercel Environment Variables**:
    In your Vercel project settings, navigate to `Settings` -> `Environment Variables`. Add the following environment variables:

    -   `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL.
    -   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase public anon key.
    -   `NEXT_PUBLIC_SITE_URL`: The URL where your application will be deployed (e.g., `https://your-app-name.vercel.app`).

    Make sure these variables are available for both `Development`, `Preview`, and `Production` environments.

## 3. Deploy to Vercel

You can deploy your application to Vercel using one of the following methods:

### Method 1: Deploy via Vercel Dashboard (Recommended)

1.  Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click on "Add New..." -> "Project".
3.  Select your Git repository (GitHub, GitLab, or Bitbucket).
4.  Vercel will automatically detect that it's a Next.js project.
5.  During the configuration, ensure your environment variables are correctly set as described in step 2.
6.  Click "Deploy".

### Method 2: Deploy via Vercel CLI

1.  **Install Vercel CLI**:
    If you don't have it installed, run:
    \`\`\`bash
    npm i -g vercel
    \`\`\`

2.  **Login to Vercel**:
    \`\`\`bash
    vercel login
    \`\`\`
    Follow the prompts to log in with your Vercel account.

3.  **Deploy the Project**:
    Navigate to your project directory in the terminal and run:
    \`\`\`bash
    vercel
    \`\`\`
    Follow the prompts. Vercel will detect your Next.js project and ask you to link it to an existing Vercel project or create a new one. It will also prompt you for environment variables if they are not already configured in your Vercel project.

    To deploy to production, use:
    \`\`\`bash
    vercel --prod
    \`\`\`

## 4. Post-Deployment Steps

1.  **Verify Deployment**:
    Once deployed, Vercel will provide you with a URL. Open this URL in your browser to ensure the application is running correctly.

2.  **Supabase Schema and Data**:
    Ensure your Supabase database has the necessary tables and data. If you haven't already, run the SQL scripts provided in the `scripts/` directory of your project to set up the database schema and initial data. You can do this directly from the Supabase SQL Editor.

    -   `scripts/supabase_schema.sql`: Creates all necessary tables.
    -   `scripts/complete_supabase_schema_corrected.sql`: Adds `user_id` columns.
    -   `scripts/complete_supabase_schema_final_correction.sql`: Makes `user_id` NOT NULL and adds RLS policies.
    -   `scripts/complete_supabase_schema_final_correction_v2.sql`: Adds triggers for `user_id` auto-population.
    -   `scripts/insert_initial_stock.sql`: Inserts initial product stock.
    -   `scripts/insert_initial_stock_corrected.sql`: Corrects initial product stock insertion.

    **Important**: Run these scripts in the specified order.

## Troubleshooting

-   **Environment Variables**: Double-check that all required environment variables are correctly set in Vercel and match your Supabase project.
-   **Build Errors**: If your deployment fails due to build errors, check the Vercel deployment logs for detailed error messages. These often point to issues in your code or missing dependencies.
-   **Supabase Connection**: If the application deploys but data isn't loading, verify your Supabase URL and Anon Key. Also, ensure your Supabase RLS policies are correctly configured to allow data access.
-   **`deploy.sh`**: The `deploy.sh` script is a simple build script. Vercel automatically detects Next.js projects and typically doesn't require a custom build command unless you have specific needs. If you encounter issues, you can try removing `deploy.sh` and letting Vercel use its default Next.js build process.

If you encounter persistent issues, refer to the [Vercel Documentation](https://vercel.com/docs) or [Supabase Documentation](https://supabase.com/docs) for more in-depth troubleshooting.
