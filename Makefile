#Makefile - Dev & Deploy Commands

.DEFAULT_GOAL := help

# ENV FILES
ENV			?= .env
COMPOSE 	= docker compose --env-file $(ENV)

check-env:
	@test -f .env || (echo "Missing .env file. Please create one or copy from .env.example" && exit 1)

check-env-staging:
	@test -f .env.staging || (echo "Missing .env.staging file. Please create one or copy from .env.example" && exit 1)

# Dev Environment
dev: check-env ## Run in dev mode (with override and hot reload)
	$(COMPOSE) up --build

# Production (All-in-One Docker)
prod: check-env	## Run full stack prod mode
	docker compose -f docker-compose.yaml up --build

# Staging (Prod mode w/ .env.staging)
staging: check-env-staging ## Run staging with .env.staging
	ENV=.env.staging $(MAKE) prod

# Stop and remove all containers
down: ## Stop all services
	docker compose down

# Clean and rebuild

rebuild: ## Rebuild everything (no cache)
	$(COMPOSE) down
	$(COMPOSE) build --no-cache
	$(COMPOSE) up

# Prisma commands: Run from /backend, dotenv-cli required to access root level .env
prisma-migrate:	## Run Prisma migrations
	cd backend && npx dotenv-cli -e ../.env -- prisma migrate dev

prisma-generate: ## Run Prisma generate
	cd backend && npx dotenv-cli -e ../.env -- prisma generate

# Show help
help:
	@echo "Available commands:"
	@awk 'BEGIN {FS = ":.*##"; printf "\n"} /^[a-zA-Z_-]+:.*##/ { printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)