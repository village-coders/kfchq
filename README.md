# KFC Headquarters Portal

Executive React + Vite portal for **KFC Headquarters**, connected to the shared `hfaKfc-Backend` API.

## Features
- **Executive Overview**: Network KPIs, top franchise compliance bars, and recent HQ submissions.
- **Franchises & Stores Explorer**: Master-detail browser of all franchises and every store operating under each franchise.
- **Approved Halal Products**: Searchable & category-filterable (`Frozen`, `Chilled`, `Ambient`) product catalog.
- **Certificates Registry**: View all store Halal certificates with an interactive certificate preview modal.
- **Product & Franchise Requests**: Submit **New Product Requests** (with required category selection: `Frozen`, `Chilled`, `Ambient`) and **New Franchise Requests** directly to `POST /api/requests`.

## Getting Started
```bash
cd kfc-headquarters
npm install
npm run dev
```
Runs on `http://localhost:5175` and connects to `VITE_API_BASE_URL` (`http://localhost:5050/api`).
