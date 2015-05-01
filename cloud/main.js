'use strict';

var classNames = ['Hole', 'Comment', 'Image', 'Channel', 'Notification', '_User'];

var _ = require('lodash');

_.each(require('cloud/tsinghua-account'), function (func, funcName) {
  AV.Cloud.define(funcName, func);
});

// beforeSave handlers
var validators = require('cloud/validators');
_.each(classNames, function (className) {
  AV.Cloud.beforeSave(className, function (req, res) {
    if (_.isFunction(validators[className])) {
      var validationMsg = validators[className](req);
      if (!_.isEmpty(validationMsg)) {
        return res.error(validationMsg);
      }
    }

    res.success();
  });
});

// afterSave handlers
var notifications = require('cloud/notifications');
_.each(classNames, function (className) {
  AV.Cloud.afterSave(className, function (req) {
    if (_.isFunction(notifications[className])) {
      notifications[className](req);
    }
  });
});
