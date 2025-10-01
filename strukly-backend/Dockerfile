FROM node:lts-alpine AS base

WORKDIR /app

FROM base AS deps
COPY package-lock.json ./
COPY package.json ./
RUN npm ci

FROM deps AS builder
COPY . .
RUN npm run prisma:generate
RUN npm run build
RUN npm prune --production

FROM builder AS runner
CMD ["npm", "run", "start:prod"]
