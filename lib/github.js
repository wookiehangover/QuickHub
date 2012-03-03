var
  request = require('request'),
  config = require('./config');

var url_root = 'https://api.github.com';

/* ------------------------------ Simpe Api Apadter ------------------------------ */

function ApiRequest( type, options ){
  var o = options || {};

  ['url', 'body', 'cb', 'getUrl' ].forEach(function( prop ){
    if( o[prop] )
      this[prop] = o[prop];
  }.bind(this));

  if( ! this[type] )
    throw new Error('Please supply a valid request callback');

  return this[type].bind( this );
}

ApiRequest.prototype.url = "";

ApiRequest.prototype.get = function( req, res ){

  this.res = res;
  this.req = req;

  if( ! req.user )
    return res.send({ error: 'Forbidden' }, 403);

  var
    token = req.session.oauth,
    url = this.getUrl() +'?access_token='+ token;

  request( url_root + url, this.cb.bind(this) );
};

ApiRequest.prototype.post = function( req, res ){

  this.res = res;
  this.req = req;

  if( ! req.user )
    return res.send({ error: 'Forbidden' }, 403);

  var
    token = req.session.oauth,
    url = this.getUrl() +'?access_token='+ token;

  request.post({
    url: url_root + url,
    json: this.body || this.req.body
  }, this.cb.bind(this) );

};

ApiRequest.prototype.del = function( req, res ){

  this.res = res;
  this.req = req;

  if( ! req.user )
    return res.send({ error: 'Forbidden' }, 403);

  var
    token = req.session.oauth,
    url = this.getUrl() +'?access_token='+ token;

  request.del({ url: url_root + url }, this.cb.bind(this) );

};

ApiRequest.prototype.getUrl = function(){
  return this.url;
};

ApiRequest.prototype.cb = function( error, response, body ){

  if( error )
    throw new Error( error );

  this.res.send( body, response.statusCode );

};

module.exports = ApiRequest;