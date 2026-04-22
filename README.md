# 🪙 KoinX Tax Dashboard

A high-fidelity, professional crypto tax-loss harvesting dashboard designed for the modern investor. This application helps users optimize their capital gains by identifying unrealized losses and simulating "harvesting" strategies to reduce tax liability.

![Dashboard Preview](https://img.shields.io/badge/UI-Premium-blue)
![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20TypeScript%20%7C%20Vite-61DAFB)

## 🚀 Key Features

- **Tax-Loss Harvesting Dashboard:** Real-time calculation of STCG (Short-Term Capital Gains) and LTCG (Long-Term Capital Gains) before and after harvesting.
- **Live Market Data:** Integrated with the **CoinGecko API** to fetch real-time prices and market performance for the top 100 cryptocurrencies.
- **Interactive Data Visualization:** Dynamic area charts showing tax savings trends with interactive tooltips and timeframe toggles (1W/1M).
- **Session Persistence:** Built-in session management using `localStorage` ensures users stay logged in across page refreshes.
- **Premium Light Theme:** A high-contrast, corporate-grade interface focused on readability, clarity, and modern fintech aesthetics.
- **Responsive Design:** Optimized for a seamless experience across desktop and larger tablet views.

## 🛠️ Technology Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Vanilla CSS (Modern CSS Variables & Glassmorphism)
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **API:** CoinGecko Public API

## 📦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## 📐 Project Structure

- `src/components/`: Modular React components (StatsCard, AssetTable, TaxSavingsChart, etc.)
- `src/data/`: Mock data and initial state constants.
- `src/types.ts`: Centralized TypeScript interfaces and types.
- `src/index.css`: Global design system and theme variables.

## 📄 License

This project is built for the KoinX assessment. All rights reserved.
