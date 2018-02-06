'use strict';

var chai = require('chai');
var expect = chai.expect;

var DataHelper = require('../data.helper.js');

chai.config.includeStack = true;

describe('dataHelper', function() {
  var subject = new DataHelper();
  describe('#getWeather', function() {
    it('returns some weather stuff', function() {
      var value = subject.getWeather();
      return expect(value).to.eventually.be.a('string');
    });
  });

});
