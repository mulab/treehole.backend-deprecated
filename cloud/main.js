'use strict';

var _ = require('lodash');

_.each(require('cloud/validators'), function (validator, className) {
  AV.Cloud.beforeSave(className, validator);
});

_.each(require('cloud/tsinghua-account'), function (func, funcName) {
  AV.Cloud.define(funcName, func);
});
