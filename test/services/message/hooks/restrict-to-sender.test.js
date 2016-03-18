'use strict';

const assert = require('assert');
const restrictToSender = require('../../../../src/services/message/hooks/restrict-to-sender.js');

describe('message restrict-to-sender hook', () => {
  it('returns a function', () => {
    var hook = restrictToSender();
    assert.equal(typeof hook, 'function');
  });
});
