'use strict';

const assert = require('assert');
const verify = require('../../../../src/services/message/hooks/verify.js');

describe('message verify hook', () => {
  it('hook can be used', () => {
    const mockHook = {
      type: 'before',
      app: {},
      params: {},
      result: {},
      data: {}
    };
    
    verify()(mockHook);
    
    assert.ok(mockHook.verify);
  });
});
