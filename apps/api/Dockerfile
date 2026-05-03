# Build stage
FROM oven/bun:1.2.1 AS builder

WORKDIR /app

# Copy monorepo files
COPY package.json bun.lock turbo.json ./
COPY apps/api ./apps/api
COPY prisma ./prisma

# Install dependencies
RUN bun install

# Build the API
RUN cd apps/api && \
    bun run prebuild && \
    bun run build

# Runtime stage
FROM oven/bun:1.2.1

WORKDIR /app

# Install curl for healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copy only necessary files from builder
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/node_modules ./node_modules
COPY --from=builder /app/apps/api/prisma ./prisma
COPY --from=builder /app/apps/api/package.json ./

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

CMD ["node", "dist/index.js"]
