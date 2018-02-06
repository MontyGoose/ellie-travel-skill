'use strict';
const axios = require('axios');

function DataHelper() {

  const weatherAPI = {
      host: 'https://query.yahooapis.com',
      port: 443,
      path: '/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22${encodeURIComponent(data.city)}%2C%20${data.postcode}%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys',
      method: 'GET'
  };
  const busAPI = {
      host: 'query.yahooapis.com',
      port: 443,
      path: '/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22${encodeURIComponent(data.city)}%2C%20${data.state}%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys',
      method: 'GET'
  };
  const trainAPI = {
      host: 'query.yahooapis.com',
      port: 443,
      path: '/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22${encodeURIComponent(data.city)}%2C%20${data.state}%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys',
      method: 'GET'
  };



this.getWeather = function() {
  var weatherData = getData(weatherAPI);
  var channelObj = weatherData.query.results.channel;
  var localTime = channelObj.lastBuildDate.toString();

  return {
    localTime: localTime.substring(17, 25).trim(),
    currentTemp: channelObj.item.condition.temp,
    currentCondition: channelObj.item.condition.text
  }
}

//Generic get some data and stuff
function getData(api) {
  console.log(api);
  axios.get(api.host + api.path).then(function(response) {
    console.log(response);
    return JSON.parse(response)
  }).catch(function(error){
    console.log('ABORT!')
    console.log(error)
  });
}
}

module.exports = DataHelper;
