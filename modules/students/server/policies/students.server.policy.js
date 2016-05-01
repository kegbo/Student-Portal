'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke courses Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/students',
      permissions: '*'
    }, {
      resources: '/api/students/:studentsId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/students',
      permissions: ['get', 'post']
    }, {
      resources: '/api/students/:studentsId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/students',
      permissions: ['get']
    }, {
      resources: '/api/students/:studentsId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Staff Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an courses is being processed and the current user created it then allow any manipulation
  if (req.students && req.user && req.students.user && req.students.user.id === req.user.id) {
    return next();
  }

  // Check for courses roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
