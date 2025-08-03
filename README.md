# Solar Vision Burkina ERP

This is an Enterprise Resource Planning (ERP) system for Solar Vision Burkina, built with Next.js, React, and Supabase.

## Features

-   **Authentication**: User login and session management.
-   **Dashboard**: Overview of key metrics.
-   **Inventory Management**: Track products, quantities, and pricing.
-   **Sales Management**: Record and manage sales transactions.
-   **Client Management**: Maintain client information.
-   **Supplier Management**: Manage supplier details.
-   **Purchases Management**: Track product purchases from suppliers.
-   **Expenses Management**: Record and categorize business expenses.
-   **Banking Management**: Log deposits and withdrawals.
-   **Role-Based Access Control**: Secure access based on user roles.

## Getting Started

### Prerequisites

-   Node.js (v18 or higher)
-   npm or yarn
-   Supabase project

### Installation

1.  **Clone the repository:**
    \`\`\`bash
    git clone https://github.com/your-username/solar-vision-burkina-erp.git
    cd solar-vision-burkina-erp
    \`\`\`

2.  **Install dependencies:**
    \`\`\`bash
    npm install
    # or
    yarn install
    \`\`\`

3.  **Set up Supabase:**
    -   Create a new project on [Supabase](https://supabase.com/).
    -   Go to `Settings > API` and copy your `Project URL` and `anon public` key.
    -   Rename `.env.example` to `.env.local` and update the following variables:
