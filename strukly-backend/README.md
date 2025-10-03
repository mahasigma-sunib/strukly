## Strukly Backend

TypeScript + Express backend following Domain-Driven Design (DDD) with Prisma.

### Quick start

Prerequisites:

- Node.js 18+ and npm
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

3) Generate Prisma client (run this whenever `prisma/schema.prisma` changes)

```powershell
npx prisma generate
```

4) Start the server

```powershell
npm start
```

The server defaults to http://localhost:3000 (see `src/index.ts`). A simple GET `/` returns "Hello World!".

Optional build to JS (outputs to `dist/`):

```powershell
npm run build
```

### Environment variables

- `DATABASE_URL` — PostgreSQL connection string used by Prisma (see `.env.example`).

If/when you add Prisma models, create and apply migrations:

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
		dto/                       # DTOs for IO boundaries (HTTP, messaging, etc.)
		language_model/            # Adapters to LLMs/AI providers implementing domain ports
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

- `npm start` — Run server with ts-node (`src/index.ts`).
- `npm run build` — Compile TypeScript to `dist/`.

### Prisma

- Prisma client output is configured to `generated/prisma` (see `prisma/schema.prisma`).
- If you change the schema, run `npx prisma generate` to refresh the client.
- Add models to `prisma/schema.prisma`, then run `npx prisma migrate dev` to create/apply migrations.

### Adding a new feature (typical steps)

1) Model the domain change (`domain/aggregates`, `entities`, `values`) as needed.
2) Add/extend domain ports/repositories (`domain/ports`, `domain/repositories`).
3) Implement a use case in `application/use_cases` that coordinates the behavior.
4) Provide infrastructure adapters (e.g., Prisma repository, HTTP controller) that implement the domain interfaces.
5) Wire routes/controllers to call the use case.

### Notes

- Keep business rules inside the Domain layer; avoid leaking framework concerns into it.
- Infrastructure can be swapped without touching the Domain by keeping clean interfaces.

