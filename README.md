# Solar Vision Burkina ERP

This is an Enterprise Resource Planning (ERP) system designed for Solar Vision Burkina. It aims to manage various aspects of the business, including:

*   **Authentication**: Secure user login and session management.
*   **Dashboard**: Overview of key business metrics.
*   **Inventory Management**: Track products, stock levels, and categories.
*   **Client Management**: Manage client information.
*   **Supplier Management**: Manage supplier details.
*   **Sales Management**: Record and track sales transactions.
*   **Purchase Management**: Record and track purchase transactions.
*   **Expense Tracking**: Log and categorize business expenses.
*   **Banking Transactions**: Manage banking accounts and transactions (income, expenses, transfers).

## Technologies Used

*   **Next.js 14**: React framework for building full-stack web applications.
*   **React 18**: JavaScript library for building user interfaces.
*   **TypeScript**: Strongly typed superset of JavaScript.
*   **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
*   **shadcn/ui**: Reusable UI components built with Radix UI and Tailwind CSS.
*   **Supabase**: Open-source Firebase alternative for database, authentication, and storage.
*   **Zod**: TypeScript-first schema declaration and validation library.
*   **React Hook Form**: Performant, flexible and extensible forms with easy-to-use validation.
*   **Sonner**: An opinionated toast component for React.
*   **Recharts**: Composable charting library built on React components.

## Getting Started

### Prerequisites

