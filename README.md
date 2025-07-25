# ☕ Sora Coffee Stock Management System

A modern inventory and activity log management system for coffee shops, built with **Next.js**, **Prisma**, and **PostgreSQL**.

---

## 🚀 Getting Started

### 1. **Clone the Repository**

```bash
git clone https://github.com/your-username/sora-coffee.git
cd sora-coffee
```

### 2. **Install Dependencies**

```bash
npm install
# or
yarn install
```

### 3. **Configure Environment Variables**

Copy the example environment file and fill in your database and JWT secrets:

```bash
cp .env.example .env
```

Edit `.env` and set:

- `DATABASE_URL` (your PostgreSQL connection string)
- `JWT_SECRET` (a strong secret for authentication)

### 4. **Run Database Migrations**

```bash
npx prisma migrate dev
```

### 5. **Start the Development Server**

```bash
npm run dev
# or
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
src/
  app/
    api/                # API routes (REST endpoints)
      activity-log/     # Activity log endpoints
      inventory/        # Inventory endpoints
      category/         # Category endpoints
      suppliers/        # Supplier endpoints
      unit/             # Unit endpoints
      auth/             # Authentication endpoints
    components/         # Reusable UI components
    hooks/              # Custom React hooks
    lib/                # Utility libraries (Prisma, auth, etc.)
    globals.css         # Global styles
    layout.tsx          # App layout
    page.tsx            # Main entry page
    ...
  prisma/
    schema.prisma       # Prisma schema
  ...
```

---

## 🛠️ Features

- **Authentication**: Secure login with JWT.
- **Inventory Management**: Add, update, and delete items with category, supplier, and unit support.
- **Stock Opname**: Track and update stock levels.
- **Activity Log**: See who changed what and when.
- **Suppliers & Categories**: Manage suppliers and item categories.
- **Responsive UI**: Works on desktop and mobile.

---

## 🧑‍💻 Development

### Useful Scripts

- `npm run dev` — Start the development server
- `npx prisma studio` — Open Prisma Studio to view/edit your database
- `npx prisma migrate dev` — Run database migrations

### API Endpoints

- `POST /api/auth` — User authentication
- `GET /api/inventory` — List inventory items
- `PATCH /api/inventory` — Update stock and log activity
- `GET /api/activity-log` — Fetch activity logs
- `POST /api/category` — Add a new category
- ...and more

---

## 📝 Example API Usage

**Update Stock (with JWT token):**
```bash
curl -X PATCH http://localhost:3000/api/inventory \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{"id":"item_id","updateStockQty":5,"updateType":"increase"}'
```

**Add Category:**
```bash
curl -X POST http://localhost:3000/api/category \
  -H "Content-Type: application/json" \
  -d '{"title":"Espresso Beans"}'
```

---

## 🖥️ UI Preview

- **Dashboard**: Overview of inventory and quick stats.
- **Inventory Page**: List, search, and manage items.
- **Activity Log**: See all recent actions.
- **Sidebar**: Easy navigation between features.

---

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 📦 Deployment

Deploy easily on [Vercel](https://vercel.com/) or your favorite Node.js hosting.

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an