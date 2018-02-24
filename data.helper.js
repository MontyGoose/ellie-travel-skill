'use strict';
const axios = require('axios');
var tunnel = require('tunnel');

function DataHelper() {

  const apis = {
    weatherapi: 'http://api.openweathermap.org/data/2.5/weather?q=London,uk&appid='+process.env.WEATHERAPI_KEY,
    busapi: 'https://transportapi.com:443/v3/uk/bus/stop/490006992S/live.json?app_id='+process.env.TRANSPORTAPI_ID+'&app_key='+process.env.TRANSPORTAPI_KEY+'&group=no&nextbuses=yes',
    trainapi: 'https://transportapi.com:443/v3/uk/train/station/HNH/live.json?app_id='+process.env.TRANSPORTAPI_ID+'&app_key='+process.env.TRANSPORTAPI_KEY+'&calling_at=VIC&darwin=false&train_status=passenger'
  };

  // functions should take 'config' - for now pass back 'raw' data or transposed - default transposed
  // could look to supply stations (from to), time(s), bus service(s) etc
  // calling application will handle (route to somewhere and times - like a my journey application)

  this.getWeather = function() {
    return new Promise(function(resolve, reject) {
      getData(apis.weatherapi).then(function(data) {
        resolve({weather: data.weather[0]});
      }).catch(function(err) {
        reject(err);
      })
    });
  }
  this.getBus = function() {
    return new Promise(function(resolve, reject) {
      getData(apis.busapi).then(function(data) {
        resolve({buses: data.departures.all[0]});
      }).catch(function(err) {
        reject(err);
      })
    });
  }
  this.getTrain = function() {
    return new Promise(function(resolve, reject) {
      getData(apis.trainapi).then(function(data) {
        resolve({trains: data.departures.all[0]});
      }).catch(function(err) {
        reject(err);
      })
    });
  }


function transposeBus(data) {
  /*
  whare the times for the next 5 buses genrally or for specified service(s)
  */
}

function transposeTrain(data) {
  /*
  using the next 5 trains - what;s the service generally like (late or not)
  if there is a specific train we're intersted in - what's it's time
  */
}

function transposeWeather(data){
  /*
  whats the weather 'like'
  */
}



  var tunnelAgent = tunnel.httpsOverHttp({
    proxy: {
      host: 'proxy.pershing.com',
      port: 8080
    }
  });
  const axiosClient = axios.create({
    //httpsAgent: tunnelAgent
  });

  //Generic get some data and stuff
  function getData(api) {
    return new Promise(function(resolve, reject) {
      axiosClient.get(api).then(function(response) {
        resolve(JSON.parse(JSON.stringify(response.data)));
      }).catch(function(error) {
        console.log('ABORT!')
        reject(error);
      });
    });
  }

}

module.exports = DataHelper;
