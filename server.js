const express = require('express');
const hbs = require('hbs');

const geocode = require('./geocode/geocode');
const weather = require('./weather/weather');

const port = process.env.PORT || 3000;
let app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

app.get('/', (req, res)=>{
  res.render('home.hbs');
});

app.get('/search', (req, res) => {
  a = req.query['a'];
  geocode.geocodeAddress(a, (err, results)=>{
    if(err){
      console.log(err);
      res.send('Somethin went wrong. Try refreshing the page.');
    }else{
      weather.getWeather(results.latitude, results.longitude, (err, weatherResults)=>{
        if(err){
          res.send('Something went wrong. Try refreshing the page.');
        } else {
          res.render('result.hbs', {
            address: results.address,
            latitude: results.latitude,
            longitude: results.longitude,
            temperature: weatherResults.temperature,
            apparentTemperature: weatherResults.apparentTemperature,
            windSpeed: weatherResults.windSpeed,
            summary: weatherResults.summary
          });
        }
      });
    }
  });
});

app.listen(port, () => {
  console.log('Server is up on port ' + port);
});
