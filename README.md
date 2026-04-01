# Advanced Library Management System Web Application

## 1) Complete Folder Structure

```text
Rudra-AI-Assistent/
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── books.html
│   ├── students.html
│   ├── borrow.html
│   ├── return.html
│   ├── publishers.html
│   ├── css/style.css
│   └── js/script.js
└── backend/
    ├── server.js
    ├── seed.js
    ├── package.json
    ├── .env.example
    ├── config/db.js
    ├── middleware/
    │   ├── authMiddleware.js
    │   └── errorMiddleware.js
    ├── controllers/
    ├── models/
    ├── routes/
    └── utils/
```

## 2) Frontend
- Multi-page vanilla JS admin panel with responsive sidebar.
- Includes cards, tables, modal form, real-time search, toast notifications, dark mode toggle, loading spinner.

## 3) Backend
- Node.js + Express API.
- JWT authentication for protected routes.
- Mongoose models for Admin, Student, Book, Publisher, Borrow, Return.
- Borrow rules enforced (max 5 active books, due date +30 days).
- Return module computes late fee ($2/day overdue).
- PDF report export for borrow history.
- QR code generation for each book.
- Due-date email notification endpoint.

## 4) MongoDB Schema
- **Student:** student_id, name, department, email, phone.
- **Book:** book_id, title, author, price, publisher, category, available_copies, cover_image, qr_code.
- **Publisher:** publisher_id, publisher_name, publisher_address.
- **Borrow:** student_id, book_id, borrow_date, due_date, status.
- **Return:** student_id, book_id, return_date, late_fee.

## 5) API Routes
### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Dashboard
- `GET /api/dashboard/stats`

### Books
- `GET /api/books?search=&page=&limit=&sortBy=&order=&category=`
- `POST /api/books`
- `PUT /api/books/:id`
- `DELETE /api/books/:id`

### Students
- `GET /api/students`
- `POST /api/students`
- `PUT /api/students/:id`
- `DELETE /api/students/:id`

### Publishers
- `GET /api/publishers`
- `POST /api/publishers`
- `PUT /api/publishers/:id`
- `DELETE /api/publishers/:id`

### Borrow/Return/Overdue
- `POST /api/transactions/borrow`
- `POST /api/transactions/return`
- `GET /api/transactions/overdue`
- `POST /api/transactions/notify-due`

### Reports
- `GET /api/reports/borrow-history`
- `GET /api/reports/student-history?student_id=ST001`
- `GET /api/reports/book-availability`
- `GET /api/reports/borrow-history/pdf`

> All routes except `/api/auth/*` and `/api/health` require `Authorization: Bearer <JWT>`.

## 6) Installation Steps
1. Install Node.js (v18+), npm, MongoDB.
2. Backend setup:
   ```bash
   cd backend
   cp .env.example .env
   npm install
   ```
3. Update `.env` values (Mongo URI, JWT secret, optional SMTP settings).

## 7) Run Project Locally
1. Start backend:
   ```bash
   cd backend
   npm run dev
   ```
2. Seed demo data (optional):
   ```bash
   npm run seed
   ```
3. Start frontend (any static server), e.g.:
   ```bash
   cd ../frontend
   python3 -m http.server 5500
   ```
4. Open:
   - `http://localhost:5500/index.html`

## 8) Example Data for Testing
- Admin: `admin@library.com` / `admin123` (from seed)
- Students: `ST001`, `ST002`
- Books: `BK001`, `BK002`
- Publishers: `PUB001`, `PUB002`

## Security & Validation
- bcrypt password hashing.
- JWT auth middleware for API protection.
- express-validator on auth/book core endpoints.
- Centralized error middleware.

## Notes
- This is a full working foundation with advanced modules, ready for further enhancement (charts, richer filters/sorting UI controls, cron-based auto reminders, and stricter validators).
