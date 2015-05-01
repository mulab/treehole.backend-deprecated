'use strict';

var _ = require('lodash');

function sameObject(obj1, obj2) {
  return obj1.get('objectId') === obj2.get('objectId');
}

exports.Hole = function (req) {
  var hole = req.object;
  if (!sameObject(hole.get('author'), req.user)) {
    return 'Cannot post hole as another user!';
  }
  if (!req.user.get('tsinghuaAuth')) {
    return 'Cannot post hole as unauthorized user!';
  }
  if (_.isEmpty(hole.get('content'))) {
    return 'Empty content!';
  }
  return '';
};

exports.Comment = function (req) {
  var comment = req.object;
  if (!sameObject(comment.get('author'), req.user)) {
    return 'Cannot post comment as another user!';
  }
  if (!req.user.get('tsinghuaAuth')) {
    return 'Cannot post comment as unauthorized user!';
  }
  if (_.isEmpty(comment.get('content'))) {
    return 'Empty content!';
  }
  return '';
};

exports._User = function (req) {
  var user = req.object;
  var username = user.get('username');
  var nickname = user.get('nickname');

  if (!username.match(/^[a-zA-Z0-9_\.]{3,10}$/)) {
    return 'Invalid username!';
  }
  if (!(1 <= nickname.length && nickname.length <= 15)) {
    return 'Invalid nickname!';
  }

  return '';
};
