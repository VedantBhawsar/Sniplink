.PHONY: help docker-setup docker-build docker-start docker-stop docker-restart docker-down docker-logs docker-shell docker-status docker-clean docker-db-migrate docker-db-shell docker-redis-shell

help:
	@echo "Sniplink Docker Management Commands"
	@echo "===================================="
	@echo ""
	@echo "Setup:"
	@echo "  make docker-setup        Initial setup - creates .env and builds images"
	@echo "  make docker-build        Build Docker images"
	@echo ""
	@echo "Running:"
	@echo "  make docker-start        Start all services"
	@echo "  make docker-stop         Stop all services"
	@echo "  make docker-restart      Restart all services"
	@echo "  make docker-down         Stop and remove containers"
	@echo ""
	@echo "Debugging:"
	@echo "  make docker-logs         View logs (follow mode)"
	@echo "  make docker-status       Show service status"
	@echo "  make docker-shell        Open shell in api container"
	@echo ""
	@echo "Database:"
	@echo "  make docker-db-migrate   Run database migrations"
	@echo "  make docker-db-shell     Open PostgreSQL shell"
	@echo "  make docker-redis-shell  Open Redis CLI"
	@echo ""
	@echo "Cleanup:"
	@echo "  make docker-clean        Remove all containers and volumes"

docker-setup:
	@if [ ! -f .env ]; then \
		echo "Creating .env file from template..."; \
		cp .env.docker .env; \
		echo "✓ .env file created"; \
	else \
		echo "ℹ .env file already exists"; \
	fi
	@echo "Building Docker images..."
	@docker compose build
	@echo "✓ Docker images built successfully"

docker-build:
	@echo "Building Docker images..."
	@docker compose build
	@echo "✓ Build completed"

docker-start:
	@echo "Starting Sniplink services..."
	@docker compose up -d
	@echo "✓ Services started"
	@echo ""
	@echo "Access the application:"
	@echo "  Frontend: http://localhost"
	@echo "  API: http://localhost:3000"
	@echo "  API Health: http://localhost:3000/health"
	@echo ""
	@echo "View logs: make docker-logs"

docker-stop:
	@echo "Stopping Sniplink services..."
	@docker compose stop
	@echo "✓ Services stopped"

docker-restart:
	@echo "Restarting Sniplink services..."
	@docker compose restart
	@echo "✓ Services restarted"

docker-down:
	@echo "Shutting down Sniplink services..."
	@docker compose down
	@echo "✓ Services shut down (data preserved in volumes)"

docker-logs:
	@docker compose logs -f

docker-status:
	@docker compose ps

docker-shell:
	@docker compose exec api sh

docker-db-migrate:
	@echo "Running database migrations..."
	@docker compose exec api npx prisma migrate deploy
	@echo "✓ Migrations completed"

docker-db-shell:
	@echo "Opening PostgreSQL shell..."
	@docker compose exec postgres psql -U postgres -d urlshortener

docker-redis-shell:
	@echo "Opening Redis CLI..."
	@docker compose exec redis redis-cli

docker-clean:
	@echo "WARNING: This will remove all containers and volumes!"
	@read -p "Continue? (y/n) " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker compose down -v; \
		echo "✓ Cleanup completed"; \
	else \
		echo "ℹ Cleanup cancelled"; \
	fi