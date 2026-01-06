# TallyRent

The Operating System for Rental Businesses. A vertical SaaS designed to help small audiovisual equipment rental businesses track availability, prevent double bookings, and accept payments online.

## Core Features

- **Real-time Availability**: Automatically tracks inventory counts across date ranges to prevent double bookings.
- **Online Bookings**: Customers can browse inventory, select dates, and book equipment instantly.
- **Stripe Integration**: Automated deposits and payments via Stripe Connect.
- **Inventory Management**: CRUD operations for products with quantity tracking.
- **Dashboard**: A monthly calendar view for owners to manage bookings and status.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Payments**: Stripe & Stripe Connect (Express)
- **Styling**: Tailwind CSS
- **Validation**: Zod
- **Internationalization**: next-intl

## Getting Started

### Prerequisites

- Node.js & npm/bun
- PostgreSQL database
- Stripe Account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/davidldv/TallyRent.git
   cd TallyRent
   ```

2. Install dependencies:
   ```bash
   bun install
   # or npm install
   ```

3. Set up environment variables:
   Copy the `.env.example` to `.env` and fill in your details:
   ```bash
   DATABASE_URL="postgresql://..."
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_PUBLISHABLE_KEY="pk_test_..."
   STRIPE_CONNECT_CLIENT_ID="ca_..."
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. Initialize the database:
   ```bash
   bun prisma migrate dev
   # or npx prisma migrate dev
   ```

5. Run the development server:
   ```bash
   bun dev
   # or npm run dev
   ```

## Architecture

### Data Models
- **User**: Authentication and account management.
- **Business**: Profile linked to the user (One business per owner).
- **Product**: Rental items with quantity, price, and deposit settings.
- **Booking**: Date-range reservations with status tracking (PENDING, CONFIRMED, CANCELLED).
- **Payment**: Stripe payment records linked to bookings.

### Availability Logic
The system uses a date-range checking algorithm to ensure product units are never overbooked. It calculates `(Total Quantity) - (Active Bookings in Range)` to determine availability.
