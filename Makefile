
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

fclean:
	rm -rf  database/*
	rm -rf  redis/*
	rm -rf  frontend/node_modules
	rm -rf  frontend/.next
	docker system prune -a -f
	docker builder prune -a -f


re: fclean all