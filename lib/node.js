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
  var merged = {};
  data = _.isArray(data) ? data : [data || {}];

  _(self.data).concat(data).each(function (datum) {
    merged = _.merge(merged, datum);
  });

  try {
    this.client.send(err, merged, done, req);
  } catch (e) {
    console.error(e);
  }

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
