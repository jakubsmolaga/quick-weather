const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const geocode = require('./geocode/geocode');
const weather = require('./weather/weather');

const port = process.env.PORT || 3000;
let app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

app.use((req, res, next)=>{
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;

  console.log(log);
  fs.appendFile('server.log', log + '\n', (e)=>{
    if(e)console.log('Unable to append to server.log.');
  })
  next();
});
//app.use((req, res, next)=>{
//  res.render('maintenance.hbs');
//});
app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text)=>{
  return text.toUpperCase();
});

app.get('/', (req, res)=>{
  res.render('home.hbs', {
    pageTitle: 'Home page',
    welcomeMessage: 'What address do you want to check the info for?'
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page',
  });
});

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Something went wrong'
  });
});
//
app.get('/search', (req, res) => {
  a = req.query['a'];
  geocode.geocodeAddress(a, (err, results)=>{
    if(err){
      console.log(err);
      res.send('Somethin went wrong. Try refreshing the page.');
    }else{
      console.log(results.address);
      weather.getWeather(results.latitude, results.longitude, (err, weatherResults)=>{
        console.log(weatherResults.summary);
        res.render('result.hbs', {
         address: results.address,
         latitude: results.latitude,
         longitude: results.longitude,
         temperature: weatherResults.temperature,
         apparentTemperature: weatherResults.apparentTemperature,
         windSpeed: weatherResults.windSpeed,
         summary: weatherResults.summary
        });
      });

    }
  });
});

app.listen(port, () => {
  console.log('Server is up on port ' + port);
});
