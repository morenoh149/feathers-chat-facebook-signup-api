'use strict';

// src/services/message/hooks/populate-sender.js.js
// 
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/hooks/readme.html

const defaults = {};

module.exports = function(options) {
  options = Object.assign({}, defaults, options);

  return function(hook) {
    if (hook.type === 'after') {
      return new Promise((resolve, reject) => {

        function populateSender(message) {
          return hook.app.service('users').get(message.sentBy, hook.params).then(user => {
            message.sentBy = user;
            return message;
          }).catch(reject);
        }

        if (Array.isArray(hook.result.data)) {
          return Promise.all(hook.result.data.map(populateSender))
            .then(data => {
              hook.result.data = data;
              resolve(hook);
            }).catch(reject);
        }
        
        // Handle single objects.
        return populateSender(hook.result).then(message => {
          hook.result = message;
          resolve(hook);
        }).catch(reject);
      });
    }
  };
};