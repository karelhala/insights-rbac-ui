/*global module, process*/

// Hack so that Mac OSX docker can sub in host.docker.internal instead of localhost
// see https://docs.docker.com/docker-for-mac/networking/#i-want-to-connect-from-a-container-to-a-service-on-the-host
const localhost = (process.env.PLATFORM === 'linux') ? 'localhost' : 'host.docker.internal';

module.exports = {
  routes: {
    '/beta/ansible/settings/rbac': { host: `http://${localhost}:8002` },
    '/beta/apps/rbac': { host: `http://${localhost}:8002` }
  }
};
