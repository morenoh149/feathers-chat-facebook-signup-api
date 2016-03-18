'use strict';

const assert = require('assert');
const process = require('../../../../src/services/message/hooks/process.js');

describe('message process hook', () => {
  it('returns a function', () => {
    var hook = process();
    assert.equal(typeof hook, 'function');
  });

  it('filters data as expected', () => {
    const mockHook = {
      type: 'before',
      app: {},
      params: {
        user: {
          _id: '1'
        }
      },
      result: {},
      data: {
        text: 'foo&'
      }
    };
    
    process()(mockHook);
    
    assert.deepEqual(mockHook.data, {
      text: 'foo&amp;',
      userId: '1',
      createdAt: new Date().getTime()
    });
  });
});
