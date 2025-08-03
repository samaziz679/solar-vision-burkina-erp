# Solar Vision Burkina ERP

This is an Enterprise Resource Planning (ERP) system designed for Solar Vision Burkina, built with Next.js, React, and Supabase.

## Features

-   **User Authentication**: Secure login and user management using Supabase Auth.
-   **Dashboard**: Overview of key business metrics (stock value, sales, purchases, expenses, bank balance).
-   **Inventory Management**: Track products, quantities, purchase prices, and multiple sales prices.
-   **Client Management**: Manage client information.
-   **Supplier Management**: Manage supplier information.
-   **Sales Management**: Record sales, link to clients and products.
-   **Purchase Management**: Record purchases, link to suppliers and products.
-   **Expense Tracking**: Log and categorize business expenses.
-   **Banking Operations**: Track deposits and withdrawals.
-   **Responsive Design**: Optimized for various screen sizes.

## Technologies Used

-   **Next.js**: React framework for production.
-   **React**: Frontend library.
-   **Supabase**: Backend-as-a-Service for database, authentication, and storage.
-   **Tailwind CSS**: For styling and responsive design.
-   **Shadcn/ui**: Reusable UI components.
-   **Lucide React**: Icon library.

## Getting Started

### Prerequisites

-   Node.js (v18.18.0 or later)
-   npm or Yarn
-   A Supabase project

### 1. Clone the repository

\`\`\`bash
git clone https://github.com/your-username/solar-vision-burkina-erp.git
cd solar-vision-burkina-erp
\`\`\`

### 2. Install dependencies

\`\`\`bash
npm install
# or
yarn install
\`\`\`

### 3. Set up Supabase

1.  **Create a new Supabase project**: Go to [Supabase](https://supabase.com/) and create a new project.
2.  **Get your API keys**:
    -   Go to `Project Settings` > `API`.
    -   Copy your `Project URL` and `anon public` key.
3.  **Configure Environment Variables**:
    -   Create a `.env.local` file in the root of your project (copy from `.env.local.example`).
    -   Add your Supabase Project URL and Anon Key:
