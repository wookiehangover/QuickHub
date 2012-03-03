var
  Hook = require('../models').hook,
  ApiRequest = require('../github');

/* ------------------------------ Routes ------------------------------ */

exports.repos = new ApiRequest('get', { url: '/user/repos' });

exports.orgs = new ApiRequest('get', { url: '/user/orgs' });

exports.org_repos = new ApiRequest('get', {
  getUrl: function(){
    return '/orgs/'+ this.req.params.org +'/repos';
  }
});


exports.org_events = new ApiRequest('get', {
  getUrl: function(){
    return '/users/'+ this.req.params.user +'/events/orgs/'+ this.req.params.org;
  }
});


exports.hooks = {};

exports.hooks.index = function( req, res ){
  Hook.find({}, function( err, docs ){

    if( err )
      return res.send({ error: err }, 500);

    res.send( docs );
  });
};

exports.hooks.show = new ApiRequest('get', {
  getUrl: function(){
    return '/repos/'+ this.req.params.user +'/'+ this.req.params.repo +'/hooks';
  }
}); 

exports.hooks.create = new ApiRequest('post', {
  getUrl: function(){
    return '/repos/'+ this.req.params.user +'/'+ this.req.params.repo +'/hooks';
  },
  cb: function( error, response, body ){

    if( error )
      throw new Error( error );

    var
      _this = this,
      hook = new Hook( body );

    hook.repo = this.req.params.repo;

    // FIXME
    //hook.user = 
    console.log(body);

    hook.save(function( err ){
      console.log('saved');
      _this.res.send( body, response.statusCode );
    });
  }
});

exports.hooks.test = new ApiRequest('post', {
  getUrl: function(){
    return '/repos/'+ this.req.params.user +'/'+ this.req.params.repo +'/hooks/'+ this.req.params.id + '/test';
  }
});

exports.hooks.del = new ApiRequest('del', {
  getUrl: function(){
    return '/repos/'+ this.req.params.user +'/'+ this.req.params.repo +'/hooks/'+ this.req.params.id;
  },
  cb: function( error, response, body ){
    if( error )
      throw new Error( error );

    var _this = this;

    Hook.find({ id: this.req.params.id }).remove(function( err ){
      _this.res.send({},200);
    });
  }
});



