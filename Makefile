#Makefile - Dev & Deploy Commands

.DEFAULT_GOAL := help

# ENV FILES
ENV			?= .env
COMPOSE 	= docker compose --env-file $(ENV)

# Dev Environment
dev:		## Run in dev mode (with override and hot reload)
	$(COMPOSE) up --build

# Production (All-in-One Docker)
prod:		## Run full stack prod mode
	docker compose -f docker-compose.yaml up --build

# Staging (Prod mode w/ .env.staging)
staging:	## Run staging with .env.staging
	ENV=.env.staging $(MAKE) prod

# Stop and remove all containers
down:		## Stop all services
	docker compose down

# Clean and rebuild
rebuild:	## Rebuild everything (no cache)
	$(COMPOSE) down
	$(COMPOSE) build --no-cache
	$(COMPOSE) up

# Show help
help:
	@echo "Available commands:"
	@awk 'BEGIN {FS = ":.*##"; printf "\n"} /^[a-zA-Z_-]+:.*##/ { printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)