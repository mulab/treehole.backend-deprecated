'use strict';

var _ = require('lodash');

exports.Hole = function (req, res) {
  var hole = req.object;
  if (hole.get('author').get('objectId') !== req.user.get('objectId')) {
    return res.error('Cannot post hole as another user!');
  }
  if (_.isEmpty(hole.get('content'))) {
    return res.error('Empty content!');
  }
  res.success();
};

exports.Comment = function (req, res) {
  var comment = req.object;
  if (comment.get('author').get('objectId') !== req.user.get('objectId')) {
    return res.error('Cannot post comment as another user!');
  }
  if (_.isEmpty(comment.get('content'))) {
    return res.error('Empty content!');
  }
  res.success();
};