*   Node.js (v18.x or later)
*   npm or pnpm
*   Git
*   A Supabase project

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/samaziz679/solar-vision-burkina-erp.git
cd solar-vision-burkina-erp
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
# or if you use pnpm
# pnpm install
\`\`\`

### 3. Set up Environment Variables

Create a `.env.local` file in the root of your project and add your Supabase credentials:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
\`\`\`

*   You can find your Supabase Project URL and Anon Key in your Supabase Dashboard under `Project Settings` > `API`.
*   The `SUPABASE_SERVICE_ROLE_KEY` is also found in the same section, under `Project API keys` as `service_role` `secret`.

### 4. Run Supabase Migrations (Optional, but Recommended for Fresh Setup)

If you are setting up a new Supabase project, you can use the provided SQL scripts to set up your database schema and initial data.

1.  Go to your Supabase Dashboard.
2.  Navigate to `SQL Editor`.
3.  Open `scripts/complete_supabase_schema_final_correction_v2.sql` and run its content in the Supabase SQL Editor. This will create all necessary tables and RLS policies.
4.  Optionally, run `scripts/insert_initial_stock_corrected.sql` to populate some initial product data.

### 5. Run the Development Server

\`\`\`bash
npm run dev
# or
# pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

\`\`\`
.
├── app/
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts          # Supabase auth callback route handler
│   ├── banking/
│   │   ├── [id]/
│   │   │   └── edit/
│   │   │       └── page.tsx      # Edit banking transaction page
│   │   ├── actions.ts            # Server actions for banking
│   │   ├── new/
│   │   │   └── page.tsx          # New banking transaction page
│   │   └── page.tsx              # List banking transactions
│   ├── clients/
│   │   ├── [id]/
│   │   │   └── edit/
│   │   │       └── page.tsx      # Edit client page
│   │   ├── actions.ts            # Server actions for clients
│   │   ├── new/
│   │   │   └── page.tsx          # New client page
│   │   └── page.tsx              # List clients
│   ├── dashboard/
│   │   ├── layout.tsx            # Dashboard layout
│   │   └── page.tsx              # Dashboard overview
│   ├── expenses/
│   │   ├── [id]/
│   │   │   └── edit/
│   │   │       └── page.tsx      # Edit expense page
│   │   ├── actions.ts            # Server actions for expenses
│   │   ├── new/
│   │   │   └── page.tsx          # New expense page
│   │   └── page.tsx              # List expenses
│   ├── inventory/
│   │   ├── [id]/
│   │   │   └── edit/
│   │   │       └── page.tsx      # Edit product page
│   │   ├── actions.ts            # Server actions for inventory
│   │   ├── new/
│   │   │   └── page.tsx          # New product page
│   │   └── page.tsx              # List products
│   ├── login/
│   │   └── page.tsx              # Login page
│   ├── purchases/
│   │   ├── [id]/
│   │   │   └── edit/
│   │   │       └── page.tsx      # Edit purchase page
│   │   ├── actions.ts            # Server actions for purchases
│   │   ├── new/
│   │   │   └── page.tsx          # New purchase page
│   │   └── page.tsx              # List purchases
│   ├── sales/
│   │   ├── [id]/
│   │   │   └── edit/
│   │   │       └── page.tsx      # Edit sale page
│   │   ├── actions.ts            # Server actions for sales
│   │   ├── new/
│   │   │   └── page.tsx          # New sale page
│   │   └── page.tsx              # List sales
│   ├── setup-required/
│   │   ├── loading.tsx           # Loading state for setup
│   │   └── page.tsx              # Setup required page
│   ├── suppliers/
│   │   ├── [id]/
│   │   │   └── edit/
│   │   │       └── page.tsx      # Edit supplier page
│   │   ├── actions.ts            # Server actions for suppliers
│   │   ├── new/
│   │   │   └── page.tsx          # New supplier page
│   │   └── page.tsx              # List suppliers
│   ├── globals.css               # Global CSS styles
│   └── layout.tsx                # Root layout for the application
├── components/
│   ├── auth/
│   │   └── login-form.tsx        # Login form component
│   ├── banking/
│   │   ├── banking-form.tsx      # Form for banking transactions
│   │   ├── banking-list.tsx      # List/table for banking transactions
│   │   └── delete-banking-dialog.tsx # Delete confirmation dialog
│   ├── clients/
│   │   ├── client-form.tsx       # Form for client details
│   │   ├── client-list.tsx       # List/table for clients
│   │   └── delete-client-dialog.tsx  # Delete confirmation dialog
│   ├── expenses/
│   │   ├── expense-form.tsx      # Form for expenses
│   │   ├── expense-list.tsx      # List/table for expenses
│   │   └── delete-expense-dialog.tsx # Delete confirmation dialog
│   ├── inventory/
│   │   ├── delete-product-dialog.tsx # Delete confirmation dialog
│   │   ├── edit-product-form.tsx # Form for editing products
│   │   ├── product-form.tsx      # Form for creating new products
│   │   └── product-list.tsx      # List/table for products
│   ├── layout/
│   │   └── sidebar.tsx           # Sidebar navigation component
│   ├── purchases/
│   │   ├── delete-purchase-dialog.tsx # Delete confirmation dialog
│   │   ├── edit-purchase-form.tsx # Form for editing purchases
│   │   ├── purchase-form.tsx     # Form for creating new purchases
│   │   └── purchase-list.tsx     # List/table for purchases
│   ├── sales/
│   │   ├── delete-sale-dialog.tsx # Delete confirmation dialog
│   │   ├── edit-sale-form.tsx    # Form for editing sales
│   │   ├── sale-form.tsx         # Form for creating new sales
│   │   └── sales-list.tsx        # List/table for sales
│   ├── suppliers/
│   │   ├── delete-supplier-dialog.tsx # Delete confirmation dialog
│   │   ├── edit-supplier-form.tsx # Form for editing suppliers
│   │   ├── supplier-form.tsx     # Form for creating new suppliers
│   │   └── supplier-list.tsx     # List/table for suppliers
│   ├── theme-provider.tsx        # Theme provider for dark/light mode
│   └── ui/                       # shadcn/ui components
│       ├── accordion.tsx
│       ├── alert-dialog.tsx
│       ├── alert.tsx
│       ├── aspect-ratio.tsx
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── breadcrumb.tsx
│       ├── button.tsx
│       ├── calendar.tsx
│       ├── card.tsx
│       ├── carousel.tsx
│       ├── chart.tsx
│       ├── checkbox.tsx
│       ├── collapsible.tsx
│       ├── command.tsx
│       ├── context-menu.tsx
│       ├── data-table.tsx        # Generic data table component
│       ├── dialog.tsx
│       ├── drawer.tsx
│       ├── dropdown-menu.tsx
│       ├── form.tsx              # React Hook Form integration
│       ├── hover-card.tsx
│       ├── input-otp.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── menubar.tsx
│       ├── navigation-menu.tsx
│       ├── pagination.tsx
│       ├── popover.tsx
│       ├── progress.tsx
│       ├── radio-group.tsx
│       ├── resizable.tsx
│       ├── scroll-area.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── sheet.tsx
│       ├── sidebar.tsx           # Customizable sidebar component
│       ├── skeleton.tsx
│       ├── slider.tsx
│       ├── sonner.tsx
│       ├── switch.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       ├── textarea.tsx
│       ├── toast.tsx
│       ├── toaster.tsx
│       ├── toggle-group.tsx
│       ├── toggle.tsx
│       ├── tooltip.tsx
│       ├── use-mobile.tsx        # Hook for mobile detection
│       └── use-toast.ts          # Hook for toast notifications
├── hooks/
│   ├── use-mobile.tsx            # Client-side hook for mobile detection
│   └── use-toast.ts              # Client-side hook for toast notifications
├── lib/
│   ├── auth.ts                   # Authentication logic
│   ├── data/                     # Data fetching functions
│   │   ├── banking.ts
│   │   ├── clients.ts
│   │   ├── dashboard.ts
│   │   ├── expenses.ts
│   │   ├── products.ts
│   │   ├── purchases.ts
│   │   ├── sales.ts
│   │   └── suppliers.ts
│   ├── supabase/                 # Supabase client configurations
│   │   ├── client.ts
│   │   ├── middleware.ts
│   │   ├── server.ts
│   │   └── types.ts              # Supabase database types
│   └── utils.ts                  # Utility functions (e.g., `cn`)
├── public/                       # Static assets
│   ├── placeholder-logo.png
│   ├── placeholder-logo.svg
│   ├── placeholder-user.jpg
│   ├── placeholder.jpg
│   └── placeholder.svg
├── scripts/                      # SQL scripts for database setup
│   ├── complete_supabase_schema.sql
│   ├── complete_supabase_schema_corrected.sql
│   ├── complete_supabase_schema_final_correction.sql
│   ├── complete_supabase_schema_final_correction_v2.sql
│   ├── insert_initial_stock.sql
│   ├── insert_initial_stock_corrected.sql
│   └── supabase_schema.sql
├── styles/
│   └── globals.css               # Additional global styles (if any)
├── .env.local.example            # Example environment variables
├── .gitignore                    # Git ignore file
├── .npmrc                        # npm configuration
├── components.json               # shadcn/ui components configuration
├── deploy.sh                     # Deployment script (if any)
├── next.config.js                # Next.js configuration
├── package.json                  # Project dependencies and scripts
├── postcss.config.js             # PostCSS configuration
├── postcss.config.mjs            # PostCSS configuration (ESM)
├── tailwind.config.ts            # Tailwind CSS configuration
└── tsconfig.json                 # TypeScript configuration
\`\`\`

## Contributing

Feel free to contribute to this project by opening issues or submitting pull requests.

## License

[Specify your license here, e.g., MIT License]
