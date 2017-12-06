const request = require('request');

let getWeather =(lat, lng, callback)=>{
  request({
    url: `https://api.darksky.net/forecast/d6c7636758986c2f4edd0abdd898c4a5/${lat},${lng}?units=si`,
    json: true
  }, (error, response, body)=>{
    if(!error && response.statusCode === 200){
      callback(undefined, {
        temperature: body.currently.temperature,
        apparentTemperature: body.currently.apparentTemperature,
        windSpeed: body.currently.windSpeed,
        summary: body.currently.summary
      });
    }else {
      callback('Unable to fetch weather.');
    }
  });
}

module.exports.getWeather = getWeather;
