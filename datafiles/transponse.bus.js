var _ = require('lodash');
var moment = require('moment');
var busData = require('./bus.data');

var now = moment();
var departures = busData.departures.all; //departures array of departures
var next5 = _.map(departures, function(item){
  var expected_date = moment(item.expected_departure_date + ' ' + item.expected_departure_time);
  var expected = expected_date.diff(now,'minutes');
  return {
    bus:item.line,
    expected:expected
  }
})


console.log(next5);
