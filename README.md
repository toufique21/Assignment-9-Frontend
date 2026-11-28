# MentorLagbe Client

## Purpose

MentorLagbe Client is the Next.js frontend for a role-based tutoring marketplace. Students can browse and apply for tuitions, tutors can post and manage tuitions and applicants, and admins can approve tuitions, manage users, and review Stripe payment records. The app uses BetterAuth for sessions, JWT-backed requests to the Express API, and hosted Stripe Checkout for Premium upgrades.

## Live URLs

- Production client: `https://mentorlagbe-client-vert.vercel.app`
- Production server: `https://mentorlagbe-server-lyart.vercel.app`
- Local client: `http://localhost:3000`

## Admin Credentials

| Field    | Value                 |
| -------- | --------------------- |
| Email    | `Admin@admin.com`     |
| Password | `Admin@admin.com`     |
| Role     | `admin`               |

> Use these credentials for local/demo access only. Change them before deploying to production.

## Key Features

- Role-based dashboards for **Student**, **Tutor**, and **Admin**.
- BetterAuth email/password sign-in and sign-up.
- JWT token endpoint that converts the BetterAuth session into a short-lived backend token.
- Public tuition browsing with only approved and active tuitions.
- Tuition details page with tutor profile information and an application form.
- Student applications with duplicate prevention and free-plan limits.
- Tutor tuition CRUD, active/inactive control, and applicant status management.
- Admin user management, role changes, tuition moderation, and payment records.
- Profile page with view/edit modes and ImgBB profile photo upload.
- Hosted Stripe Checkout for one-time Premium purchases.
- Success and failed payment pages with client-side checkout confirmation.
- Glass-style orange UI with responsive layouts and Sonner toast notifications.
- Route-level skeleton loaders and custom 404/error pages with recovery actions.

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

### Scripts

| Script              | Command                 |
| ------------------- | ----------------------- |
| Start dev server    | `npm run dev`           |
| Production build    | `npm run build`         |
| Start production    | `npm run start`         |
| Lint                | `npm run lint`          |
| TypeScript check    | `npm run typecheck`     |
| Format TypeScript   | `npm run format`        |

### Environment

For local development, create or update `.env` with the required values:

```env
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-better-auth-secret
JWT_SECRET=same-secret-used-by-the-backend

SERVER_URL=http://localhost:8000
NEXT_PUBLIC_API_URL=http://localhost:8000

MONGODB_URI=your-mongodb-uri

STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
NEXT_PUBLIC_IMGBB_API_KEY=your-imgbb-api-key
```

For Vercel, set `BETTER_AUTH_URL` to the **permanent client URL** and the API URLs to the **deployed backend URL**:

```env
BETTER_AUTH_URL=https://mentorlagbe-client-vert.vercel.app
NEXT_PUBLIC_BETTER_AUTH_URL=https://mentorlagbe-client-vert.vercel.app
BETTER_AUTH_TRUSTED_ORIGINS=https://mentorlagbe-client-vert.vercel.app,https://*.vercel.app
BETTER_AUTH_SECRET=your-better-auth-secret
JWT_SECRET=same-secret-used-by-the-backend

SERVER_URL=https://mentorlagbe-server-lyart.vercel.app
NEXT_PUBLIC_API_URL=https://mentorlagbe-server-lyart.vercel.app

MONGODB_URI=your-mongodb-uri

STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
NEXT_PUBLIC_IMGBB_API_KEY=your-imgbb-api-key
```

Do not add a trailing slash to URLs. The browser auth client calls the current hostname, and BetterAuth trusts the Vercel preview hostnames through `*.vercel.app`, so signing in and opening the dashboard work on either the permanent URL or a deployment URL. `JWT_SECRET` must match the backend `JWT_SECRET`, and `BETTER_AUTH_SECRET` must stay the same across local and deployed environments or existing sessions will stop working. Redeploy after changing `NEXT_PUBLIC_*` values because they are baked into the client build.

## NPM Packages Used

### Dependencies

| Package                       | Version   | Purpose                                      |
| ----------------------------- | --------- | -------------------------------------------- |
| `@base-ui/react`              | `^1.9.0`  | Accessible UI primitives                     |
| `@better-auth/mongo-adapter`  | `^1.7.27` | MongoDB adapter for BetterAuth               |
| `@stripe/stripe-js`           | `^10.3.0` | Stripe browser SDK                           |
| `better-auth`                 | `^1.7.27` | Authentication and session management        |
| `class-variance-authority`    | `^0.7.1`  | Component variant styling                    |
| `cn`                          | `^0.5.2`  | Class name helper                            |
| `lucide-react`                | `^1.78.0` | Icon library                                 |
| `mongodb`                     | `^7.9.1`  | Direct Mongo access for app routes           |
| `next`                        | `^16.4.6` | React framework                              |
| `next-themes`                 | `^0.4.6`  | Theme support                                |
| `react`                       | `19.3.1`  | UI library                                   |
| `react-dom`                   | `19.3.1`  | React DOM renderer                           |
| `shadcn`                      | `^4.23.0` | Component tooling                            |
| `sonner`                      | `^2.0.8`  | Toast notifications                          |
| `stripe`                      | `^23.2.0` | Stripe server SDK                            |
| `tw-animate-css`              | `^1.4.0`  | Tailwind animation utilities                 |

### Dev Dependencies

| Package                       | Version   | Purpose                     |
| ----------------------------- | --------- | --------------------------- |
| `@tailwindcss/postcss`        | `^4`      | Tailwind CSS PostCSS plugin |
| `@types/node`                 | `^20`     | Node.js TypeScript types    |
| `@types/react`                | `^19`     | React TypeScript types      |
| `@types/react-dom`            | `^19`     | React DOM TypeScript types  |
| `eslint`                      | `^9`      | Linting                     |
| `eslint-config-next`          | `16.4.6`  | Next.js ESLint rules        |
| `prettier`                    | `^3.10.1` | Code formatting             |
| `prettier-plugin-tailwindcss` | `^0.8.1`  | Tailwind class sorting      |
| `tailwindcss`                 | `^4`      | Utility-first CSS framework |
| `typescript`                  | `^5`      | Static type checking        |
