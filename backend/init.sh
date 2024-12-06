#!/bin/bash

python manage.py makemigrations authentication game chat friends tournament

python manage.py migrate

python manage.py runserver 0.0.0.0:8000
