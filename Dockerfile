FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL=postgres://postgres:postgres@db:5432/sge2

ENV NEXTAUTH_SECRET=Pg4sUUBSEgcfKcuLU824guy+kSQjdrJz4jc+bC8IhBM=
ENV NEXTAUTH_URL=http://localhost:8000/

ENV DISCORD_CLIENT_ID=1269340993493401693
ENV DISCORD_CLIENT_SECRET=EEiD__s-MgqrEuEPB6fxzwwlR85RWOjX

ENV KEYCLOAK_CLIENT_ID=sge-client
ENV KEYCLOAK_CLIENT_SECRET=Bd95qHTM34FAZdcdjWuXUlOTAW6TfQrl
ENV KEYCLOAK_ISSUER=http://localhost:8080/realms/sge2

ENV SMTP_EMAIL_USER=testutn88@gmail.com
ENV SMTP_EMAIL_PASSWORD=aapr jaox ryrr efjs

RUN npx prisma generate && npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
