'use strict';

var _ = require('lodash');
var Notification = AV.Object.extend('Notification');

exports.Comment = function (req) {
  var comment = req.object;
  if (comment.get('replyTo')) {
    comment.get('replyTo').fetch().then(function (targetComment) {
      return targetComment.get('author').fetch();
    }).then(function (author) {
      Notification.new({
        type: 'replyToCommentAuthor',
        toUser: author,
        attachedObject: comment
      }).save();
    });
  } else {
    comment.get('hole').fetch().then(function (hole) {
      return hole.get('author').fetch();
    }).then(function (author) {
      Notification.new({
        type: 'replyToHoleAuthor',
        toUser: author,
        attachedObject: comment
      }).save();
    });
  }
};
