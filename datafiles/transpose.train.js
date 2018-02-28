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

var sumStatus = _.reduce(departures, function(sum, item) {
  console.log(item.status,sum)
  return sum + statusEnum[item.status];
},0);

console.log(sumStatus);

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
