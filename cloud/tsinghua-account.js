'use strict';

var _ = require('lodash');

function parseResult(data) {
  var result = {};
  var parts = data.split(':');
  for (var i = 0; i < parts.length; i++) {
    var tmp = parts[i].split('=');
    result[tmp[0]] = tmp[1];
  }
  return result;
}

exports.tsinghuaAccountAuth = function (req, res) {
  var username = req.params.username;
  var password = req.params.password;
  if (_.isEmpty(username) || _.isEmpty(password)) {
    return res.error('Invalid parameters!');
  }
  AV.Cloud.httpRequest({
    method: 'POST',
    url: 'https://id.tsinghua.edu.cn/thuser/authapi/login/ALL_ZHJW/127_0_0_1',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: { username: username, password: password }
  }).then(function (httpResponse) {
    var result = JSON.parse(httpResponse.text);
    if (result.status === 'RESTLOGIN_OK') {
      return AV.Cloud.httpRequest({
        url: 'https://id.tsinghua.edu.cn/thuser/authapi/checkticket/ALL_ZHJW/' + result.ticket + '/127_0_0_1'
      });
    } else {
      return AV.Promise.error('Tsinghua authentication: username or password incorrect.');
    }
  }).then(function (httpResponse) {
    var userInfo = parseResult(httpResponse.text);
    return req.user.save({
      tsinghuaAuth: true,
      tsinghuaAccountInfo: JSON.stringify(userInfo)
    });
  }).then(function () {
    res.success();
  }).catch(function (err) {
    var message;
    if (err.status) {
      message = 'Tsinghua authentication: connection error.';
    } else {
      message = err;
    }
    res.error(message);
  });
};
