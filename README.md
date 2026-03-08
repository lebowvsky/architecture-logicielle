# Architecture Logicielle

A knowledge base about software architecture patterns, built as a static website.

> **Note:** All content is written in **French**.

## About

This project is a comprehensive reference guide covering fundamental architectural patterns in software engineering — from monolithic architectures to distributed systems. Each pattern is presented with clear explanations, visual diagrams, code examples, and comparisons to help developers understand when and why to use them.

### Covered patterns

The landing page provides an overview of **20 architectural patterns** organized into 6 categories:

1. **Monolithic Architectures** — Monolith, Layered/N-Tier, MVC/MVP/MVVM
2. **Clean Architectures** — Clean Architecture, Onion Architecture, Hexagonal (Ports & Adapters), DDD
3. **Service-Oriented** — SOA, Microservices, Serverless/FaaS
4. **Event-Driven & Reactive** — EDA, Event Sourcing, CQRS
5. **Modular & Component-Based** — Plugin/Microkernel, Component-Based, Modular Monolith
6. **Distributed & Cloud-Native** — Service Mesh, Saga Pattern, Micro-Frontends

Dedicated detail pages provide in-depth explanations with:
- Concentric circle diagrams (CSS-only)
- Layer-by-layer code examples (TypeScript/NestJS)
- Dependency rule visualizations
- Comparison tables (good vs. bad practices)
- File structure trees
- Unit test examples

## Tech Stack

- [Nuxt 4](https://nuxt.com/) (Vue 3, file-based routing, auto-imports)
- TypeScript
- No external UI library — pure CSS with CSS custom properties

## Getting Started

```bash
# Install dependencies
npm install

# Start development server at http://localhost:3000
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## License

Private project.
