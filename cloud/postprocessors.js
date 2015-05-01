'use strict';

var PseudoUser = require('cloud/models').PseudoUser;

exports.Hole = function (req) {
  var hole = req.object;
  var user = req.user;
  if (hole.get('anonymous')) {
    return PseudoUser.new({
      user: user,
      hole: hole,
      authorOf: hole
    }).save();
  }
  return AV.Promise.as();
};
