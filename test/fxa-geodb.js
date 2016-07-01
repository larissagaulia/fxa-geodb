/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const chai = require('chai');
const ERRORS = require('../lib/errors');
const geoDb = require('../src/fxa-geodb')();

const assert = chai.assert;

describe('fxa-geodb', function () {
  'use strict';
  var ip;

  it('returns a promise when called', function () {
    assert.isTrue(typeof geoDb('12.23.34.45').then === 'function', 'Promise not returned');
  });

  it('returns an error object with `IS_INVALID` when supplied with an undefined ip variable', function () {
    return geoDb(ip)
      .then(function (location) {
      }, function (err) {
        assert.equal(err.message, ERRORS.IS_INVALID, 'Incorrect error message');
      });
  });

  it('returns an error object with `IS_INVALID` when supplied with an object', function () {
    ip = {};
    return geoDb(ip)
      .then(function (location) {
      }, function (err) {
        assert.equal(err.message, ERRORS.IS_INVALID, 'Incorrect error message');
      });
  });

  it('returns an error object with `IS_INVALID` when supplied with an empty ip', function () {
    ip = '';
    return geoDb(ip)
      .then(function (location) {
      }, function (err) {
        assert.equal(err.message, ERRORS.IS_INVALID, 'Incorrect error message');
      });
  });


  it('returns an error object with `IS_INVALID` when supplied with an invalid ip', function () {
    ip = '5.6.7';
    return geoDb(ip)
      .then(function (location) {
      }, function (err) {
        assert.equal(err.message, ERRORS.IS_INVALID, 'Incorrect error message');
      });
  });

  it('returns an object with location details when supplied with a valid ip address', function () {
    // 8.8.8.8 is Google's nameservers, will probably always stay constant
    ip = '8.8.8.8';
    const ll = {
      latitude: 37.386,
      longitude: -122.0838
    };
    return geoDb(ip)
      .then(function (location) {
        assert.equal(location.country, 'United States', 'Country not returned correctly');
        assert.equal(location.city, 'Mountain View', 'City not returned correctly');
        assert.equal(location.continent, 'North America', 'Continent not returned correctly');
        assert.deepEqual(location.ll, ll, 'LatLong not returned correctly');
        assert.equal(location.time_zone, 'America/Los_Angeles', 'Timezone not returned correctly');
      }, function (err) {
        assert.equal(err.message, ERRORS.UNABLE_TO_FETCH_DATA, 'Incorrect error message');
      });
  });

});
