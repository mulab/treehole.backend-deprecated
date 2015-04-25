'use strict';

var _ = require('lodash');

function sameObject(obj1, obj2) {
  return obj1.get('objectId') === obj2.get('objectId');
}

exports.Hole = function (req, res) {
  var hole = req.object;
  if (!sameObject(hole.get('author'), req.user)) {
    return res.error('Cannot post hole as another user!');
  }
  if (!req.user.get('tsinghuaAuth')) {
    return res.error('Cannot post hole as unauthorized user!');
  }
  if (_.isEmpty(hole.get('content'))) {
    return res.error('Empty content!');
  }
  res.success();
};

exports.Comment = function (req, res) {
  var comment = req.object;
  if (!sameObject(comment.get('author'), req.user)) {
    return res.error('Cannot post comment as another user!');
  }
  if (!req.user.get('tsinghuaAuth')) {
    return res.error('Cannot post comment as unauthorized user!');
  }
  if (_.isEmpty(comment.get('content'))) {
    return res.error('Empty content!');
  }
  res.success();
};

exports._User = function (req, res) {
  var user = req.object;
  var username = user.get('username');
  var nickname = user.get('nickname');

  if (!username.match(/^[a-zA-Z0-9_\.]{3,10}$/)) {
    return res.error('Invalid username!');
  }
  if (!(1 <= nickname.length && nickname.length <= 15)) {
    return res.error('Invalid nickname!');
  }

  res.success();
};
