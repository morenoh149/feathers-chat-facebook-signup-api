'use strict';

const { authenticate } = require('feathers-authentication').hooks;
const { unless } = require('feathers-hooks-common');
const { hashPassword } = require('feathers-authentication-local').hooks;

const gravatar = require('../../hooks/gravatar');

module.exports = {
  before: {
    all: [
      // call the authenticate hook before every method except 'create'
      unless(
        (hook) => hook.method === 'create',
        authenticate('jwt')
      )
    ],
    find: [],
    get: [],
    create: [hashPassword(), gravatar()],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
