## Strukly Backend

TypeScript + Express backend following Domain-Driven Design (DDD) with Prisma.

### Quick start

Prerequisites:

- Node.js 22+ and npm
- A PostgreSQL database (local or hosted)

Setup:

1) Copy environment variables and set your database URL

```powershell
Copy-Item .env.example .env
# then edit .env and set DATABASE_URL
```

2) Install dependencies

```powershell
npm install
```

3) Generate Prisma client (run this whenever `prisma/schema.prisma` changes; `npm run build` also does it automatically)

```powershell
npm run prisma:generate
```

4) Start the server

For development (watch mode):

```powershell
npm run dev
```

Or build and run the bundled output:

```powershell
npm start
```

The server defaults to http://localhost:3000 (see `src/index.ts`). A simple GET `/` returns "Hello World!".

### Environment variables

- `DATABASE_URL` — PostgreSQL connection string (see `.env.example`). Read by `prisma.config.ts` for Prisma CLI commands and by the app to construct the `@prisma/adapter-pg` connection.

If/when you add Prisma models, create and apply migrations (Prisma loads its config from `prisma.config.ts`):

```powershell
npx prisma migrate dev --name init
```

### Project layout (DDD)

```
src/
	application/
		use_cases/                 # Application services (orchestrate domain for a specific user flow)
	domain/
		aggregates/                # Aggregates (consistency boundaries) e.g. Transaction
		entities/                  # Entities with identity e.g. TransactionHeader, TransactionItem
		values/                    # Value Objects e.g. Money, TransactionID, TransactionItemID
		ports/                     # Domain ports (interfaces) to external services e.g. ImageToTransaction
		repositories/              # Domain repository interfaces (persistence contracts)
		services/                  # Domain services (business logic independent of frameworks)
	infrastructure/
		controllers/               # Web/controllers (Express) — translate HTTP <-> app/use cases
		repositories/              # Adapters implementing domain repository interfaces (e.g., Prisma)
		schemas/                   # HTTP Schemas
		language_model/            # Adapters to LLMs/AI providers implementing domain ports
	generated/
		prisma/                    # Generated Prisma client (gitignored, created by npm run prisma:generate)
```

How the layers fit together:

- Infrastructure invokes Application use cases (e.g., an Express controller calls a use case).
- Application coordinates domain behavior by calling Domain Services.
- Domain Services depend only on domain interfaces (Ports/Repositories) — not concrete tech.
- Infrastructure provides concrete adapters that implement those interfaces (e.g., Prisma repo, LLM adapter).

Concrete examples in this codebase:

- `application/use_cases/create_transaction_from_image.ts` — Orchestrates creating transactions from a receipt image by calling `TransactionService`.
- `domain/services/transaction_service.ts` — Business logic using ports: `IImageToTransactionPort` and `ITransactionRepository`.
- `domain/aggregates/transaction.ts`, `entities/*`, `values/*` — Core domain model.
- `infrastructure/controllers/transaction_controller.ts` — Placeholder for HTTP endpoints.

### Scripts

- `npm run dev` — Run the server from source in watch mode (`tsx`).
- `npm start` — Build, then run the bundle (`node --enable-source-maps dist/index.js`).
- `npm run start:prod` — Apply pending migrations (`prisma migrate deploy`), then run the bundle (used in the Docker image).
- `npm run build` — Typecheck (`tsc --noEmit`), generate the Prisma client, then bundle to `dist/index.js` with esbuild.
- `npm run typecheck` — Typecheck only, no output.
- `npm run clean` — Remove `dist/`.
- `npm test` — Run the test suite (Vitest).
- `npm run test:watch` — Run the test suite in watch mode.
- `npm run prisma:generate` — Generate the Prisma client.
- `npm run prisma:migrate:prod` — Apply pending migrations (`prisma migrate deploy`).

### Prisma

This project uses Prisma 7 with the [`prisma-client`](https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7) generator and a driver adapter:

- The client is generated to `src/generated/prisma` (gitignored) and imported from `src/generated/prisma/client` — **not** from `@prisma/client`.
- The datasource URL is not in `prisma/schema.prisma`; it is provided by `prisma.config.ts` via `env("DATABASE_URL")`, and the runtime client connects through `@prisma/adapter-pg` (see `src/composition_root.ts`).
- `prisma.config.ts` resolves `DATABASE_URL` **lazily** (via a getter) so that `prisma generate`/`npm run build` work without a database URL — e.g. during `docker build`, where there is no `.env` file. Commands that actually need the database (`prisma migrate deploy`) still fail fast if `DATABASE_URL` is missing.
- If you change the schema, run `npm run prisma:generate` to refresh the client (or just `npm run build`, which does it for you).
- Add models to `prisma/schema.prisma`, then run `npx prisma migrate dev` to create/apply migrations.
- Prisma error classes (e.g. `Prisma.PrismaClientKnownRequestError`) come from the generated client's public `Prisma` namespace — avoid importing from its `internal/` modules.

### Adding a new feature (typical steps)

1) Model the domain change (`domain/aggregates`, `entities`, `values`) as needed.
2) Add/extend domain ports/repositories (`domain/ports`, `domain/repositories`).
3) Implement a use case in `application/use_cases` that coordinates the behavior.
4) Provide infrastructure adapters (e.g., Prisma repository, HTTP controller) that implement the domain interfaces.
5) Wire routes/controllers to call the use case.

### Notes

- Keep business rules inside the Domain layer; avoid leaking framework concerns into it.
- Infrastructure can be swapped without touching the Domain by keeping clean interfaces.

