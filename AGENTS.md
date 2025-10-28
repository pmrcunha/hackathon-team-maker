# Agent Guidelines for hackathon-team-maker

## Build/Test Commands
- **Development**: `pnpm dev` (uses tsx watch)
- **Build**: `pnpm run build` (TypeScript compilation)
- **Start**: `pnpm start` (runs compiled JS)
- **No test suite configured** - add tests if needed

## Code Style & Conventions
- **TypeScript**: Strict mode enabled, uses ESNext/NodeNext modules
- **Imports**: Use `.js` extensions for local imports (verbatimModuleSyntax)
- **JSX**: Uses Hono JSX (`jsxImportSource: "hono/jsx"`)
- **Database**: Drizzle ORM with SQLite, schema in `src/db/schema.ts`
- **API**: Hono framework with consistent error handling patterns
- **Types**: Export/import types from schema, use `any` for table definitions
- **Error Handling**: Try-catch with structured JSON responses `{success, error, data}`
- **Naming**: camelCase for variables/functions, PascalCase for components
- **File Structure**: Views in `src/views/`, DB logic in `src/db/`
- **Static Files**: Served from `/static/` route

## Database
- Uses Drizzle migrations, config in `drizzle.config.ts`
- SQLite database file: `hackathon.db`
- Run migrations with drizzle-kit commands
