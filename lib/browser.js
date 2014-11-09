function Client() {
  if (!window.Raygun) throw new Error('Raygun not found.');
  this.client = Raygun;
}

Client.prototype.expressHandler = function () {
  throw new Error('express handler not available in the browser.');
};

Client.prototype.attach = function () {
  return this;
};

Client.prototype.init = function (options) {
  this.client.init(options.apiKey, options);
  if (options.filters) this.client.filterSensitiveData(options.filters);
  return this;
};

Client.prototype.resetAnonymousUser = function () {
  this.client.resetAnonymousUser();
  return this;
};

Client.prototype.saveIfOffline = function (val) {
  this.client.saveIfOffline(val);
  return this;
};

Client.prototype.send = function (err, data, done, req) {
  var user = this.user ? this.user() : {};
  this.client.setUser(user.identifier, user.isAnonymous, user.email, user.fullName, user.firstName, user.uuid);
  this.client.send(err, data);
  if (done) done(null);
  return this;
};

Client.prototype.setUser = function (identifier, isAnonymous, email, fullName, firstName, uuid) {
  this.client.setUser(identifier, isAnonymous, email, fullName, firstName, uuid);
  return this;
};

Client.prototype.setVersion = function (version) {
  this.client.setVersion(version);
  return this;
};

Client.prototype.whitelistCrossOriginDomains = function (domains) {
  this.client.whitelistCrossOriginDomains(domains);
  return this;
};

Client.prototype.withCustomData = function (data) {
  this.client.attach().withCustomData(data);
  return this;
};

module.exports = {
  Client: function () {
    return new Client();
  }
};
