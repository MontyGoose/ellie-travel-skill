'use strict';
const axios = require('axios');
var tunnel = require('tunnel');

// need to add proxy support - and then use environment variables ...

function DataHelper() {

  const weatherAPI = {
    host: 'https://query.yahooapis.com:443',
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

  var axios_config = {
    proxy: {
      host: 'proxy.pershing.com',
      port: 8008
    }
  };


var tunnelAgent = tunnel.httpsOverHttp({
    proxy: {
        host: 'proxy.pershing.com',
        port: 8080,
    },
});
const axiosClient = axios.create({
  httpsAgent: tunnelAgent
});

  //Generic get some data and stuff
  function getData(api) {
    axiosClient.get(api.host + api.path).then(function(response) {
      console.log(response.data);
      return JSON.parse(JSON.stringify(response.data))
    }).catch(function(error) {
      console.log('ABORT!')
      console.log(error)
    });
  }
}

module.exports = DataHelper;
