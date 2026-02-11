# WhatsApp Bot Builder

Production-ready monorepo for a multi-tenant WhatsApp Bot Builder.

## Monorepo layout
- `apps/api` NestJS API
- `apps/web` Next.js web app
- `apps/mobile` Expo mobile app
- `packages/shared` Shared types + schemas
- `packages/ui` Shared web UI components

## Local setup
1. Install dependencies: `pnpm install`
2. Create env files:
   - `apps/api/.env` (copy from `.env.example`)
   - `apps/web/.env` (copy from `.env.example`)
   - `apps/mobile/.env` (copy from `.env.example`)
3. Start local infrastructure:
   - `docker-compose up -d postgres redis`
4. Run Prisma:
   - `pnpm --filter @apps/api prisma:generate`
   - `pnpm --filter @apps/api prisma:migrate`
   - `pnpm --filter @apps/api seed`
5. Start apps:
   - API: `pnpm --filter @apps/api dev`
   - Web: `pnpm --filter @apps/web dev`
   - Mobile: `pnpm --filter @apps/mobile dev`

## Meta WhatsApp Cloud API setup
1. In Meta Developers, create an app and add the WhatsApp product.
2. Configure the webhook callback URL:
   - `https://<your-domain>/api/webhooks/whatsapp`
3. Set the verify token (store the same value in the app settings).
4. Subscribe to `messages` and `message_deliveries` events.
5. Add your phone number ID and business ID to the WhatsApp connection screen.
6. Use the Connection Test button to validate credentials.

### Local webhook testing (ngrok alternative)
- Use a tunnel like `cloudflared` or `ngrok` to expose `localhost:4000`.
- Update the webhook URL in Meta to `https://<tunnel>/api/webhooks/whatsapp`.

## Scripts
- `pnpm dev` run all dev servers
- `pnpm build` build all packages
- `pnpm test` run unit tests

## Production notes
- Use a managed Postgres (RDS, Supabase, Neon) and Redis (ElastiCache, Upstash).
- Store secrets in AWS Secrets Manager or Render/Fly secrets.
- Scale API horizontally; queue workers can be separate replicas.
- Use HTTPS and strict CORS allowlists.
- Render blueprint: `deploy/render/render.yaml`.

## Security notes
- `APP_ENCRYPTION_KEY` is required for encrypting Meta access tokens at rest. Use `openssl rand -base64 32`.
- Store refresh tokens in HttpOnly cookies for web; use secure storage for mobile (`expo-secure-store`).
- Never log tokens; request logging redaction is configured by default.
- Rotate verify tokens and access tokens periodically; revoke on workspace removal.
- Prefer per-workspace rate limits and webhook deduplication (included).

## Production checklist
- Set `NODE_ENV=production` and remove dev secrets.
- Confirm `CORS_ORIGIN` allowlist is correct.
- Use Redis-backed throttling and queue workers in separate deployments.
- Run Prisma migrations in CI/CD before deploying API.
- Configure health checks for `/api/health`.
- Enable autoscaling on API + queue workers.
