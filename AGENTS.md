# AGENTS.md

This file contains guidelines for agentic coding assistants working in this repository.

## Development Commands

### Build & Development
- `npm run dev` - Start Next.js development server
- `npm run build` - Build production bundle
- `npm run start` - Start production server

### Code Quality
- `npm run lint` - Run Biome linter to check code quality
- `npm run format` - Format code with Biome (auto-fixes issues)
- **Note**: Always run `npm run lint` and `npm run format` after making changes

### Testing
- **No test framework currently configured** - This project does not have tests set up yet
- When adding tests, configure a test framework (Jest, Vitest, or Playwright) and update this file

## Code Style Guidelines

### TypeScript & Types
- Strict mode enabled in `tsconfig.json`
- Use `import type` for type-only imports: `import type { Metadata } from "next"`
- Type React.ReactNode and other React types explicitly when needed
- Use Zod for runtime validation when dealing with external data/APIs
- Infer types from schemas: `z.infer<typeof schema>`

### Imports & Organization
- Group external imports first, then internal imports
- Use `@/*` path alias for src/ imports (configured in tsconfig)
- Place hooks and utility imports after component imports
- Keep imports alphabetically organized within groups
- Biome auto-organizes imports on save

```typescript
import * as React from "react";
import { IconExample } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
```

### Component Patterns
- Client components must start with `"use client";` directive at the very top
- Use React Server Components by default (no `"use client"`)
- Compound components follow shadcn/ui pattern
- Use forwardRef for components that need ref forwarding
- Use className prop with cn() utility for conditional styling

### Styling with Tailwind CSS
- Use Tailwind utility classes for styling
- Combine classes with `cn()` utility from `@/lib/utils`
- Leverage Tailwind's dark mode support with `dark:` prefix
- Use design tokens from CSS variables: `--primary`, `--muted`, etc.
- Maintain spacing with Tailwind's `spacing` scale
- Avoid custom CSS when possible

### Naming Conventions
- **Components**: PascalCase - `DataTable`, `AppSidebar`, `Button`
- **Functions**: camelCase - `useIsMobile`, `cn`, `getCoreRowModel`
- **Constants**: UPPER_SNAKE_CASE - `MOBILE_BREAKPOINT`, `chartConfig`
- **Types/Interfaces**: PascalCase - `ColumnDef`, `VisibilityState`
- **Files**: kebab-case - `app-sidebar.tsx`, `use-mobile.ts`

### Formatting & Code Style
- **Indentation**: 2 spaces (configured in biome.json)
- **Semicolons**: Use semicolons (Biome default)
- **Quotes**: Double quotes for strings
- **Trailing commas**: Include for objects, arrays, and function calls
- **Line length**: Keep lines reasonably long, prioritize readability
- Biome enforces these rules automatically

### React Patterns
- Use hooks from `react` package: `useState`, `useEffect`, `useMemo`, `useCallback`
- Use React Compiler (enabled in next.config.ts) for automatic optimization
- State management: Use React hooks for local state
- Global state: This project doesn't use a state library yet, use Zustand when needed
- Server actions: Use Next.js App Router patterns for form submissions
- Data fetching: Use Next.js built-in data fetching patterns

### File Structure
```
src/
├── app/           # Next.js App Router pages and layouts
├── components/
│   └── ui/       # shadcn/ui components
├── hooks/        # Custom React hooks
└── lib/          # Utility functions and helpers
```

### Error Handling
- Use try/catch for async operations
- Display errors with Sonner toasts: `toast.error("Error message")`
- Use Zod for validation and provide clear error messages
- Handle edge cases gracefully (empty states, loading states)
- Use TypeScript to catch errors at compile time

### UI Components (shadcn/ui)
- Use shadcn/ui components when available
- Extend components using `className` prop and `cn()` utility
- Use class-variance-authority (CVA) for component variants
- Keep components in `src/components/ui/`
- Compound components should be in the same file when small

### Accessibility
- Include aria-labels for interactive elements: `aria-label="Close"`
- Use semantic HTML elements
- Provide screen reader-only text with `.sr-only` class
- Support keyboard navigation
- Ensure sufficient color contrast

### Performance
- Use React.lazy for code splitting large components
- Leverage Next.js Image component for images
- Use React.memo for expensive components
- Optimize re-renders with useMemo and useCallback
- Use dynamic imports for heavy dependencies

### Comments
- **Do NOT add comments unless explicitly requested**
- Code should be self-documenting
- Use descriptive variable and function names
- Only comment complex business logic or algorithms

### Best Practices
- Prefer functional components with hooks over class components
- Use TypeScript for all files (no .js files)
- Keep components focused and single-responsibility
- Extract reusable logic into custom hooks
- Use composition over inheritance
- Follow existing code patterns when possible

## Development Workflow

1. Make changes to the codebase
2. Run `npm run format` to auto-format
3. Run `npm run lint` to check for issues
4. Manually test the changes
5. Commit changes (if requested by user)

## Key Dependencies
- **Next.js 16**: App Router, React Server Components
- **React 19**: Latest React features with React Compiler
- **TypeScript**: Type safety with strict mode
- **Biome**: Fast linter and formatter (replaces ESLint + Prettier)
- **Tailwind CSS 4**: Utility-first styling
- **Radix UI**: Unstyled accessible primitives
- **shadcn/ui**: Styled components built on Radix UI
- **Zod**: Schema validation
- **TanStack Table**: Data tables with sorting/filtering
- **DnD Kit**: Drag and drop functionality
- **Recharts**: Charting library
- **Sonner**: Toast notifications
