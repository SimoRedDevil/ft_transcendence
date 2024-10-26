#!/bin/bash

sleep 30

python manage.py makemigrations authentication game chat

python manage.py migrate

python manage.py runserver 0.0.0.0:8000
