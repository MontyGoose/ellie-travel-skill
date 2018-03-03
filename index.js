const Alexa = require('alexa-sdk');
require('dotenv').config()
const _ = require('lodash');
var DataHelper = require('./data.helper.js');
var dataHelper = new DataHelper();
var DataTransform = require('./data.transform.js');
var dataTransform = new DataTransform();

const languageStrings = {
  'en': {
    'translation': {
      'WELCOME': "Welcome to Ellie's travel service!",
      'HELP': "To get latest bus and trains say, latest, to get just buses say, bus and for trains, trains.",
      'ABOUT': "The Ellie Travel service is here to provide up to the date times and status updates for Ellie's school travel",
      'STOP': "Okay, see you next time!"
    }
  }
};
const data = {
  "city": "London",
  "postcode": "SE24 9PA",
  "bus": {
    "stop": "490006992S"
  },
  "train": {
    "from": "HHP",
    "to": "VIC",
    "time": "07:35"
  }
}

const SKILL_NAME = "Ellie Travel Skill";

exports.handler = function(event, context, callback) {
  var alexa = Alexa.handler(event, context);
  // alexa.appId = 'amzn1.echo-sdk-ams.app.1234';
  ///alexa.dynamoDBTableName = 'YourTableName';  creates new table for session.attributes
  alexa.resources = languageStrings;
  alexa.registerHandlers(handlers);
  alexa.execute();
};

const handlers = {
  'LaunchRequest': function() {
    var say = this.t('WELCOME') + ' ' + this.t('HELP');
    this.response.speak(say).listen(say);
    this.emit(':responseReady');
  },

  'AboutIntent': function() {
    this.response.speak(this.t('ABOUT'));
    this.emit(':responseReady');
  },

  'LatestIntent': function() {
    var that = this;
    var say = '';
    Promise.all([dataHelper.getBus(),dataHelper.getTrain]).then(function([busData,trainData]){
      var nextBus = dataTransform.getBusDetails(busData.buses, 1)
      say += 'The next bus is a number ' + nextBus[0].bus + ' and ';
      if (nextBus[0].expected == 'now') {
        say += ' is now due';
      } else {
        say += ' will be here in ' + nextBus[0].expected + ' minutes';
      }
      say += ' and the trains are all running ' + dataTransform.getGeneralisedTrainStatus(trainData.trains);
      return say;
    }).then(function(say) {
      that.response.speak(say).listen(say);
      that.emit(':responseReady');
    }).catch(function(err) {
      console.log("Promise Rejected:", err);
    });
  },
  'BusesIntent': function() {
    var that = this;
    var buses = dataHelper.getBus().then(function(busData) {
      var nextBus = dataTransform.getBusDetails(busData.buses, 5)
      var say = 'The next buses are in ' + _.map(nextBus, 'expected').join(', ') + ' minutes';
      return say;
    }).then(function(say) {
      that.response.speak(say).listen(say);
      that.emit(':responseReady');
    }).catch(function(err) {
      console.log("Promise Rejected:", err);
    });
  },
  'TrainsIntent': function() {
    var that = this;
    var trains = dataHelper.getTrains().then(function(trainData) {
      var trainDetails = dataTransform.getTrainDetails(trainData.trains)
      var say = 'The next buses are in ' + _.map(nextBus, 'expected').join(', ') + ' minutes';
      that.response.speak(say).listen(say);
      that.emit(':responseReady');
    }).catch(function(err) {
      console.log("Promise Rejected:", err);
    });
  },
  'AMAZON.YesIntent': function() {
    var projectName = this.attributes['project'];

    var projectDetails = getProjectByName(projectName);

    var say = 'Project ' + projectDetails.name + ',  ' + projectDetails.description;

    this.response.speak(say);
    this.emit(':responseReady');

  },

  'AMAZON.NoIntent': function() {
    this.emit('AMAZON.StopIntent');
  },
  'AMAZON.HelpIntent': function() {
    this.response.speak(this.t('HELP')).listen(this.t('HELP'));
    this.emit(':responseReady');
  },
  'AMAZON.CancelIntent': function() {
    this.response.speak(this.t('STOP'));
    this.emit(':responseReady');
  },
  'AMAZON.StopIntent': function() {
    this.emit('SessionEndedRequest');
  },
  'SessionEndedRequest': function() {
    this.response.speak(this.t('STOP'));
    this.emit(':responseReady');
  }

};
