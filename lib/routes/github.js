var
  request = require('request'),
  config = require('../config');

var url_root = 'https://api.github.com';

/* ------------------------------ Simpe Api Apadter ------------------------------ */

function Api( type, options ){
  var o = options || {};

  if( o.url ) this.url = o.url;
  if( o.cb ) this.cb = o.cb;
  if( o.getUrl ) this.getUrl = o.getUrl;

  return this[type].bind( this );
}

Api.prototype.url = "";

Api.prototype.get = function( req, res ){

  this.res = res;
  this.req = req;

  if( req.session && ! req.session.oauth )
    return res.send({ error: 'Forbidden' }, 403);

  var
    token = req.session.oauth,
    url = this.getUrl() +'?access_token='+ token;

  request( url_root + url, this.cb.bind(this) );

};

Api.prototype.getUrl = function(){
  return this.url;
};

Api.prototype.cb = function( error, response, body ){ 

  if( error )
    throw new Error( error );

  this.res.send( body, response.statusCode );

};

/* ------------------------------ Routes ------------------------------ */

exports.repos = new Api('get', { url: '/user/repos' });

exports.orgs = new Api('get', { url: '/user/orgs' });

exports.org_repos = new Api('get', {
  getUrl: function(){
    return '/orgs/'+ this.req.params.org +'/repos';
  }
});
