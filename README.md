# OasisRecepManagement (web)

Web app quản lý nhân viên, trạng thái phòng, checkout checklist và KPI (Admin/Staff).

## Local development

### 1) Cài dependencies

```bash
cd web
npm install
```

### 2) Set `DATABASE_URL`

Tạo Postgres (local hoặc Railway) và set biến môi trường:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

### 3) Migrate + seed

```bash
npm run prisma:migrate
npm run prisma:seed
```

### 4) Run

```bash
npm run dev
```

Mở `http://localhost:3000/login`

## Tài khoản seed để test

- Admin: `admin` / `admin123`
- Staff: `nv01` / `nv123`

## Deploy Railway (gợi ý)

- **Variables**: set `DATABASE_URL` (Railway Postgres)
- **Build**: `npm run build`
- **Start**: `npm run start`
- **Post-deploy**: chạy `npm run prisma:migrate` và `npm run prisma:seed` (một lần)

