FROM node:20-alpine AS base

RUN corepack enable
WORKDIR /app

COPY pnpm-workspace.yaml package.json tsconfig.base.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages/shared/package.json packages/shared/package.json
COPY packages/ui/package.json packages/ui/package.json

RUN pnpm install

COPY apps/api apps/api
COPY packages/shared packages/shared
COPY packages/ui packages/ui

RUN pnpm --filter @apps/api build

EXPOSE 4000
CMD ["node", "apps/api/dist/main.js"]
