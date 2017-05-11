FROM python:3.6

COPY . /var/www/app
WORKDIR /var/www/app
RUN pip install uwsgi
RUN pip install -r requirements.txt

CMD ["uwsgi", "--http", ":8000", "--wsgi-file", "/var/www/app/server.py", "--callable", "app"]
EXPOSE 8000
