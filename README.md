# 🧺 LaundryGo - Realtime Laundry Service App

A full-stack Node.js web app converted from a pizza delivery app into a **realtime laundry service platform** with two roles: **Customer** and **Service Provider**.

## Features

### Customer
- Browse available laundry providers sorted by rating
- View each provider's services, prices (per kg or per item), and ratings
- Book services by selecting items, quantity, pickup address, and date
- Track order status in realtime (via Socket.io)
- Rate and review completed orders

### Service Provider
- Register as a provider with business name, description, and service area
- Dashboard showing all incoming customer requests
- Stats: Pending, Active, Delivered, Completed
- Update order status (Confirm → Picked Up → Washing → Ready → Delivered → Completed)
- Realtime notification when new orders come in

## Tech Stack
- **Backend**: Node.js, Express, MongoDB (Mongoose), Passport.js
- **Realtime**: Socket.io
- **Frontend**: EJS, Tailwind CSS
- **Auth**: Passport Local Strategy + bcrypt + sessions

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env
# Fill in MONGO_CONNECTION_URL and COOKIE_SECRET

# 3. Run the app
npm start
# or for development:
npx nodemon index.js
```

## Data Models

### User
- `role`: `customer` | `provider`
- Provider fields: `businessName`, `description`, `phone`, `address`, `services[]`, `rating`, `ratingCount`
- Each service: `name`, `pricePerKg` or `pricePerItem`, `unit` (kg/item)

### Order
- Links `customerId` → `providerId`
- `items[]`: serviceName, quantity, unit, pricePerUnit, subtotal
- `status`: request_placed → confirmed → picked_up → washing → ready → delivered → completed
- Supports rating/review after completion

## Order Status Flow
```
request_placed → confirmed → picked_up → washing → ready → delivered → completed
```
