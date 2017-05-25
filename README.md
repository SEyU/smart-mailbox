# smart-mailbox

How to start the project

```
git clone <this-repo>
cd <this-repo>
docker-compose up -d
````

If there are changes
```
docker-compose build
docker-compose stop && docker-compose up -d
```
### Schema

![Screenshot](images/Smart-mailbox2.png)


## Dashboard

For the dashboard we use **Angular.js** as a framework to develop it, as a requirements we don't need anything but a web server like apache or nginx. To change the address of the API within the dashboard you have to change a line in the services/MainService.js file.

```
app.service('MainService', ['$http', function ($http) {
var urlBase = 'http://mailbox.clanlr.net:8080';

...
```

We use a MVC schema to develop the app.

![Screenshot](images/mvc-framework.png)

### Dashboard - Google Charts

To draw charts we call the google charts library, with it we draw 2 different kinds of charts.


* Calendar charts:

![Screenshot](images/cchart.png)

* Line charts:

![Screenshot](images/tchart.png)

### Dashboard - RealTime statistics

In our dashboard we can control the status of our mailbox (doors and letters) in real time, besides that we can see the temperature and humidity on the fly.

![Screenshot](images/realtimes.png) 