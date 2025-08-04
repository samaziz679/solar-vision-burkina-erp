# Solar Vision ERP

This is an Enterprise Resource Planning (ERP) system designed for Solar Vision Burkina. It aims to streamline various business operations, including:

*   **Authentication**: Secure user login and session management.
*   **Dashboard**: Overview of key business metrics.
*   **Banking**: Track income, expenses, and transfers across different accounts.
*   **Clients**: Manage client information.
*   **Expenses**: Record and categorize business expenses.
*   **Inventory**: Manage product stock, pricing, and categories.
*   **Purchases**: Track procurement of products from suppliers.
*   **Sales**: Record sales transactions to clients.
*   **Suppliers**: Manage supplier information.

## Technologies Used

*   **Next.js**: React framework for building full-stack web applications.
*   **React 19 (Canary)**: Latest React features, including Server Actions and `useActionState`.
*   **Supabase**: Backend-as-a-Service for database, authentication, and storage.
*   **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
*   **shadcn/ui**: Reusable UI components built with Radix UI and Tailwind CSS.
*   **Zod**: Schema declaration and validation library.
*   **React Hook Form**: Forms with easy validation.
*   **Sonner**: Toast notifications.
*   **Lucide React**: Beautifully simple and customizable open-source icons.
*   **Recharts**: Composable charting library built on React components.
*   **Geist**: Vercel's typeface for a modern UI.

## Getting Started

### Prerequisites

*   Node.js (v18 or higher)
*   pnpm (recommended, or npm/yarn)
*   A Supabase project

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/samaziz679/solar-vision-burkina-erp.git
cd solar-vision-burkina-erp
\`\`\`

### 2. Install Dependencies

Using pnpm:

\`\`\`bash
pnpm install
\`\`\`

Using npm:

\`\`\`bash
npm install
\`\`\`

### 3. Set up Supabase

1.  **Create a Supabase Project**: If you don't have one, create a new project on [Supabase](https://supabase.com/).
2.  **Get API Keys**: Go to your Supabase project settings -> API. You'll need:
    *   Project URL
    *   `anon` (public) key
    *   `service_role` (secret) key
3.  **Configure Environment Variables**: Create a `.env.local` file in the root of your project and add the following:

    \`\`\`env
    NEXT_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_PROJECT_URL"
    NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
    SUPABASE_URL="YOUR_SUPABASE_PROJECT_URL"
    SUPABASE_SERVICE_ROLE_KEY="YOUR_SUPABASE_SERVICE_ROLE_KEY"
    NEXT_PUBLIC_SITE_URL="http://localhost:3000" # Or your deployment URL
    \`\`\`
    **Important**: For Vercel deployments, you must set these environment variables directly in the Vercel dashboard, not just in `.env.local`.

4.  **Run SQL Migrations**:
    The `scripts/` directory contains SQL files to set up your Supabase database schema. You can run these manually via the Supabase SQL Editor or use a tool like `supabase cli db push`.

    *   `scripts/supabase_schema.sql`
    *   `scripts/complete_supabase_schema.sql`
    *   `scripts/complete_supabase_schema_corrected.sql`
    *   `scripts/complete_supabase_schema_final_correction.sql`
    *   `scripts/complete_supabase_schema_final_correction_v2.sql`
    *   `scripts/insert_initial_stock.sql`
    *   `scripts/insert_initial_stock_corrected.sql`

    Ensure your database schema matches the `lib/supabase/types.ts` file.

### 4. Run the Development Server

\`\`\`bash
npm run dev
# or pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 5. Build for Production

\`\`\`bash
npm run build
# or pnpm build
\`\`\`

This command creates an optimized production build in the `.next` folder.

## Deployment

The application is designed to be deployed on [Vercel](https://vercel.com/). Refer to the [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions.

## Project Structure

\`\`\`
.
├── app/                      # Next.js App Router pages, layouts, and API routes
│   ├── auth/callback/        # Supabase auth callback route
│   ├── banking/              # Banking module pages and actions
│   ├── clients/              # Clients module pages and actions
│   ├── dashboard/            # Dashboard pages and layout
│   ├── expenses/             # Expenses module pages and actions
│   ├── inventory/            # Inventory module pages and actions
│   ├── login/                # Login page
│   ├── purchases/            # Purchases module pages and actions
│   ├── sales/                # Sales module pages and actions
│   ├── suppliers/            # Suppliers module pages and actions
│   ├── setup-required/       # Page for initial setup requirements
│   ├── globals.css           # Global CSS styles
│   ├── layout.tsx            # Root layout for the application
│   └── page.tsx              # Root page, redirects based on auth status
├── components/               # Reusable React components
│   ├── auth/                 # Authentication related components
│   ├── banking/              # Banking specific components
│   ├── clients/              # Client specific components
│   ├── expenses/             # Expense specific components
│   ├── inventory/            # Inventory specific components
│   ├── layout/               # Layout components (e.g., Sidebar)
│   ├── purchases/            # Purchase specific components
│   ├── sales/                # Sales specific components
│   ├── suppliers/            # Supplier specific components
│   ├── ui/                   # shadcn/ui components (copied from library)
│   └── theme-provider.tsx    # Theme context provider
├── hooks/                    # Custom React hooks
├── lib/                      # Utility functions and Supabase client setup
│   ├── auth.ts               # Authentication related utilities
│   ├── data/                 # Data fetching functions for different modules
│   ├── supabase/             # Supabase client setup (client, server, middleware) and types
│   └── utils.ts              # General utility functions
├── public/                   # Static assets (images, icons)
├── scripts/                  # SQL scripts for database schema and seeding
├── styles/                   # Additional global styles (if any)
├── .env.local                # Local environment variables (ignored by Git)
├── .gitignore                # Files/directories to ignore in Git
├── .npmrc                    # npm configuration (e.g., pnpm usage)
├── components.json           # shadcn/ui components configuration
├── deploy.sh                 # Optional deployment script
├── next.config.js            # Next.js configuration
├── package.json              # Project dependencies and scripts
├── postcss.config.js         # PostCSS configuration for Tailwind CSS
├── tailwind.config.ts        # Tailwind CSS configuration
└── tsconfig.json             # TypeScript configuration
