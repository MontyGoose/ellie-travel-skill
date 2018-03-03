var _ = require('lodash');
var moment = require('moment');
var trainData = require('./train.data');

var now = moment();
var departures = trainData.departures.all; //departures array of departures

//enum of status' - which a + / - score - add up to give 'general score'?
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

var d1 = departures[0];
console.log(statusEnum[d1.status]);

console.log(getGeneralisedStatus(departures));


searchForTrains(departures, '16:50', 5)


function getGeneralisedStatus(departures) {
  var sumStatus = _.reduce(departures, function(sum, item) {
    console.log(item.status,sum)
    return sum + statusEnum[item.status];
  },0);
  var status = ['Good', 'Check times', 'Bad'];
  if (sumStatus > 5) { return status[0]};
  if (sumStatus < 0) { return status[2]};
  return status[1];
}


function searchForTrains(departures, time, plusminus) {
  var fullTime = moment(time, "HH:mm");
  var startTime = fullTime.clone().subtract(plusminus, 'm');
  var endTime = fullTime.clone().add(plusminus, 'm');
  var foundDeparture = _.filter(departures, function(item) {
    return _.inRange(
      moment(item.aimed_departure_time, "HH:mm").format("HHmm"), startTime.format("HHmm"), endTime.format("HHmm"))
  })
  return foundDeparture;
}

/*
Max score is 8
Lowest -16
Bad is < 0
Good is >5
Check 1->4
*/

// var next5 = _.map(departures, function(item){
//   var expected_date = moment(item.expected_departure_date + ' ' + item.expected_departure_time);
//   var expected = expected_date.diff(now,'minutes');
//   return {
//     bus:item.line,
//     expected:expected
//   }
// })
// console.log(next5);
