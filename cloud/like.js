'use strict';

var Hole = require('cloud/models').Hole;
var _ = require('lodash');

exports.holeLike = function (req, res) {
  var holeId = req.params.holeId;
  if (!holeId) {
    return res.error('Invalid parameter!');
  }
  if (!req.user) {
    return res.error('Please login!');
  }
  var query = new AV.Query(Hole);
  query.get(holeId).then(function (hole) {
    if (!hole) {
      return AV.Promise.error('Hole not found!');
    }
    hole.addUnique('like', req.user);
    return hole.save();
  }).then(function () {
    res.success();
  }, function (err) {
    res.error(err.message);
  });
};

exports.holeUnlike = function (req, res) {
  var holeId = req.params.holeId;
  if (!holeId) {
    return res.error('Invalid parameter!');
  }
  if (!req.user) {
    return res.error('Please login!');
  }
  var query = new AV.Query(Hole);
  query.get(holeId).then(function (hole) {
    if (!hole) {
      return AV.Promise.error('Hole not found!');
    }
    hole.remove('like', req.user);
    return hole.save();
  }).then(function () {
    res.success();
  }, function (err) {
    res.error(err.message);
  });
};

exports.retrieveHoleLikeStat = function (req, res) {
  var holeIds = req.params.holeIds;
  if (!holeIds) {
    return res.error('Invalid parameter!');
  }
  if (!req.user) {
    return res.error('Please login!');
  }
  var query = new AV.Query(Hole);
  query.containedIn('objectId', holeIds);
  query.find().then(function (holes) {
    if (holes.length < holeIds.length) {
      return res.error('Invalid parameter!');
    }
    holes = _.sortBy(holes, function (hole) {
      return _.indexOf(holeIds, hole.getObjectId());
    });
    var results = _.map(holes, function (hole) {
      return {
        count: hole.get('like').length,
        includeMe: !_.isUndefined(_.find(hole.get('like'), function (user) {
          return user.getObjectId() === req.user.getObjectId();
        }))
      };
    });
    res.success(results);
  });
};
