'use strict';

const hoek = require('hoek');

module.exports = function runServer(argv) {
  const ioc = require('laic').laic.casServer;
  const log = ioc.lib.get('logger');
  const config = ioc.get('config').server;

  const hapi = require('hapi');
  const server = new hapi.Server();

  server.connection(config.connection);

  const sessionObj = {
    register: require('hapi-server-session'),
    options: config.session
  };
  server.register(sessionObj, (err) => {
    if (err) {
      log.debug(err);
    } else {
      log.debug('session manager: %j', server._plugins);
    }
  });

  server.register({register: require('hapi-boom-decorators')}, (err) => {
    if (err) {
      log.debug(err);
    }
  });

  server.state(config.tgcName, config.state);
  server.on('request-internal', (request, event, tags) => {
    if (tags.error && tags.state) {
        console.error(event);
    }
  });

  const routes = require(__dirname + '/routes');
  log.debug('routes: %j', routes);
  server.route(routes);

  return server;
};