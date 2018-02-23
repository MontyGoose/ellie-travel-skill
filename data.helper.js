'use strict';
const axios = require('axios');
var tunnel = require('tunnel');

// need to add proxy support - and then use environment variables ...

function DataHelper() {

  const weatherAPI = {
    api: 'http://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=7ba6bf1f1d54680d4405671eb293a8ae'
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
    weatherData.then(function(data) {
      return data;
    }, function(err) {
      console.log(err);
    }).then(function(results) {
        return {
          weather: results.weather[0].main
        }
    }).catch(function(err){
      console.log(err);
    });
  }

  var tunnelAgent = tunnel.httpsOverHttp({
    proxy: {
      host: 'proxy.pershing.com',
      port: 8080
    }
  });
  const axiosClient = axios.create(
  //  {httpsAgent: tunnelAgent}
  );

  //Generic get some data and stuff
  function getData(api) {

    return new Promise(function(resolve, reject) {
      axiosClient.get(api.api).then(function(response) {
        console.log(response.data);
        resolve(JSON.parse(JSON.stringify(response.data)));
      }).catch(function(error) {
        console.log('ABORT!')
        reject(error);
      });
    });
  }

}

module.exports = DataHelper;
