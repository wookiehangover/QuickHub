
(function(/*! Stitch !*/) {
  if (!this.require) {
    var modules = {}, cache = {}, require = function(name, root) {
      var path = expand(root, name), module = cache[path], fn;
      if (module) {
        return module.exports;
      } else if (fn = modules[path] || modules[path = expand(path, './index')]) {
        module = {id: path, exports: {}};
        try {
          cache[path] = module;
          fn(module.exports, function(name) {
            return require(name, dirname(path));
          }, module);
          return module.exports;
        } catch (err) {
          delete cache[path];
          throw err;
        }
      } else {
        throw 'module \'' + name + '\' not found';
      }
    }, expand = function(root, name) {
      var results = [], parts, part;
      if (/^\.\.?(\/|$)/.test(name)) {
        parts = [root, name].join('/').split('/');
      } else {
        parts = name.split('/');
      }
      for (var i = 0, length = parts.length; i < length; i++) {
        part = parts[i];
        if (part == '..') {
          results.pop();
        } else if (part != '.' && part != '') {
          results.push(part);
        }
      }
      return results.join('/');
    }, dirname = function(path) {
      return path.split('/').slice(0, -1).join('/');
    };
    this.require = function(name) {
      return require(name, '');
    }
    this.require.define = function(bundle) {
      for (var key in bundle)
        modules[key] = bundle[key];
    };
  }
  return this.require.define;
}).call(this)({"dashboard": function(exports, require, module) {var nm = require('./modules/namespace');

var CommitView = Backbone.View.extend({

  tagName: 'li',

  initialize: function(){
    this.render();

    this.model.bind('destroy', this.remove, this);
  },

  events: {
    'click .icon-remove': 'destroy'
  },

  render: function(){
    var content = JST.commit( this.model.toJSON() );
    this.$el.html( content ).prependTo('#commits');
  },

  destroy: function(e){
    if( confirm('Are you sure you want to remove this commit?') )
      this.model.destroy();

    return false;
  }

});

/* ------------------------------ Model ------------------------------ */

var Commit = Backbone.Model.extend({

  initialize: function(){
    this.view = new CommitView({ model: this });
  }

});

/* ------------------------------ Collection ------------------------------ */

var CommitsCollection = Backbone.Collection.extend({

  url: '/api/commits/',

  model: Commit,

  initialize: function(){
    this.deferred = this.fetch();
  }

});

/* ------------------------------ Socket ------------------------------ */
nm.socket = io.connect();

nm.init = function( $ ){

  nm.commits = new CommitsCollection();

  nm.socket.on('connect', function(){
    console.log('connected');
  });

  nm.socket.on('hook', function( body ){
    console.log('fired');
    nm.commits.add( new Commit( body ) );
  });

};


jQuery( nm.init );
}, "hooks": function(exports, require, module) {var nm = require('./modules/namespace');

$('.remove-hook').on('click', function( e ){
  var $this = $(this);

  $.ajax({
    type: 'delete',
    url: $this.attr('href')
  }).done(function(){
    $this.parent().remove();
  });

  return false;
});

$('.test-hook').on('click', function( e ){

  $.post( $(this).attr('href'), function( data ){
    console.log(data);
  });

  return false;
});

}, "modules/localstorage": function(exports, require, module) {/**
 * Backbone localStorage Adapter v1.0
 * https://github.com/jeromegn/Backbone.localStorage
 */

// A simple module to replace `Backbone.sync` with *localStorage*-based
// persistence. Models are given GUIDS, and saved into a JSON object. Simple
// as that.

// Generate four random hex digits.
function S4() {
   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
};

// Generate a pseudo-GUID by concatenating random hexadecimal.
function guid() {
   return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
};

// Our Store is represented by a single JS object in *localStorage*. Create it
// with a meaningful name, like the name you'd give a table.
window.Store = function(name) {
  this.name = name;
  var store = localStorage.getItem(this.name);
  this.records = (store && store.split(",")) || [];
};

_.extend(Store.prototype, {

  // Save the current state of the **Store** to *localStorage*.
  save: function() {
    localStorage.setItem(this.name, this.records.join(","));
  },

  // Add a model, giving it a (hopefully)-unique GUID, if it doesn't already
  // have an id of it's own.
  create: function(model) {
    if (!model.id) model.id = model.attributes.id = guid();
    localStorage.setItem(this.name+"-"+model.id, JSON.stringify(model));
    this.records.push(model.id.toString());
    this.save();
    return model;
  },

  // Update a model by replacing its copy in `this.data`.
  update: function(model) {
    localStorage.setItem(this.name+"-"+model.id, JSON.stringify(model));
    if (!_.include(this.records, model.id.toString())) this.records.push(model.id.toString()); this.save();
    return model;
  },

  // Retrieve a model from `this.data` by id.
  find: function(model) {
    return JSON.parse(localStorage.getItem(this.name+"-"+model.id));
  },

  // Return the array of all models currently in storage.
  findAll: function() {
    return _.map(this.records, function(id){return JSON.parse(localStorage.getItem(this.name+"-"+id));}, this);
  },

  // Delete a model from `this.data`, returning it.
  destroy: function(model) {
    localStorage.removeItem(this.name+"-"+model.id);
    this.records = _.reject(this.records, function(record_id){return record_id == model.id.toString();});
    this.save();
    return model;
  }

});

// localSync delegate to the model or collection's
// *localStorage* property, which should be an instance of `Store`.
Backbone.localSync = function(method, model, options, error) {

  // Backwards compatibility with Backbone <= 0.3.3
  if (typeof options == 'function') {
    options = {
      success: options,
      error: error
    };
  }

  var resp;
  var store = model.localStorage || model.collection.localStorage;

  switch (method) {
    case "read":    resp = model.id != undefined ? store.find(model) : store.findAll(); break;
    case "create":  resp = store.create(model);                            break;
    case "update":  resp = store.update(model);                            break;
    case "delete":  resp = store.destroy(model);                           break;
  }

  if (resp) {
    options.success(resp);
  } else {
    options.error("Record not found");
  }
};

// Override 'Backbone.sync' to default to localSync, 
// the original 'Backbone.sync' is still available in 'Backbone.ajaxSync'
Backbone.ajaxSync = Backbone.sync;
Backbone.sync = Backbone.localSync;
}, "modules/namespace": function(exports, require, module) {this.QuickHub = this.QuickHub || {
  module: function() {
    // Internal module cache.
    var modules = {};

    // Create a new module reference scaffold or load an existing module.
    return function(name) {
      // If this module has already been created, return it.
      if (modules[name]) {
        return modules[name];
      }

      // Create a module and save it under this name
      return ( modules[name] = { Views: {} } );
    };
  }(),

  // Keep active application instances namespaced under an app object.
  app: _.extend({}, Backbone.Events)
};

Backbone.Model.prototype.idAttribute = "_id";

// use localstorage for anonymous users
//if( ( this.Stout.local = ! this.ea_loggedIn ) ){
  //require('modules/localstorage');
//} else {
  //// make a dummy storage method
  //this.Store = function(){ return {}; };
//}

module.exports = this.QuickHub;
}, "modules/repos": function(exports, require, module) {var nm = require('./namespace');

var RepoView = exports.View = Backbone.View.extend({

  tagName: 'article',

  initialize: function(){
    //this.render();
  },

  render: function(){
    var content = JST.repo( this.model.toJSON() );
    var repos = $('#repos');

    repos.find('.loader').remove();
    this.$el.html( content ).appendTo( repos );
  },

  events: {
    "click a": "createHook"
  },

  createHook: function( e ){
    var _this = this;

    this.model.createHook()
      .done(function(){
        alert('hook added');
      });
    return false;
  }

});

/* ------------------------------ Repo Model ------------------------------ */

var Repo = exports.Model = Backbone.Model.extend({

  initialize: function(){

    this.view = new RepoView({ model: this });

    //this.bind('change', function(){
      //this.view.render();
    //}, this);

  },

  createHook: function(){
    return $.post('/api/repos/'+ this.get('owner').login +'/'+ this.get('name') +'/hooks', {
      name: "web",
      active: true,
      config: {
        url: "http://dev.wookiehangover.com/api/hook/"+ window._id
      }
    });
  }

});

/* ------------------------------ Repo Collection ------------------------------ */

var ReposCollection = exports.Collection = Backbone.Collection.extend({

  model: Repo,

  url: '/api/repos',

  initialize: function(){
    this.deferred = this.fetch();

    this.on('reset', function(){
      this.each(function( repo ){
        repo.view.render();
      });

      if( nm.qs )
        nm.qs.cache();

    }, this);

  },

  comparator: function( repo ){
    return -new Date( repo.get('pushed_at') );
  }

});
}, "repos": function(exports, require, module) {var
  nm = require('./modules/namespace'),
  repos = require('./modules/repos');

var OrgView = Backbone.View.extend({

  className: 'item',

  initialize: function(){
    this.render();
  },

  render: function(){
    var content = JST.org_nav( this.model.toJSON() );
    this.$el.html( content ).appendTo('#orgs');
  }

});

var Org = Backbone.Model.extend({

  initialize: function(){
    this.view = new OrgView({ model: this });
  }

});

var OrgsCollection = Backbone.Collection.extend({

  model: Org,

  url: '/api/orgs',

  initialize: function(){
    this.deferred = this.fetch();
  }

});

nm.init = function( $ ){

  nm.repos = { user: new repos.Collection() };
  nm.orgs = new OrgsCollection();
  nm.qs = $('#filter').quicksearch('#repos article');

  $('#orgs').on('click', 'a', function(e){
    $('#repos').html('<img src="/images/loader.gif" class="loader" />');

    var org_name = $(e.currentTarget).data('repo');

    if( nm.repos[org_name] ){
      nm.repos[org_name].trigger('reset');
    } else {
      nm.repos[org_name] = new ( repos.Collection.extend({ url: '/api/orgs/'+ org_name +'/repos?type=member' }) )();
    }

    return false; 
  });

};

jQuery( nm.init );
}});
