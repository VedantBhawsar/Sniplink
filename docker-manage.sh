#!/bin/bash

# Docker Quick Start Script for Sniplink
# This script helps set up and manage the Docker environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "${GREEN}================================${NC}"
    echo -e "${GREEN}$1${NC}"
    echo -e "${GREEN}================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Commands
case "${1:-help}" in
    setup)
        print_header "Setting up Docker environment"
        
        if [ ! -f .env ]; then
            print_info "Creating .env file from .env.docker template"
            cp .env.docker .env
            print_success ".env file created"
        else
            print_info ".env file already exists"
        fi
        
        print_info "Building Docker images..."
        docker compose build
        print_success "Docker images built successfully"
        ;;
    
    start)
        print_header "Starting Sniplink services"
        docker compose up -d
        print_success "Services started"
        echo ""
        echo "Access the application:"
        echo "  Frontend: http://localhost"
        echo "  API: http://localhost:3000"
        echo ""
        echo "Run 'docker-compose logs -f' to view logs"
        ;;
    
    stop)
        print_header "Stopping Sniplink services"
        docker compose stop
        print_success "Services stopped"
        ;;
    
    restart)
        print_header "Restarting Sniplink services"
        docker compose restart
        print_success "Services restarted"
        ;;
    
    down)
        print_header "Shutting down Sniplink services"
        docker compose down
        print_success "Services shut down"
        ;;
    
    logs)
        docker compose logs -f "${2:-}"
        ;;
    
    shell)
        service="${2:-api}"
        print_info "Opening shell in $service container"
        docker compose exec "$service" sh
        ;;
    
    db:migrate)
        print_header "Running database migrations"
        docker compose exec api npx prisma migrate deploy
        print_success "Migrations completed"
        ;;
    
    db:shell)
        print_header "Opening PostgreSQL shell"
        docker compose exec postgres psql -U postgres -d urlshortener
        ;;
    
    redis:shell)
        print_header "Opening Redis CLI"
        docker compose exec redis redis-cli
        ;;
    
    status)
        print_header "Service Status"
        docker compose ps
        ;;
    
    clean)
        print_header "Cleaning up Docker resources"
        read -p "This will remove containers and volumes. Continue? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            docker compose down -v
            print_success "Cleanup completed"
        else
            print_info "Cleanup cancelled"
        fi
        ;;
    
    build)
        print_header "Building Docker images"
        docker compose build "${2:-}"
        print_success "Build completed"
        ;;
    
    help)
        cat << EOF
${GREEN}Sniplink Docker Management Script${NC}

Usage: ./docker-manage.sh [COMMAND] [OPTIONS]

Commands:
    setup              Initial setup - creates .env and builds images
    start              Start all services
    stop               Stop all services
    restart            Restart all services
    down               Stop and remove containers (keeps volumes)
    logs [service]     View logs (e.g., api, web, postgres, redis)
    shell [service]    Open shell in container (default: api)
    status             Show status of all services
    build [service]    Rebuild Docker images (e.g., api, web)
    
    db:migrate         Run database migrations
    db:shell           Open PostgreSQL shell
    redis:shell        Open Redis CLI
    
    clean              Remove all containers and volumes (DESTRUCTIVE)
    help               Show this help message

Examples:
    ${YELLOW}./docker-manage.sh setup${NC}
    ${YELLOW}./docker-manage.sh start${NC}
    ${YELLOW}./docker-manage.sh logs api${NC}
    ${YELLOW}./docker-manage.sh shell web${NC}
    ${YELLOW}./docker-manage.sh db:migrate${NC}

EOF
        ;;
    
    *)
        print_error "Unknown command: $1"
        echo "Run './docker-manage.sh help' for usage information"
        exit 1
        ;;
esac