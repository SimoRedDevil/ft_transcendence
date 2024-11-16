FROM python:3.11-slim-bullseye

RUN apt-get update && apt-get install -y curl 

WORKDIR /app

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .

RUN chmod +x ./init.sh

CMD ["bash", "./init.sh"]