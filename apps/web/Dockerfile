FROM node:20-alpine AS base

RUN corepack enable
WORKDIR /app

COPY pnpm-workspace.yaml package.json tsconfig.base.json ./
COPY apps/web/package.json apps/web/package.json
COPY packages/shared/package.json packages/shared/package.json
COPY packages/ui/package.json packages/ui/package.json

RUN pnpm install

COPY apps/web apps/web
COPY packages/shared packages/shared
COPY packages/ui packages/ui

RUN pnpm --filter @apps/web build

EXPOSE 3000
CMD ["pnpm", "--filter", "@apps/web", "start"]
