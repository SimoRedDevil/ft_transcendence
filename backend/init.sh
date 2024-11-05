#!/bin/bash

{
  python manage.py makemigrations authentication game chat
  python manage.py migrate
  python manage.py runserver 0.0.0.0:8000
} 2>&1 | nc -u logstash 5044