# ------- Builder ----------

FROM node:18.12-bullseye-slim   AS builder

WORKDIR /app
RUN yarn global add turbo@1.10.3
COPY . .
RUN turbo prune --scope=worker --docker

# ------- Installer -----------

# Add lockfile and package.json's of isolated subworkspace
FROM node:18.12-bullseye-slim  AS installer

RUN apt-get update && apt-get -y install openssl python3 make g++ \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev

RUN yarn global add pnpm@8.6.3

WORKDIR /app

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install

# Build the project
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

RUN pnpm turbo run build --filter=worker

# ------- Runner -----------

FROM node:18.12-bullseye-slim  AS runner
WORKDIR /app

RUN apt-get update && apt-get install -y wget unzip git ca-certificates \
    libcairo2 \
    libpango-1.0-0 \
    libjpeg62-turbo \
    libgif7 \
    librsvg2-2
RUN update-ca-certificates

COPY --from=installer /app .

# Don't run production as root
RUN addgroup --system --gid 1001 worker
RUN adduser --system --uid 1001 worker

# Access to dist

RUN chown -R worker:worker /app/apps/worker/dist
RUN chmod -R 775 /app/apps/worker/dist

# 6gb on node minus 0.5gb for OS
ENV NODE_OPTIONS=”--max-old-space-size=5500″

USER worker

WORKDIR /app/apps/worker
CMD yarn start