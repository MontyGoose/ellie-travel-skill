const Alexa = require('alexa-sdk');
const axios = require('axios');

const languageStrings = {
    'en': {
        'translation': {
            'WELCOME' : "Welcome to Ellie's travel service!",
            'HELP'    : "To get latest bus and trains say, latest, to get just buses say, bus and for trains, trains.",
            'ABOUT'   : "The Ellie Travel service is here to provide up to the date times and status updates for Ellie's school travel",
            'STOP'    : "Okay, see you next time!"
        }
    }
};
const data = {
    "city"        : "London",
    "postcode"    : "SE24 9PA",
    "projects" : [


    ],
    "attractions":[
    ]
}

const SKILL_NAME = "Ellie's Travel Skill";


const weatherAPI = {
    host: 'https://query.yahooapis.com',
    port: 443,
    path: `/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22${encodeURIComponent(data.city)}%2C%20${data.postcode}%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys`,
    method: 'GET'
};
const busAPI = {
    host: 'query.yahooapis.com',
    port: 443,
    path: `/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22${encodeURIComponent(data.city)}%2C%20${data.state}%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys`,
    method: 'GET'
};
const trainAPI = {
    host: 'query.yahooapis.com',
    port: 443,
    path: `/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22${encodeURIComponent(data.city)}%2C%20${data.state}%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys`,
    method: 'GET'
};


exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    // alexa.appId = 'amzn1.echo-sdk-ams.app.1234';
    ///alexa.dynamoDBTableName = 'YourTableName'; // creates new table for session.attributes
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
    'LaunchRequest': function () {
        var say = this.t('WELCOME') + ' ' + this.t('HELP');
        this.response.speak(say).listen(say);
        this.emit(':responseReady');
    },

    'AboutIntent': function () {
        this.response.speak(this.t('ABOUT'));
        this.emit(':responseReady');
    },

    'LatestIntent': function () {
        // get weather
        var weatherData = getWeather();
        // get buses
        // get trains
        var say = 'Some weather; '+ weatherData.currentTemp;
        this.response.speak(say).listen(say);
        this.emit(':responseReady');
    },


    'AMAZON.YesIntent': function () {
        var projectName = this.attributes['project'];

        var projectDetails = getProjectByName(projectName);

        var say = 'Project ' + projectDetails.name
            + ',  ' + projectDetails.description;

        this.response.speak(say);
        this.emit(':responseReady');

    },

    'GoOutIntent': function () {

        // getWeather( ( localTime, currentTemp, currentCondition) => {
        //     // time format 10:34 PM
        //     // currentTemp 72
        //     // currentCondition, e.g.  Sunny, Breezy, Thunderstorms, Showers, Rain, Partly Cloudy, Mostly Cloudy, Mostly Sunny
        //
        //     // sample API URL for Irvine, CA
        //     // https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22irvine%2C%20ca%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys
        //
        //     var say = 'It is ' + localTime
        //         + ' and the weather in ' + data.city
        //         + ' is '
        //         + currentTemp + ' and ' + currentCondition;
        //     this.response.speak(say);
        //     this.emit(':responseReady');
        //
        //     // TODO
        //     // Decide, based on current time and weather conditions,
        //     // whether to go out to a local beach or park;
        //     // or recommend a movie theatre; or recommend staying home
        //
        //
        // });
    },

    'AMAZON.NoIntent': function () {
        this.emit('AMAZON.StopIntent');
    },
    'AMAZON.HelpIntent': function () {
        this.response.speak(this.t('HELP')).listen(this.t('HELP'));
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(this.t('STOP'));
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest': function () {
        this.response.speak(this.t('STOP'));
        this.emit(':responseReady');
    }

};



function getWeather() {
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
