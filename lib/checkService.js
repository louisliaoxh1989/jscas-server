'use strict';

const ty = require('then-yield');
const ioc = require('laic').laic.casServer;
const log = ioc.lib.get('logger');
const serviceRegistry = ioc.get('plugins').serviceRegistry;

module.exports = function checkService(serviceUrl) {
  function* cs() {
    let _service;
    try {
      log.debug('validating service: %s', serviceUrl);
      _service = yield serviceRegistry.getServiceWithUrl(serviceUrl);
      log.debug('service is valid: %s', _service.name);
    } catch (e) {
      log.error('could not find service: %s', service);
      log.debug(e.message);
      throw e;
    }

    return true;
  }

  return ty.spawn(cs);
};