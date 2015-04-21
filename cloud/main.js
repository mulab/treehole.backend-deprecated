'use strict';

var _ = require('lodash');

var validators = require('cloud/validators');
_.each(validators, function (validator, className) {
  AV.Cloud.beforeSave(className, validator);
});
