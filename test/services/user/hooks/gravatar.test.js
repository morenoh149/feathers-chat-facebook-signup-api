'use strict';

const assert = require('assert');
const gravatar = require('../../../../src/services/user/hooks/gravatar.js');

describe('user gravatar hook', () => {
  it('returns a function', () => {
    var hook = gravatar();
    assert.equal(typeof hook, 'function');
  });

  it('returns a gravatar url', () => {
    const mockHook = {
      type: 'before',
      app: {},
      params: {},
      result: {},
      data: {
        email: 'hello@feathersjs.com'
      }
    };
    
    gravatar()(mockHook);
    
    assert.ok(mockHook.data.avatar);
  });
});
