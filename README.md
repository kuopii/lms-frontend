# 📚 Koupii Learning Management System (LMS)

A modern, interactive Learning Management System designed specifically for English language courses, built with cutting-edge web technologies.

## 🎯 Overview

**Koupii LMS** is a comprehensive Learning Management System that provides an intuitive and structured platform for both instructors and students. Our system focuses on creating an engaging learning environment with powerful course management capabilities.

### Key Features

- **📋 Course Management** - Create, organize, and maintain comprehensive learning modules
- **🎓 Interactive Learning** - Seamless lessons, assignments, and assessments workflow
- **📊 Progress Tracking** - Real-time monitoring of student learning and performance
- **🌍 Multi-language Support** - Internationalization with theme customization options
- **📱 Responsive Design** - Optimized for desktop, tablet, and mobile devices

## 🛠️ Tech Stack

Built with modern, industry-standard technologies for optimal performance and maintainability:

### Core Framework
- **[Next.js 15](https://nextjs.org/)** - React 19 with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development

### Styling & UI
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful and accessible component library

### State & Data Management
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Lightweight state management
- **[TanStack Query](https://tanstack.com/query)** - Data fetching and caching
- **[React Hook Form](https://react-hook-form.com/)** - Performant form handling
- **[Zod](https://zod.dev/)** - Schema validation

### Additional Libraries
- **[NextAuth.js](https://next-auth.js.org/)** - Authentication solution
- **[next-intl](https://next-intl-docs.vercel.app/)** - Internationalization
- **[Recharts](https://recharts.org/en-US/)** - Data visualization
- **[dnd-kit](https://dndkit.com/)** - Drag and drop functionality

## 🏗️ Architecture

The project implements a **hybrid architecture** combining **Atomic Design** principles with **Feature-based Architecture** for maximum scalability and maintainability.

### Atomic Design Principles
- **UI Components (Atoms & Molecules)** - Smallest reusable building blocks
- **Container Components (Organisms)** - Complex components built from UI primitives
- **Pages** - Complete page layouts and routing components

### Feature-based Modules
Each major feature is self-contained with:
- `api/` - API integration hooks
- `components/` - Feature-specific components
- `pages/` - Feature routing and page components

## 📁 Project Structure

```
koupii-lms/
├── 📁 app/                    # Next.js App Router (routes, layouts, pages)
├── 📁 components/             # Shared components
│   ├── 📁 ui/                 # Reusable UI components (Button, Input, Modal, etc.)
│   ├── 📁 container/          # Composite components
│   └── 📁 pages/              # Static page components
├── 📁 data/                   # Static and mock data
├── 📁 features/               # Feature-based modules
│   ├── 📁 api/                # API hooks (TanStack Query, Axios)
│   ├── 📁 components/         # Feature-specific components
│   └── 📁 pages/              # Feature-specific pages
├── 📁 helpers/                # Utility functions
├── 📁 hooks/                  # Custom React hooks
├── 📁 i18n/                   # Internationalization setup
├── 📁 lib/                    # API client, utilities, constants
├── 📁 messages/               # Translation JSON files
├── 📁 providers/              # Application providers
├── 📁 public/                 # Static assets
├── 📁 store/                  # Zustand stores
├── 📁 types/                  # TypeScript definitions
└── 📁 validators/             # Zod validation schemas
```

### Feature Module Example: Authentication

```
features/auth/
├── 📁 api/                    # Authentication API hooks
│   ├── use-post-login.ts      # Login request hook
│   ├── use-logout.ts          # Logout request hook
│   └── use-register.ts        # Registration request hook
├── 📁 components/             # Auth-specific components
│   ├── login-form.tsx         # Login form component
│   ├── register-form.tsx      # Registration form component
│   └── auth-indicator.tsx     # Session status indicator
└── 📁 pages/                  # Auth pages
    ├── login.tsx              # Login page
    ├── register.tsx           # Registration page
    └── callback.tsx           # OAuth callback page
```

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:
- **Node.js** v20 or higher
- **npm** v9+ (or Yarn/pnpm)
- **Git**

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/koupii-lms.git
   cd koupii-lms
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Configure environment variables**
   ```bash
   cp example.env .env.local
   ```
   
   Update `.env.local` with your configuration:
   - API base URL
   - NextAuth secret & providers
   - Database credentials
   - Other required environment variables

4. **Run development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```
   
   Visit [http://localhost:3000](http://localhost:3000) to see the application.

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Docker Support

Run with Docker Compose:
```bash
docker compose up --build
```

## 🔧 Development Workflow

### Code Quality Assurance

This project includes **Husky** pre-configured Git hooks:

- **Pre-commit Hook**
  - Runs TypeScript type checking
  - Executes ESLint for code quality
  - Ensures consistent code formatting

- **Pre-push Hook**
  - Validates successful build compilation
  - Prevents broken code from reaching the repository

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checking
```

## 🌍 Internationalization

The application supports multiple languages using `next-intl`. Translation files are located in the `messages/` directory.

To add a new language:
1. Create a new JSON file in `messages/`
2. Add the locale configuration in `i18n/config.ts`
3. Update the language selector component

## 📊 Performance & Optimization

- **Code Splitting** - Automatic route-based splitting with Next.js
- **Image Optimization** - Built-in Next.js image optimization
- **Caching Strategy** - Implemented with TanStack Query
- **Bundle Analysis** - Use `npm run analyze` to examine bundle size

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is developed and maintained by **PT Magercoding Digital Indonesia**.

**All rights reserved.** Unauthorized use, modification, or distribution of this project is strictly prohibited without prior written permission.

---

<div align="center">

**Built with ❤️ by PT Magercoding Digital Indonesia**

[Documentation](docs/) • [API Reference](docs/api/) • [Contributing](CONTRIBUTING.md)

</div>
