# Solar Vision Burkina ERP

This is a comprehensive Enterprise Resource Planning (ERP) system designed for Solar Vision Burkina, a company specializing in solar energy solutions. The application helps manage various aspects of the business, including inventory, sales, purchases, clients, suppliers, expenses, and banking transactions.

## Features

*   **User Authentication:** Secure login and user management using Supabase Auth.
*   **Dashboard:** Overview of key business metrics, recent activities, and low stock alerts.
*   **Inventory Management:** Track products, their stock levels, cost prices, and selling prices.
*   **Sales Management:** Record sales transactions, link to clients and products, and track revenue.
*   **Purchases Management:** Record purchase transactions, link to suppliers and products, and track costs.
*   **Client Management:** Maintain a database of clients with their contact information.
*   **Supplier Management:** Maintain a database of suppliers with their contact information.
*   **Expense Tracking:** Log and categorize business expenses.
*   **Banking Transactions:** Record income and expense transactions to manage cash flow.
*   **Responsive Design:** Optimized for various screen sizes, from desktop to mobile.

## Technologies Used

*   **Next.js 14:** React framework for building the web application (App Router).
*   **React:** Frontend library for building user interfaces.
*   **Tailwind CSS:** Utility-first CSS framework for styling.
*   **shadcn/ui:** Reusable UI components built with Radix UI and Tailwind CSS.
*   **Supabase:** Backend-as-a-Service for database (PostgreSQL), authentication, and storage.
*   **Zod:** Schema declaration and validation library.
*   **React Hook Form:** Forms library with easy validation integration.
*   **Lucide React:** Open-source icon library.
*   **Recharts:** Composable charting library built with React and D3.

## Getting Started

### Prerequisites

*   Node.js (v18.x or later)
*   npm or yarn
*   A Supabase project

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/samaziz679/solar-vision-burkina-erp.git
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
2.  **Get your Project URL and Anon Key:** You can find these in your project settings under `API`.
3.  **Configure Environment Variables:** Create a `.env.local` file in the root of your project and add the following:

    \`\`\`env
    NEXT_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_URL"
    NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
    NEXT_PUBLIC_SITE_URL="http://localhost:3000" # For local development
    \`\`\`

4.  **Run SQL Migrations:** Use the SQL scripts in the `scripts/` directory to set up your database schema. You can run these directly in the Supabase SQL Editor.
    *   `scripts/supabase_schema.sql`: Creates all necessary tables and enums.
    *   `scripts/complete_supabase_schema_corrected.sql`: Applies corrections for `updated_at` timestamps.
    *   `scripts/complete_supabase_schema_final_correction.sql`: Further ensures `NOT NULL` constraints and triggers.
    *   `scripts/complete_supabase_schema_final_correction_v2.sql`: Final version of schema corrections.
    *   `scripts/insert_initial_stock.sql` / `scripts/insert_initial_stock_corrected.sql`: Populates initial data (optional).

    **Important:** After running the schema scripts, ensure you enable Row Level Security (RLS) for all tables in your Supabase dashboard under "Authentication" -> "Policies". Then, create policies to allow `select`, `insert`, `update`, and `delete` operations based on `user_id` for authenticated users.

### 4. Run the Development Server

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Deployment

This application is designed for deployment on [Vercel](https://vercel.com/). Refer to the `DEPLOYMENT_GUIDE.md` file for detailed instructions on deploying this project to Vercel.

## Contributing

Feel free to fork the repository, make improvements, and submit pull requests.

## License

This project is open-source and available under the MIT License.
