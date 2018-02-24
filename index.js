const Alexa = require('alexa-sdk');
require('dotenv').config()

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
    "bus" : {
      "stop" : "490006992S"
    },
    "train": {
      "from" : "HHP",
      "to" : "VIC",
      "time": "07:35"
    }
}

const SKILL_NAME = "Ellie Travel Skill";



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
