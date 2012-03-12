var
  request = require('request'),
  config = require('./config');

var url_root = 'https://api.github.com';

// cache the url where it's private
var url = "";

/* ------------------------------ Simpe Api Apadter ------------------------------ */

function ApiRequest( type, options ){
  var o = options || {};

  var _this = this;

  // attach valid options as class properties
  ['url', 'body', 'cb', 'getUrl' ]
    .forEach(function( prop ){
      if( o[prop] ) _this[prop] = o[prop];
    });

  if( ! this[type] )
    throw new Error('Please supply a valid request callback');

  return this[type].bind( this );
}

ApiRequest.prototype.getUrl = function(){
  return this.url;
};

ApiRequest.prototype.cb = function( error, response, body ){

  if( error )
    return this.res.send({ error: error }, 500);

  this.res.send( body, response.statusCode );
};

ApiRequest.prototype.prepareRequest = function( req, res ){
  this.res = res;
  this.req = req;

  if( ! req.user )
    return res.send({ error: 'Forbidden' }, 403);

  var
    token = '?access_token='+ req.session.oauth,
    params = req.url.split('?')[1] ? '&'+ req.url.split('?')[1] : '';

  url = url_root + this.getUrl() + token + params;
  console.log( url );
};

ApiRequest.prototype.get = function( req, res ){

  this.prepareRequest( req, res );

  request( url, this.cb.bind(this) );
};

ApiRequest.prototype.post = function( req, res ){

  this.prepareRequest( req, res );

  request.post({
    url: url,
    json: this.body || this.req.body
  }, this.cb.bind(this) );

};

ApiRequest.prototype.del = function( req, res ){

  this.prepareRequest( req, res );

  request.del({ url: url }, this.cb.bind(this) );

};

module.exports = ApiRequest;
