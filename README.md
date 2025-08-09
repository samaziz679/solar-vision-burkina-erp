# Shop Management System

This is a comprehensive shop management system built with Next.js, React, and Supabase. It provides functionalities for managing clients, suppliers, products (inventory), sales, purchases, expenses, and banking.

## Features

-   **Authentication**: User login and session management using Supabase Auth.
-   **Dashboard**: Overview of key metrics like total sales, expenses, profit, and recent activities.
-   **Clients Management**: Add, view, edit, and delete client information.
-   **Suppliers Management**: Add, view, edit, and delete supplier information.
-   **Product/Inventory Management**: Track products, their prices, stock levels, categories, and associated suppliers.
-   **Sales Management**: Record sales, including multiple products per sale, quantities, and total amounts.
-   **Purchases Management**: Record purchases from suppliers, including multiple products per purchase.
-   **Expenses Tracking**: Log and categorize business expenses.
-   **Banking**: Manage bank accounts and balances.
-   **Responsive Design**: Optimized for various screen sizes.
-   **Server Actions**: Utilizes Next.js Server Actions for efficient data mutations.
-   **Shadcn/ui**: Styled with Shadcn/ui components for a modern and accessible UI.

## Technologies Used

-   **Next.js 14**: React framework for building full-stack web applications.
-   **React**: Frontend library for building user interfaces.
-   **Supabase**: Open-source Firebase alternative for database (PostgreSQL), authentication, and storage.
-   **Tailwind CSS**: Utility-first CSS framework for rapid styling.
-   **Shadcn/ui**: Reusable UI components built with Radix UI and Tailwind CSS.
-   **Zod**: TypeScript-first schema declaration and validation library.
-   **React Hook Form**: Forms with easy validation.
-   **Lucide React**: Beautifully simple and customizable open-source icons.
-   **Date-fns**: Modern JavaScript date utility library.

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

-   Node.js (v18 or higher)
-   npm or Yarn
-   Git

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/your-username/shop-management-system.git
cd shop-management-system
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
# or
yarn install
\`\`\`

### 3. Set Up Supabase

1.  **Create a Supabase Project**: Go to [Supabase](https://supabase.com/) and create a new project.
2.  **Get API Keys**:
    -   Navigate to `Project Settings` -> `API`.
    -   Copy your `Project URL` and `anon public` key.
3.  **Configure Environment Variables**:
    Create a `.env.local` file in the root of your project and add the following:

    \`\`\`env
    NEXT_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_PROJECT_URL"
    NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
    NEXT_PUBLIC_SITE_URL="http://localhost:3000" # Or your deployment URL
    \`\`\`
4.  **Run SQL Migrations**:
    Use the Supabase SQL Editor to run the provided SQL scripts in the `scripts/` directory in the following order:

    -   `scripts/supabase_schema.sql`: Creates all necessary tables.
    -   `scripts/complete_supabase_schema_corrected.sql`: Adds `user_id` columns to tables.
    -   `scripts/complete_supabase_schema_final_correction.sql`: Makes `user_id` NOT NULL and adds Row Level Security (RLS) policies.
    -   `scripts/complete_supabase_schema_final_correction_v2.sql`: Adds triggers to automatically set `user_id` on insert.
    -   `scripts/insert_initial_stock.sql`: Inserts initial product stock.
    -   `scripts/insert_initial_stock_corrected.sql`: Corrects initial product stock insertion.

    These scripts will set up your database schema and initial data, including RLS policies to ensure users can only access their own data.

### 4. Run the Development Server

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

-   `app/`: Next.js App Router pages and API routes.
    -   `dashboard/`: Main dashboard and layout.
    -   `banking/`, `clients/`, `expenses/`, `inventory/`, `purchases/`, `sales/`, `suppliers/`: Pages for each module.
    -   `actions.ts`: Server Actions for database operations.
-   `components/`: Reusable React components.
    -   `ui/`: Shadcn/ui components.
    -   `layout/`: Layout-specific components (e.g., sidebar).
    -   Module-specific components (e.g., `clients/client-form.tsx`).
-   `lib/`: Utility functions and Supabase client setup.
    -   `data/`: Functions for fetching data from Supabase.
    -   `supabase/`: Supabase client configurations.
-   `hooks/`: Custom React hooks.
-   `scripts/`: SQL scripts for database schema and seeding.
-   `styles/`: Global CSS.
-   `public/`: Static assets.

## Deployment

This project is designed to be easily deployed to Vercel. Refer to the `DEPLOYMENT_GUIDE.md` file for detailed instructions.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

## License

This project is open-source and available under the [MIT License](LICENSE).
