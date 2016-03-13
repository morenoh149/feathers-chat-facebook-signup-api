'use strict';

const verify = require('./verify');

const process = require('./process');

const globalHooks = require('../../../hooks');
const auth = require('feathers-authentication').hooks;

exports.before = {
  all: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.requireAuth()
  ],
  find: [],
  get: [],
  create: [process()],
  update: [verify()],
  patch: [verify()],
  remove: [verify()]
};

exports.after = {
  all: [],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
};
