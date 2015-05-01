'use strict';

var _ = require('lodash');

exports.Hole = function (req) {
  var hole = req.object;
  if (_.isEmpty(hole.get('content'))) {
    return AV.Promise.error('Empty content!');
  }
  if (!req.user) {
    return AV.Promise.error('Cannot post hole without login!');
  }
  if (!req.user.get('tsinghuaAuth')) {
    return AV.Promise.error('Cannot post hole as unauthorized user!');
  }
  return AV.Promise.as();
};

exports.Comment = function (req) {
  var comment = req.object;
  if (_.isEmpty(comment.get('content'))) {
    return AV.Promise.error('Empty content!');
  }
  if (!req.user) {
    return AV.Promise.error('Cannot post comment without login!');
  }
  if (!req.user.get('tsinghuaAuth')) {
    return AV.Promise.error('Cannot post comment as unauthorized user!');
  }
  var promise = new AV.Promise();
  var hole;
  if (comment.get('replyTo')) {
    comment.get('hole').fetch().then(function (result) {
      hole = result;
      return comment.get('replyTo').fetch();
    }).then(function (replyTo) {
      return replyTo.get('hole').fetch();
    }).then(function (replyToHole) {
      if (hole.getObjectId() === replyToHole.getObjectId()) {
        promise.resolve();
      } else {
        promise.reject('Reply-to comment has different parent hole!');
      }
    }).catch(function (err) {
      promise.reject(err.message);
    });
  } else {
    promise.resolve();
  }
  return promise;
};

exports._User = function (req) {
  var user = req.object;
  var username = user.get('username');
  var nickname = user.get('nickname');

  if (!username.match(/^[a-zA-Z0-9_\.]{3,10}$/)) {
    return AV.Promise.error('Invalid username!');
  }
  if (!(1 <= nickname.length && nickname.length <= 15)) {
    return AV.Promise.error('Invalid nickname!');
  }

  return AV.Promise.as();
};
