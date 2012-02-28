
/*
 * GET home page.
 */

exports.github = require('./github');

exports.index = function(req, res){
  res.render('index', {
    title: 'Express'
  });
};

exports.logout = function( req, res ){
  req.logout();
  res.redirect('/');
};

exports.admin = function( req, res ){
  res.render('admin', {
    title: 'QuickHub | Admin',
    js_module: 'repos'
  });
};
