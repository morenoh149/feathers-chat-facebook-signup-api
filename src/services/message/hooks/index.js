'use strict';

const restrictToSender = require('./restrict-to-sender');
const process = require('./process');
const populateSender = require('./populate-sender');

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
  update: [restrictToSender()],
  patch: [restrictToSender()],
  remove: [restrictToSender()]
};

exports.after = {
  all: [],
  find: [populateSender()],
  get: [populateSender()],
  create: [populateSender()],
  update: [],
  patch: [],
  remove: []
};
