# Build stage
FROM oven/bun:1.2.1 AS builder

WORKDIR /app

# Copy monorepo files
COPY package.json bun.lock turbo.json ./
COPY apps/web ./apps/web

# Install dependencies
RUN bun install

# Build the web app
RUN cd apps/web && bun run build

# Runtime stage - use nginx to serve static files
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

# Copy nginx config
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]