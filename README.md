# Finance Dashboard


A clean, responsive, and interactive finance dashboard UI built with modern web technologies. This application helps users track their financial activity with beautiful dark-mode supported charts, role-based controls, and insightful data summaries.

## 🚀 Features

- **Dashboard Overview**: Highly visual cards and charts (Line Chart, Pie Chart) displaying balance, income, and expense trends.
- **Transactions Management**: Complete tabular view of all transactions with searching, filtering (by type and category), and sorting.
- **Role-Based UI**:
  - **Viewer**: Read-only access to the dashboard and transactions.
  - **Admin**: Full access. Can add new transactions, edit existing ones, and delete records via an intuitive modal interface.
- **AI-like Insights**: Automatic generation of insights based on transaction history (e.g. tracking highest spending category, month-over-month comparisons).
- **Persistent State**: Utilizes React Context API and LocalStorage to save your data, theme preference, and role between sessions.
- **Modern Styling**: Designed using Tailwind CSS with robust Dark/Light mode support, fluid micro-animations, and glassmorphic elements.

## 🧱 Tech Stack

- **React.js** (Functional Components + Hooks)
- **Vite** (Next Generation Frontend Tooling)
- **Tailwind CSS v3** (Utility-first styling)
- **Recharts** (Data Visualization)
- **React Router v6** (Client-side routing)
- **Lucide React** (Beautiful, consistent icons)
- **date-fns** (Date manipulation)

## 📁 Project Structure

```
src/
├── components/
│   ├── Charts/
│   │   ├── LineChart.jsx  # Trend of balance over time
│   │   └── PieChart.jsx   # Expenses broken down by category
│   ├── Filters.jsx        # Search and drop-down filters for the transaction table
│   ├── RoleSwitcher.jsx   # Global toggle between 'viewer' and 'admin'
│   ├── Sidebar.jsx        # Responsive navigation sidebar
│   ├── SummaryCard.jsx    # Highlights for Total Balance, Income, etc.
│   └── TransactionTable.jsx # Main data table with sort headers and action buttons
├── context/
│   └── AppContext.jsx     # Global State Management + LocalStorage sync
├── data/
│   └── mockData.js        # Initial data structures for the app
├── pages/
│   ├── Dashboard.jsx      # Top-level overview and charts
│   ├── Insights.jsx       # Simple data-drawn observations
│   └── Transactions.jsx   # Detailed ledger view with Admin modals
├── App.jsx                # Layout shell and react-router setup
├── index.css              # Global styles and Tailwind Dark Mode CSS variables
└── main.jsx               # Application entry point
```

## 🛠️ Setup Instructions

Since this project was generated in an environment without Node pre-installed, you'll need Node.js and `npm` (or `yarn`/`pnpm`) installed on your system to run it.

1. **Install Dependencies**:
   Open a terminal in the project root (`d:\Assignment Finance`) and run:
   ```bash
   npm install
   ```

2. **Start the Development Server**:
   ```bash
   npm run dev
   ```

3. **View the Application**:
   Open your browser and navigate to the local URL provided by Vite (typically `http://localhost:5173`).

## 🧠 State Management & Persistence

The application utilizes React's Context API (`AppContext.jsx`) to avoid prop drilling and provide global access to:
- `transactions`: The core array of financial records.
- `role`: The user's mock permission level ('viewer' or 'admin').
- `theme`: The user's styling preference ('light' or 'dark').

All three state variables are synchronized with the browser's `localStorage` via simple `useEffect` hooks. This ensures your dashboard feels like a real desktop application—data survives page refreshes entirely without a backend.

The `RoleSwitcher` acts as a pure frontend simulation. In `TransactionTable.jsx` and `Transactions.jsx`, action buttons (Add, Edit, Delete) are conditionally rendered depending on whether `role === 'admin'`. Furthermore, the `addTransaction`, `editTransaction`, and `deleteTransaction` functions deliberately fail fast if invoked by a non-admin, adding a secondary layer of mock security to the frontend logic.

The live Link : https://finance-dashboard-khaki-eight.vercel.app/
