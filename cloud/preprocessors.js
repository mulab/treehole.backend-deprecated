'use strict';

var PseudoUser = require('cloud/models').PseudoUser;

exports.Hole = function (req) {
  var hole = req.object;
  var user = req.user;
  hole.set('realAuthor', user);
  if (!hole.get('anonymous')) {
    hole.set('author', user);
  }
  return AV.Promise.as();
};

exports.Comment = function (req) {
  var comment = req.object;
  var user = req.user;
  comment.set('realAuthor', user);
  return comment.get('hole').fetch().then(function (hole) {
    if (!hole.get('anonymous')) {
      comment.set('author', user);
      return AV.Promise.as();
    } else {
      comment.set('anonymous', true);
      var query = new AV.Query(PseudoUser);
      query.equalTo('hole', hole);
      query.equalTo('user', user);
      return query.find().then(function (result) {
        if (result.length > 0) {
          return result[0];
        } else {
          return PseudoUser.new({
            user: user,
            hole: hole
          }).save();
        }
      }).then(function (pseudoUser) {
        comment.set('author', pseudoUser);
      });
    }
  });
};
