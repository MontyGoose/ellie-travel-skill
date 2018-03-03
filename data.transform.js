'use strict';
const _ = require('lodash');
const moment = require('moment');

function DataTransform() {

  const now = moment();
  var statusEnum = {
    "ARRIVED":0,
    "CANCELLED":-2,
    "CHANGE OF IDENTITY":0,
    "CHANGE OF ORIGIN":0,
    "EARLY":1,
    "LATE":-1,
    "NO REPORT":0,
    "OFF ROUTE":0,
    "ON TIME":1,
    "REINSTATEMENT":0,
    "STARTS HERE":0
  };

  this.getBusDetails = function(departures, amount) {
    var nextbusses = _.map(departures, function(item) {
      var expected_date = moment(item.expected_departure_date + ' ' + item.expected_departure_time);
      var expected = expected_date.diff(now, 'minutes');
      if (expected < 1) {expected = 'now';}
      return {bus: item.line, expected: expected}
    });
    return nextbusses.slice(0,amount);
  }

  this.getGeneralisedTrainStatus = function(departures) {
    var sumStatus = _.reduce(departures, function(sum, item) {
      return sum + statusEnum[item.status];
    },0);
    var status = ['on time', 'messy, Check times', 'not al all'];
    if (sumStatus > 5) { return status[0]};
    if (sumStatus < 0) { return status[2]};
    return status[1];
  }


  this.searchForTrain = function(departures, time, plusminus) {
    var fullTime = moment(time, "HH:mm");
    var startTime = fullTime.clone().subtract(plusminus, 'm');
    var endTime = fullTime.clone().add(plusminus, 'm');
    var foundDeparture = _.filter(departures, function(item) {
      return _.inRange(
        moment(item.aimed_departure_time, "HH:mm").format("HHmm"), startTime.format("HHmm"), endTime.format("HHmm"))
    })
    return foundDeparture[0];
  }



}
module.exports = DataTransform;
