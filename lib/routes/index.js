var
  Hook = require('../models').hook;

exports.github = require('./github');

exports.commit = require('./commit');

exports.index = function(req, res){
  res.render('index', {
    title: 'QuickHub',
    js_module: req.user ? 'dashboard': false
  });
};

exports.logout = function( req, res ){
  req.logout();
  res.redirect('/');
};

exports.repos = function( req, res ){
  res.render('repos', {
    title: 'QuickHub | Admin',
    js_module: 'repos'
  });
};

exports.hooks = function( req, res ){

  Hook.find({}, function( err, docs ){

    if( err )
      return res.send({ error: err }, 500);

    res.render('hooks', {
      title: 'Hooks',
      js_module: 'hooks',
      hooks: docs
    });
  });

};



