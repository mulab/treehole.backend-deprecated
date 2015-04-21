'use strict';

exports.Hole = function (req, res) {
  var hole = req.object;
  if (hole.get('author').get('objectId') !== req.user.get('objectId')) {
    return res.error('Cannot post hole as another user!');
  }
  res.success();
};

exports.Comment = function (req, res) {
  var comment = req.object;
  if (comment.get('author').get('objectId') !== req.user.get('objectId')) {
    return res.error('Cannot post comment as another user!');
  }
  res.success();
};