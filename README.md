# Solar Vision Burkina ERP

This is a simple ERP (Enterprise Resource Planning) system designed for Solar Vision Burkina, built with Next.js, React, and Supabase.

## Features

*   **Dashboard**: Overview of key metrics.
*   **Inventory Management**: Add, view, edit, and delete products.
*   **Sales Management**: Record sales, track quantities, and manage client information.
*   **Purchases Management**: Record purchases, track quantities, and manage supplier information.
*   **Expense Tracking**: Log and categorize business expenses.
*   **Banking Management**: Track bank accounts and balances.
*   **Client Management**: Maintain a database of clients.
*   **Supplier Management**: Maintain a database of suppliers.
*   **Authentication**: User login and session management using Supabase Auth.

## Technologies Used

*   **Next.js**: React framework for production.
*   **React**: Frontend library.
*   **Supabase**: Backend-as-a-Service for database (PostgreSQL) and authentication.
*   **Tailwind CSS**: For styling and responsive design.
*   **shadcn/ui**: Reusable UI components.
*   **Zod**: For schema validation.
*   **Lucide React**: Icon library.

## Setup and Installation

### Prerequisites

*   Node.js (v18.x or later)
*   npm or pnpm (recommended)
*   Git

### 1. Clone the Repository

\`\`\`bash
git clone <your-repository-url>
cd solar-vision-burkina-erp
\`\`\`

### 2. Install Dependencies

Using pnpm (recommended):

\`\`\`bash
pnpm install
\`\`\`

Or using npm:

\`\`\`bash
npm install
\`\`\`

### 3. Set up Supabase

1.  **Create a Supabase Project**: Go to [Supabase](https://supabase.com/) and create a new project.
2.  **Get your API Keys**:
    *   After creating your project, navigate to `Project Settings` > `API`.
    *   Copy your `Project URL` and `anon public` key.
3.  **Set up Database Schema**:
    *   You can use the SQL scripts provided in the `scripts/` directory to set up your database tables.
    *   Go to `SQL Editor` in your Supabase project and run the `scripts/complete_supabase_schema_final_correction_v2.sql` script. This will create all necessary tables and RLS policies.
    *   Optionally, run `scripts/insert_initial_stock_corrected.sql` to seed some initial data.
4.  **Configure Authentication**:
    *   In Supabase, go to `Authentication` > `URL Configuration`.
    *   Add your local development URL to "Site URL": `http://localhost:3000`
    *   Add the callback URL to "Redirect URLs": `http://localhost:3000/auth/callback`
    *   For production, you will need to update these with your deployed Vercel URL.

### 4. Environment Variables

Create a `.env.local` file in the root of your project and add the following:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_PROJECT_URL"
NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
NEXT_PUBLIC_SITE_URL="http://localhost:3000" # For local development
\`\`\`

Replace `YOUR_SUPABASE_PROJECT_URL` and `YOUR_SUPABASE_ANON_KEY` with the values from your Supabase project.

### 5. Run the Development Server

\`\`\`bash
pnpm dev
# or
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Deployment

This application is designed to be deployed on [Vercel](https://vercel.com/).

1.  Push your code to a Git repository (GitHub, GitLab, Bitbucket).
2.  Import your project into Vercel.
3.  Set the environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`) in your Vercel project settings. Remember to update `NEXT_PUBLIC_SITE_URL` to your Vercel deployment URL (e.g., `https://your-app.vercel.app`).
4.  Ensure your Supabase project's "Site URL" and "Redirect URLs" are updated with your Vercel deployment URL.

For a detailed deployment guide, refer to `DEPLOYMENT_GUIDE.md`.

## Project Structure

