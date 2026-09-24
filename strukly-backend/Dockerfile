FROM node:lts-alpine AS base

WORKDIR /app

FROM base AS deps
COPY package-lock.json ./
COPY package.json ./
RUN npm ci

FROM deps AS builder
COPY . .
RUN npm run build

FROM builder AS migrator
CMD ["npm", "run", "prisma:migrate:prod"]

FROM builder AS runner
RUN npm prune --production
CMD ["npm", "run", "start:prod"]
