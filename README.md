# University Management System (S4_UMS)

A full-stack University Management System built with Next.js, TypeScript, Prisma, and PostgreSQL. This system bridges the gap between Students, Teachers, and Admins, providing a unified platform for academic and administrative management.

## Features
- **Role-based Dashboards**: Separate interfaces for Students, Teachers, and Admins.
- **Student Management**: Enrollment, attendance, grades, feedback, and profile management.
- **Teacher Management**: Faculty profiles, feedback, timetable, and course assignments.
- **Admin Panel**: Manage students, teachers, departments, timetables, library, and more.
- **Library System**: Book borrowing, returning, and tracking.
- **Auditorium Booking**: Manage events and bookings.
- **Feedback System**: Students can rate and review courses and faculty.
- **Authentication**: Secure login and registration for all roles.

## Tech Stack
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, MUI
- **Backend**: Next.js API routes, Prisma ORM
- **Database**: PostgreSQL (see `.env` for connection string)
- **Other**: bcryptjs (passwords), Heroicons, etc.

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm, yarn, or pnpm
- PostgreSQL database (local or cloud)

### Setup
1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd Sem4_UMS
   ```
2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Configure Environment**
   - Copy `.env.example` to `.env` and set your `DATABASE_URL` for PostgreSQL.
4. **Set up the database**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   # (Optional) Seed data:
   npx ts-node prisma/seed.ts
   ```
5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure
- `pages/` - Next.js pages (UI & API routes)
- `components/` - Reusable React components
- `lib/` - Auth and Prisma client
- `prisma/` - Prisma schema and seed scripts
- `data/` - Static/mock data
- `styles/` - Global styles (Tailwind)
- `types/` - TypeScript type definitions

## Database
- Uses PostgreSQL. See `prisma/schema.prisma` for models.
- Migrations managed by Prisma.
- To view/manage data visually, run:
  ```bash
  npx prisma studio
  ```

## Common Commands
- `npm run dev` - Start dev server
- `npx prisma migrate dev` - Run DB migrations
- `npx prisma generate` - Regenerate Prisma client
- `npx prisma studio` - Visual DB browser

## Troubleshooting
- If you see errors about missing relations in API routes, run `npx prisma generate` to sync the Prisma client.
- For slow page loads, ensure your database is running and the Prisma client is up to date.

## Documentation
- See the `UNIVERSITY Management System.pdf` and `UMS Report.docx` for detailed project documentation and design.

## License
MIT
