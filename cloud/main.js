'use strict';

var classNames = require('cloud/models').classNames;

var _ = require('lodash');

_.each(require('cloud/tsinghua-account'), function (func, funcName) {
  AV.Cloud.define(funcName, func);
});

_.each(require('cloud/like'), function (func, funcName) {
  AV.Cloud.define(funcName, func);
});

// beforeSave handlers
var validators = require('cloud/validators');
var preprocessors = require('cloud/preprocessors');
_.each(classNames, function (className) {
  AV.Cloud.beforeSave(className, function (req, res) {
    var promise = AV.Promise.as();
    if (_.isFunction(validators[className])) {
      promise = promise.then(function () {
        return validators[className](req);
      });
    }
    if (_.isFunction(preprocessors[className])) {
      promise = promise.then(function () {
        return preprocessors[className](req);
      });
    }
    promise.then(function () {
      res.success();
    }, function (message) {
      res.error(message);
    });
  });
});

// afterSave handlers
var notifications = require('cloud/notifications');
var postprocessors = require('cloud/postprocessors');
_.each(classNames, function (className) {
  AV.Cloud.afterSave(className, function (req) {
    var promise = AV.Promise.as();
    if (_.isFunction(notifications[className])) {
      promise = promise.then(function () {
        return notifications[className](req);
      });
    }
    if (_.isFunction(postprocessors[className])) {
      promise = promise.then(function () {
        return postprocessors[className](req);
      });
    }
  });
});
