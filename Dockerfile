FROM node:22.23.5-alpine AS base
RUN apk add --no-cache libc6-compat && corepack enable pnpm
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

# Étape "tools" : CLI Payload (migrations, seed). Utilisée par le service `migrate`.
FROM base AS tools
# production : désactive le `push` Drizzle (schéma modifié uniquement via migrations).
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .

FROM tools AS builder
ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
# Le build ne parle pas à la base (pages dynamiques) ; valeurs factices requises par la config.
ENV DATABASE_URL=postgres://x:x@localhost:5432/x PAYLOAD_SECRET=build
RUN pnpm run build

FROM node:22.23.5-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0 MEDIA_DIR=/app/media
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs \
 && mkdir -p /app/media && chown nextjs:nodejs /app/media
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
