FROM python:3.6
COPY . /var/www/app
WORKDIR /var/www/app
RUN pip install -r requirements.txt
CMD ["python", "server.py"]
EXPOSE 8000
