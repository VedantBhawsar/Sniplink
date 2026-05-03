# Docker Setup Guide for Sniplink

This guide covers how to build, run, and manage the Sniplink application using Docker and Docker Compose.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (version 20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 1.29+)
- [Bun](https://bun.sh/) (for local development without Docker)

## Project Structure

```
Sniplink/
├── apps/
│   ├── api/              # Backend API service
│   │   ├── Dockerfile    # API container image
│   │   └── ...
│   └── web/              # Frontend React app
│       ├── Dockerfile    # Web container image
│       ├── nginx.conf    # Nginx configuration
│       └── ...
├── docker-compose.yaml   # Orchestration configuration
├── .dockerignore        # Docker build exclusions
└── .env.docker          # Environment variables template
```

## Quick Start

### 1. Configure Environment Variables

Copy the environment template and update with your values:

```bash
cp .env.docker .env
```

Edit `.env` with your configuration:

```env
# Database
DB_USER=postgres
DB_PASSWORD=your_secure_password
DB_NAME=urlshortener

# JWT Secrets (generate new ones for production!)
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key

# Stripe (get from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_PREMIUM_PRICE_ID=price_your_price_id

# URLs
CLIENT_URL=http://localhost
CORS_ORIGIN=http://localhost
```

### 2. Start the Application

```bash
# Build all services and start containers
docker compose up -d

# View logs
docker compose logs -f

# View logs from specific service
docker compose logs -f api
docker compose logs -f web
```

### 3. Access the Application

- **Frontend**: http://localhost
- **API**: http://localhost:3000
- **API Health**: http://localhost:3000/health

### 4. Stop the Application

```bash
docker compose down
```

## Services

### PostgreSQL Database
- **Port**: 5432 (internal), 5432 (exposed)
- **Credentials**: Configured via `.env`
- **Data Volume**: `postgres_data`
- **Health Check**: Automatic

### Redis Cache
- **Port**: 6379
- **Data Volume**: `redis_data`
- **Health Check**: Automatic

### API Service
- **Port**: 3000
- **Container**: `sniplink-api`
- **Technology**: Node.js + Express
- **Build**: Multi-stage (optimized)
- **Health Check**: HTTP endpoint

### Web Service
- **Port**: 80
- **Container**: `sniplink-web`
- **Technology**: React + Vite
- **Server**: Nginx (optimized for SPA)
- **Build**: Multi-stage (optimized)

## Common Commands

### Build Only (Without Starting)

```bash
# Build all services
docker compose build

# Build specific service
docker compose build api
docker compose build web
```

### Start/Stop Services

```bash
# Start all services
docker compose up -d

# Start specific service
docker compose up -d api
docker compose up -d web

# Stop all services (keeps data in volumes)
docker compose stop

# Stop specific service
docker compose stop api

# Remove all containers (keeps data in volumes)
docker compose down

# Remove all containers and volumes (deletes data!)
docker compose down -v
```

### Database Management

```bash
# Run Prisma migrations
docker compose exec api npx prisma migrate deploy

# View database
docker compose exec postgres psql -U postgres -d urlshortener

# Seed database (if migration scripts available)
docker compose exec api npm run db:seed
```

### Debugging

```bash
# View all running containers
docker compose ps

# View logs
docker compose logs

# View logs with follow (real-time)
docker compose logs -f

# View logs from specific time
docker compose logs --since 2m

# Execute command in container
docker compose exec api sh
docker compose exec web sh
docker compose exec postgres sh
docker compose exec redis redis-cli

# Inspect running container
docker compose inspect api
```

### Monitoring

```bash
# Check resource usage
docker stats

# View container details
docker inspect sniplink-api

# Check container logs
docker logs sniplink-api
```

## Production Deployment

### Security Considerations

1. **Environment Variables**: Never commit `.env` file
2. **Secrets**: Use proper secret management (Docker Secrets, Kubernetes, HashiCorp Vault)
3. **Network**: Use a reverse proxy (Traefik, Nginx) for SSL/TLS
4. **Database**: Use managed database service (AWS RDS, Azure Database, etc.)
5. **Redis**: Use managed Redis service or secure standalone instance

### Production Docker Compose

Create `docker-compose.prod.yaml`:

```yaml
version: '3.8'

services:
  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    environment:
      NODE_ENV: production
      # Use secrets or external env vars
    restart: always
    deploy:
      replicas: 2
      resources:
        limits:
          cpus: '1'
          memory: 512M

  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    restart: always
    deploy:
      replicas: 2

  # Use external PostgreSQL service
  # Use external Redis service
```

Run with:
```bash
docker compose -f docker-compose.yaml -f docker-compose.prod.yaml up -d
```

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DB_USER` | No | postgres | PostgreSQL username |
| `DB_PASSWORD` | No | postgres | PostgreSQL password |
| `DB_NAME` | No | urlshortener | Database name |
| `JWT_SECRET` | Yes | - | JWT signing secret |
| `JWT_REFRESH_SECRET` | Yes | - | JWT refresh token secret |
| `REDIS_URL` | - | redis://redis:6379 | Redis connection URL |
| `STRIPE_SECRET_KEY` | Yes (for billing) | - | Stripe API key |
| `STRIPE_WEBHOOK_SECRET` | Yes (for billing) | - | Stripe webhook secret |
| `STRIPE_PREMIUM_PRICE_ID` | No | - | Stripe premium price ID |
| `CLIENT_URL` | No | http://localhost:80 | Frontend URL |
| `CORS_ORIGIN` | No | http://localhost:80 | CORS allowed origin |

## Troubleshooting

### Containers Won't Start

```bash
# Check logs
docker compose logs

# Check if ports are in use
lsof -i :3000
lsof -i :80
lsof -i :5432

# Rebuild containers
docker compose build --no-cache
docker compose up -d
```

### Database Connection Errors

```bash
# Check if postgres is running
docker compose ps postgres

# Test database connection
docker compose exec api npm run db:test

# Check migrations
docker compose exec api npx prisma migrate status
```

### Redis Connection Errors

```bash
# Check if redis is running
docker compose ps redis

# Test redis connection
docker compose exec redis redis-cli ping
```

### Port Already in Use

Change ports in `docker-compose.yaml`:

```yaml
services:
  api:
    ports:
      - "3001:3000"  # Changed from 3000:3000

  web:
    ports:
      - "8080:80"    # Changed from 80:80
```

### Performance Issues

1. Check resource allocation in Docker preferences
2. Verify volumes are properly mounted
3. Check image sizes: `docker images`
4. Monitor logs for errors: `docker compose logs`

## Cleanup

```bash
# Remove unused images
docker image prune

# Remove unused volumes
docker volume prune

# Remove stopped containers
docker container prune

# Remove everything (careful!)
docker system prune -a
```

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Best Practices for Writing Dockerfiles](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
- [Redis Docker Image](https://hub.docker.com/_/redis)

## Support

For issues or questions, refer to the main project README or contact the development team.