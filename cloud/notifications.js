'use strict';

var _ = require('lodash');
var Notification = require('cloud/models').Notification;

exports.Comment = function (req) {
  var comment = req.object;
  var hole;
  var toUser;
  var promise;
  if (comment.get('replyTo')) {
    promise = comment.get('replyTo').fetch().then(function (targetComment) {
      return targetComment.get('realAuthor').fetch();
    }).then(function (author) {
      if (author.getObjectId() === comment.get('realAuthor').getObjectId()) {
        return AV.Promise.as();
      }
      toUser = author;
      var acl = new AV.ACL();
      acl.setReadAccess(author, true);
      acl.setWriteAccess(author, true);
      var notification = new Notification({
        type: 'replyToCommentAuthor',
        toUser: author,
        attachedComment: comment
      });
      notification.setACL(acl);
      return notification.save();
    });
  } else {
    promise = comment.get('hole').fetch().then(function (result) {
      hole = result;
      return hole.get('realAuthor').fetch();
    }).then(function (author) {
      if (author.getObjectId() === comment.get('realAuthor').getObjectId()) {
        return AV.Promise.as();
      }
      toUser = author;
      var acl = new AV.ACL();
      acl.setReadAccess(author, true);
      acl.setWriteAccess(author, true);
      var notification = new Notification({
        type: 'replyToHoleAuthor',
        toUser: author,
        attachedComment: comment
      });
      notification.setACL(acl);
      return notification.save();
    });
  }
  return promise.then(function () {
    if (toUser) {
      return AV.Push.send({
        channels: ['notification_' + toUser.getObjectId()],
        data: { action: 'checkNotification' }
      });
    } else {
      return AV.Promise.as(); 
    }
  });
};
