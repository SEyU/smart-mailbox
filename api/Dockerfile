FROM python:3.6

COPY . /var/www/app
WORKDIR /var/www/app
RUN pip install uwsgi
RUN pip install -r requirements.txt

CMD ["uwsgi", "--http", ":8080", "--wsgi-file", "/var/www/app/server.py", "--callable", "app", "--py-autoreload", "1"]
EXPOSE 8080
