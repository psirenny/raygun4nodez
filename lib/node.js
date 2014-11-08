var _ = require('lodash');
var raygun = require('raygun');

function Client() {
  this.client = new raygun.Client();
  this.data = {};
  this.expressHandler = this.client.expressHandler;
}

Client.prototype.attach = function () {
  return this;
};

Client.prototype.init = function (options) {
  this.client.init(options);
  return this;
};

Client.prototype.resetAnonymousUser = function () {
  return this;
};

Client.prototype.send = function (err, data, done, req) {
  var self = this;
  if (!data) data = {};
  if (!_.isArray(data)) data = [data];
  data.forEach(function (datum) {
    self.data = _.merge(self.data, datum);
  });
  this.client.send(err, data, done, req);
  return this;
};

Client.prototype.setUser = function (user) {
  this.client.user = function (req) {
    return user;
  };

  return this;
};

Client.prototype.setVersion = function (version) {
  this.client.setVersion(version);
};

Object.defineProperty(Client.prototype, 'user', {
  get: function () {
    return this.client.user;
  },
  set: function (fn) {
    this.client.user = function () {
      return fn;
    };
  }
});

Client.prototype.whitelistCrossOriginDomains = function () {
  return this;
};

Client.prototype.withCustomData = function (data) {
  this.data = _.merge(this.data, data);
};

module.exports = {
  Client: function () {
    return new Client();
  }
};
