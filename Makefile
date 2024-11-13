
all: up

up :
	docker-compose  up

build:
	docker-compose  up --build

stop:
	docker-compose  stop

down:
	docker-compose  down

start:
	docker-compose  start

ps:
	docker ps


push:
	git add .; \
	git commit -m "$(msg)"; \
    git push

fclean:
	@rm -rf  database/*
	@rm -rf  redis/*
	@rm -rf backend/*/__pycache__
	@rm -rf backend/*/migrations
	@rm -rf backend/*/*/__pycache__
	@rm -rf backend/*/*/migrations
	@rm -rf backend/authentication/qrcodes/*
	@rm -rf  frontend/.next
	@rm -rf  frontend/node_modules
	@docker system prune -a -f
	@docker builder prune -a -f


re: fclean all