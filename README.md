# Solar Vision Burkina ERP

This is a comprehensive Enterprise Resource Planning (ERP) system designed for Solar Vision Burkina, focusing on managing inventory, sales, purchases, clients, suppliers, expenses, and banking transactions.

## Features

*   **User Authentication:** Secure login and user management using Supabase Auth.
*   **Dashboard:** Overview of key business metrics (total products, sales, purchases, expenses, banking balance, recent activities, low stock alerts).
*   **Inventory Management:**
    *   Add, view, edit, and delete products.
    *   Track product stock levels.
*   **Sales Management:**
    *   Record new sales transactions.
    *   View and manage sales history.
*   **Purchases Management:**
    *   Record new purchase transactions.
    *   Track purchases from suppliers.
*   **Client Management:**
    *   Maintain a database of clients.
    *   View client details and their purchase history.
*   **Supplier Management:**
    *   Manage supplier information.
    *   Track purchases made from each supplier.
*   **Expense Tracking:**
    *   Log and categorize business expenses.
    *   Monitor spending.
*   **Banking Transactions:**
    *   Record income and expense transactions.
    *   View banking history and current balance.
*   **Responsive Design:** Optimized for various screen sizes.

## Technologies Used

*   **Next.js 14 (App Router):** React framework for building the web application.
*   **React:** Frontend library for building user interfaces.
*   **TypeScript:** Strongly typed JavaScript.
*   **Tailwind CSS:** Utility-first CSS framework for styling.
*   **shadcn/ui:** Reusable UI components built with Radix UI and Tailwind CSS.
*   **Supabase:** Backend-as-a-Service for database (PostgreSQL), authentication, and real-time subscriptions.
*   **Vercel:** Platform for deployment.
*   **Zod:** Schema validation library.
*   **Lucide React:** Icon library.
*   **Recharts:** Charting library for data visualization on the dashboard.
*   **Sonner:** Toast notifications.

## Getting Started

### Prerequisites

*   Node.js (v18.x or later)
*   npm or Yarn
*   Git

### 1. Clone the Repository

\`\`\`bash
git clone <your-repository-url>
cd solar-vision-burkina-erp
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
# or
yarn install
\`\`\`

### 3. Set up Supabase

1.  **Create a new Supabase project:** Go to [Supabase](https://supabase.com/) and create a new project.
2.  **Get your API keys:**
    *   Navigate to `Project Settings` -> `API`.
    *   Copy your `Project URL` and `anon public` key.
3.  **Set up Environment Variables:** Create a `.env.local` file in the root of your project and add the following:

    \`\`\`env
    NEXT_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_URL"
    NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
    NEXT_PUBLIC_SITE_URL="http://localhost:3000" # For local development
    \`\`\`

    Replace `YOUR_SUPABASE_URL` and `YOUR_SUPABASE_ANON_KEY` with your actual Supabase project details.
4.  **Run SQL Migrations:**
    *   In your Supabase project, go to `SQL Editor`.
    *   Run the SQL script located at `scripts/supabase_schema.sql` (or `scripts/complete_supabase_schema.sql` for the full schema) to set up your database tables and Row Level Security (RLS) policies.
    *   Ensure you enable the `uuid-ossp` extension in your Supabase project (Database -> Extensions -> search for `uuid-ossp` and enable it).
    *   (Optional) Run `scripts/insert_initial_stock.sql` to populate some initial product data. Remember to replace `'YOUR_USER_ID'` with an actual user ID from your `auth.users` table if you have one, or insert a dummy one for testing.
5.  **Configure Auth Redirect URLs:**
    *   In your Supabase project, go to `Authentication` -> `URL Configuration`.
    *   Add `http://localhost:3000` to the "Redirect URLs" list. When deploying to Vercel, you'll also add your Vercel deployment URL here.

### 4. Run the Development Server

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

*   `app/`: Next.js App Router pages, layouts, and API routes.
*   `components/`: Reusable React components, including `shadcn/ui` components.
*   `lib/`: Utility functions, Supabase client setup, and data fetching logic.
*   `public/`: Static assets.
*   `scripts/`: SQL scripts for database schema and seeding.
*   `styles/`: Global CSS.
*   `hooks/`: Custom React hooks.

## Contributing

Feel free to fork the repository and contribute.

## License

This project is open-source and available under the MIT License.