\`\`\`
.
├── app/
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts      # Supabase auth callback route
│   ├── banking/
│   │   ├── actions.ts        # Server actions for banking
│   │   ├── [id]/edit/page.tsx # Edit banking account page
│   │   ├── new/page.tsx      # New banking account page
│   │   └── page.tsx          # Banking accounts list page
│   ├── clients/
│   │   ├── actions.ts        # Server actions for clients
│   │   ├── [id]/edit/page.tsx # Edit client page
│   │   ├── new/page.tsx      # New client page
│   │   └── page.tsx          # Clients list page
│   ├── dashboard/
│   │   ├── layout.tsx        # Dashboard layout
│   │   └── page.tsx          # Dashboard page
│   ├── expenses/
│   │   ├── actions.ts        # Server actions for expenses
│   │   ├── [id]/edit/page.tsx # Edit expense page
│   │   ├── new/page.tsx      # New expense page
│   │   └── page.tsx          # Expenses list page
│   ├── inventory/
│   │   ├── actions.ts        # Server actions for products
│   │   ├── [id]/edit/page.tsx # Edit product page
│   │   ├── new/page.tsx      # New product page
│   │   └── page.tsx          # Inventory list page
│   ├── purchases/
│   │   ├── actions.ts        # Server actions for purchases
│   │   ├── [id]/edit/page.tsx # Edit purchase page
│   │   ├── new/page.tsx      # New purchase page
│   │   └── page.tsx          # Purchases list page
│   ├── sales/
│   │   ├── actions.ts        # Server actions for sales
│   │   ├── [id]/edit/page.tsx # Edit sale page
│   │   ├── new/page.tsx      # New sale page
│   │   └── page.tsx          # Sales list page
│   ├── suppliers/
│   │   ├── actions.ts        # Server actions for suppliers
│   │   ├── [id]/edit/page.tsx # Edit supplier page
│   │   ├── new/page.tsx      # New supplier page
│   │   └── page.tsx          # Suppliers list page
│   ├── globals.css           # Global CSS styles
│   ├── layout.tsx            # Root layout
│   ├── login/page.tsx        # Login page
│   ├── page.tsx              # Home page
│   └── setup-required/page.tsx # Setup required page
├── components/
│   ├── auth/
│   │   └── login-form.tsx    # Login form component
│   ├── banking/
│   │   ├── banking-form.tsx  # Banking form component
│   │   ├── banking-list.tsx  # Banking list component
│   │   └── delete-banking-dialog.tsx # Delete banking dialog
│   ├── clients/
│   │   ├── client-form.tsx   # Client form component
│   │   ├── client-list.tsx   # Client list component
│   │   └── delete-client-dialog.tsx # Delete client dialog
│   ├── expenses/
│   │   ├── delete-expense-dialog.tsx # Delete expense dialog
│   │   ├── expense-form.tsx  # Expense form component
│   │   └── expense-list.tsx  # Expense list component
│   ├── inventory/
│   │   ├── delete-product-dialog.tsx # Delete product dialog
│   │   ├── edit-product-form.tsx # Edit product form component
│   │   ├── product-form.tsx  # Product form component
│   │   └── product-list.tsx  # Product list component
│   ├── layout/
│   │   └── sidebar.tsx       # Sidebar navigation component
│   ├── purchases/
│   │   ├── delete-purchase-dialog.tsx # Delete purchase dialog
│   │   ├── edit-purchase-form.tsx # Edit purchase form component
│   │   ├── purchase-form.tsx # Purchase form component
│   │   └── purchase-list.tsx # Purchase list component
│   ├── sales/
│   │   ├── delete-sale-dialog.tsx # Delete sale dialog
│   │   ├── edit-sale-form.tsx # Edit sale form component
│   │   ├── sale-form.tsx     # Sale form component
│   │   └── sales-list.tsx    # Sales list component
│   ├── suppliers/
│   │   ├── delete-supplier-dialog.tsx # Delete supplier dialog
│   │   ├── edit-supplier-form.tsx # Edit supplier form component
│   │   ├── supplier-form.tsx # Supplier form component
│   │   └── supplier-list.tsx # Supplier list component
│   ├── theme-provider.tsx    # Theme provider for dark/light mode
│   └── ui/                   # shadcn/ui components
│       └── ...
├── hooks/
│   ├── use-mobile.tsx        # Custom hook for mobile detection
│   └── use-toast.ts          # Custom hook for toast notifications
├── lib/
│   ├── auth.ts               # Authentication utilities
│   ├── data/                 # Data fetching utilities
│   │   ├── banking.ts
│   │   ├── clients.ts
│   │   ├── dashboard.ts
│   │   ├── expenses.ts
│   │   ├── products.ts
│   │   ├── purchases.ts
│   │   ├── sales.ts
│   │   └── suppliers.ts
│   ├── supabase/
│   │   ├── client.ts         # Supabase client setup
│   │   ├── server.ts         # Supabase server client setup
│   │   └── types.ts          # Supabase database types
│   └── utils.ts              # Utility functions (cn for tailwind)
├── public/                   # Static assets
│   ├── placeholder-logo.png
│   ├── placeholder-logo.svg
│   ├── placeholder-user.jpg
│   ├── placeholder.jpg
│   └── placeholder.svg
├── scripts/                  # SQL scripts for Supabase schema
│   ├── complete_supabase_schema.sql
│   ├── complete_supabase_schema_corrected.sql
│   ├── complete_supabase_schema_final_correction.sql
│   ├── complete_supabase_schema_final_correction_v2.sql
│   ├── insert_initial_stock.sql
│   ├── insert_initial_stock_corrected.sql
│   └── supabase_schema.sql
├── styles/
│   └── globals.css           # Global CSS styles (deprecated, moved to app/globals.css)
├── .gitignore                # Git ignore file
├── .npmrc                    # pnpm configuration
├── components.json           # shadcn/ui components configuration
├── next.config.js            # Next.js configuration
├── package.json              # Project dependencies and scripts
├── postcss.config.js         # PostCSS configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── vercel.json               # Vercel deployment configuration
\`\`\`

## Contributing

Feel free to fork the repository and contribute!

## License

[MIT License](LICENSE)
