'use strict';

require('dotenv').config()
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

var expect = chai.expect;
var DataHelper = require('../data.helper.js');

chai.config.includeStack = true;

describe('dataHelper', function() {
  var subject = new DataHelper();
  describe('#getWeather', function() {
    it('returns some weather stuff', function() {
      var weather = subject.getWeather();
      return expect(weather).to.eventually.be.a('object');
    });
  });
  describe('#getBus', function() {
    it('returns some bus stuff', function() {
      var buses = subject.getBus();
      return expect(buses).to.eventually.be.a('object');
    });
  });  describe('#getTrain', function() {
      it('returns some train stuff', function() {
        var trains = subject.getTrain();
        return expect(trains).to.eventually.be.a('object');
      });
    });
});
