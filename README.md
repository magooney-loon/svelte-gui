# Svelte GUI Overview

A complete app shell, component library and utility toolkit for building modern SvelteKit applications with optional Pocketbase backend.

## What is Svelte GUI?

Svelte GUI provides everything you need to build modern web applications:

- **UI Components** - Ready-to-use, fully typed components
- **Design System** - Consistent styling with Tailwind CSS
- **Utilities** - Toast notifications, form validation, theme management
- **TypeScript Support** - Full type safety throughout
- **PocketBase Integration** - Optional full-stack backend support

## Library Structure

```
src/lib/
├── components/
│   ├── partials/       # Form, layout, data, feedback components
│   ├── main/           # Core app components
│   └── icons/          # Icon library (100+ icons)
├── api/                # API Client integration
└── utils/              # Utilities and helpers
```

## Core Features

- **Component Composition** - Small, focused components that work together
- **Mobile Responsive** - Mobile-first design and touch support
- **Accessibility** - WCAG compliant with keyboard navigation
- **Performance** - Optimized bundle size and runtime performance
- **Dark Mode** - Built-in theme switching with persistence

## Technology Stack

- **Svelte 5** - Components with runes
- **SvelteKit** - Routing framework
- **Pocketbase** - Optional backend
- **TypeScript** - Type safety & IDE support
- **Tailwind CSS 4** - Utility-first styling
- **Vite** - Build tool and dev server

## Perfect For

- SaaS dashboards and admin panels
- E-commerce applications
- Internal tools and data dashboards
- Progressive web applications
- Content management systems

# Installation Guide

## Option 1: Standalone Svelte GUI

Clone and run the Svelte GUI application directly.

### 1. Clone the Repository

```bash
git clone https://github.com/magooney-loon/svelte-gui.git
cd svelte-gui
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development

```bash
npm run dev
```

Your app is now running at `http://localhost:5173` with all components, themes, and utilities ready to use.

---

## Option 2: Full-Stack with PocketBase Extension

Use the PocketBase extension and add Svelte GUI as the frontend.

### 1. Clone PocketBase Extension

```bash
git clone https://github.com/magooney-loon/pb-ext.git
cd pb-ext
```

### 2. Add Svelte GUI to Frontend

```bash
git clone https://github.com/magooney-loon/svelte-gui.git frontend
```

### 3. Follow pb-ext Documentation

Refer to the [pb-ext repository](https://github.com/magooney-loon/pb-ext) for setup and running instructions specific to that project.

---
