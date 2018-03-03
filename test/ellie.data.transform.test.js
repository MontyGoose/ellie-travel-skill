'use strict';

require('dotenv').config()
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

var expect = chai.expect;
var DataTransform = require('../data.transform.js');
var dummy_bus_departures = require('../datafiles/bus.data').departures.all;
var dummy_train_departures = require('../datafiles/train.data').departures.all;


chai.config.includeStack = true;

describe('dataTransform', function() {
  var subject = new DataTransform();
  describe('#getBusDetails', function() {
    it('returns bus stuff', function() {
      var busDetails = subject.getBusDetails(dummy_bus_departures,5);
      expect(busDetails).to.be.an('array'); //should return an array
      expect(busDetails).to.have.lengthOf('5'); //array should be 5 long
      expect(busDetails[0].bus).to.equal('68'); // first array should have a bus node set to 68
    });
  });
  describe('#getGeneralisedTrainStatus', function() {
    it('returns train status', function() {
      var trainstatus = subject.getGeneralisedTrainStatus(dummy_train_departures);
      expect(trainstatus).to.be.an('string'); //should return an array
      expect(trainstatus).to.equal('messy, Check times'); // first array should have a bus node set to 68
    });
  });
  describe('#searchForTrains', function() {
    it('return found departure', function() {
      var trainDeparture = subject.searchForTrain(dummy_train_departures, '16:50', 5);
      expect(trainDeparture).to.be.an('object'); //should return an array
      expect(trainDeparture.status).to.equal('ON TIME'); // first array should have a bus node set to 68
    });
    it('not return departure', function() {
      var trainDeparture = subject.searchForTrain(dummy_train_departures, '21:50', 5);
      expect(trainDeparture).to.be.undefined; //should return an array
    });

  });

});
