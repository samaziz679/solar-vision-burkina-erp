# Deployment Guide for Solar Vision Burkina ERP

This guide provides detailed steps for deploying your Solar Vision Burkina ERP application to Vercel.

## 1. Prepare Your Supabase Project

Before deploying your Next.js application, ensure your Supabase project is correctly set up and accessible.

1.  **Create Supabase Project**: If you haven't already, create a new project on [Supabase](https://supabase.com/).
2.  **Get API Keys**:
    *   Navigate to `Project Settings` > `API`.
    *   Copy your `Project URL` (e.g., `https://abcdefghijk.supabase.co`) and your `anon public` key.
3.  **Run SQL Schema**:
    *   Go to `SQL Editor` in your Supabase project.
    *   Execute the schema scripts in the following order to set up your database tables, RLS policies, and triggers:
        1.  `scripts/supabase_schema.sql`
        2.  `scripts/complete_supabase_schema.sql`
        3.  `scripts/complete_supabase_schema_corrected.sql`
        4.  `scripts/complete_supabase_schema_final_correction.sql`
        5.  `scripts/complete_supabase_schema_final_correction_v2.sql`
    *   **Optional: Insert Initial Data**: If you want to pre-populate your `products` table, run:
        1.  `scripts/insert_initial_stock.sql`
        2.  `scripts/insert_initial_stock_corrected.sql`

## 2. Prepare Your Next.js Application

Ensure your local Next.js project is ready for deployment.

1.  **Install Dependencies**:
    \`\`\`bash
    npm install
    # or
    yarn install
    \`\`\`
2.  **Configure Environment Variables**:
    *   Create a `.env.local` file in your project root (if it doesn't exist).
    *   Add your Supabase URL and Anon Key to this file:
