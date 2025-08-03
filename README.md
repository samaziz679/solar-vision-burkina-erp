# Solar Vision Burkina ERP

This is a comprehensive ERP (Enterprise Resource Planning) system designed for Solar Vision Burkina, built with Next.js, React, and Supabase.

## Features

*   **User Authentication**: Secure login and session management using Supabase Auth.
*   **Dashboard**: Overview of key business metrics (stock value, sales, purchases, expenses, bank balance).
*   **Inventory Management**:
    *   Add, view, edit, and delete products.
    *   Track product quantities, units, types, and pricing (purchase, retail 1, retail 2, wholesale).
    *   Product image management.
*   **Sales Management**:
    *   Record sales transactions.
    *   Track products sold, quantities, and total amounts.
*   **Purchases Management**:
    *   Record purchase transactions.
    *   Track products purchased, quantities, and total amounts.
*   **Expense Tracking**:
    *   Log and categorize business expenses.
    *   Track expense dates, amounts, descriptions, categories, and notes.
*   **Client Management**:
    *   Manage client information.
*   **Supplier Management**:
    *   Manage supplier information.
*   **Banking Operations**:
    *   Record bank deposits and withdrawals.
    *   Track bank entry dates, types, amounts, and descriptions.
*   **Responsive Design**: Optimized for various screen sizes.

## Technologies Used

*   **Next.js**: React framework for building full-stack web applications.
*   **React**: JavaScript library for building user interfaces.
*   **Supabase**: Open-source Firebase alternative for database (PostgreSQL), authentication, and storage.
*   **Tailwind CSS**: Utility-first CSS framework for styling.
*   **Shadcn/ui**: Reusable UI components built with Radix UI and Tailwind CSS.
*   **Lucide React**: Beautifully simple and customizable open-source icons.
*   **date-fns**: Modern JavaScript date utility library.

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

1.  **Create a Supabase Project**: Go to [Supabase](https://supabase.com/) and create a new project.
2.  **Get your API Keys**:
    *   Navigate to "Project Settings" > "API".
    *   Copy your `Project URL` and `anon public` key.
    *   Go to "Project Settings" > "API Keys" and copy your `service_role` key (keep this secret).
3.  **Configure Environment Variables**: Create a `.env.local` file in the root of your project and add the following:

    \`\`\`env
    NEXT_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_PROJECT_URL"
    NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
    SUPABASE_SERVICE_ROLE_KEY="YOUR_SUPABASE_SERVICE_ROLE_KEY"
    NEXT_PUBLIC_SITE_URL="http://localhost:3000" # Or your deployment URL
    \`\`\`
    Replace the placeholder values with your actual Supabase credentials.

4.  **Run SQL Migrations**:
    *   Open your Supabase project dashboard.
    *   Go to "SQL Editor".
    *   Run the SQL scripts located in the `scripts/` directory in the following order to set up your database schema:
        *   `scripts/supabase_schema.sql` (initial schema)
        *   `scripts/add_quantity_sold_to_sales.sql` (if applicable)
        *   `scripts/add_total_price_to_sales.sql` (if applicable)
        *   `scripts/add_unit_to_products.sql` (if applicable)
        *   `scripts/add_date_to_bank_entries.sql` (if applicable)
        *   `scripts/add_type_to_bank_entries.sql` (if applicable)
        *   `scripts/add_description_to_products.sql` (if applicable)
        *   `scripts/add_unique_constraint_to_product_name.sql` (if applicable)
        *   `scripts/complete_supabase_schema.sql` (if you want to apply all at once)
        *   `scripts/complete_supabase_schema_corrected.sql` (if you want to apply all at once)
        *   `scripts/complete_supabase_schema_final_correction.sql` (if you want to apply all at once)
        *   `scripts/complete_supabase_schema_final_correction_v2.sql` (if you want to apply all at once)
        *   `scripts/insert_initial_stock.sql` (to seed initial product data)
        *   `scripts/insert_initial_stock_corrected.sql` (corrected initial product data)
        *   `scripts/insert_initial_stock_from_csv.sql` (if you have CSV data)
        *   `scripts/load_opening_stock_from_csv_v2.sql` (if you have CSV data)
        *   `scripts/load_opening_stock_from_pasted_data.sql` (if you have pasted data)

    **Important**: Run these scripts carefully and in the correct order to avoid conflicts.

### 4. Run the Development Server

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

*   `app/`: Next.js App Router pages and API routes.
*   `components/`: Reusable React components (UI, custom components).
*   `lib/`: Utility functions, Supabase client setup, data fetching logic.
*   `public/`: Static assets (images, fonts).
*   `scripts/`: SQL scripts for database schema and seeding.
*   `styles/`: Global CSS styles.

## Contributing

Feel free to contribute to this project by submitting issues or pull requests.

## License

[MIT License](LICENSE) (You might want to add a LICENSE file if not already present)
\`\`\`
