var nm = require('./modules/namespace');

var RepoView = Backbone.View.extend({

  tagName: 'article',

  initialize: function(){
    if( ! this.model.get('name') )
      debugger;
    this.render();
  },

  render: function(){
    var content = JST.repo( this.model.toJSON() );
    this.$el.html( content ).appendTo('#repos');
  },

  events: {
    "click a": "createHook"
  },

  createHook: function( e ){
    this.model.createHook();
    return false;
  }

});

/* ------------------------------ Model ------------------------------ */

var Repo = Backbone.Model.extend({

  initialize: function(){

    this.view = new RepoView({ model: this });

    //this.bind('change', function(){
      //this.view.render();
    //}, this);

  },

  createHook: function(){
    $.post('/api/repos/'+ this.get('owner').login +'/'+ this.get('name') +'/hooks', {
      name: "web",
      active: true,
      config: {
        url: "http://dev.wookiehangover.com/api/hook"
      }
    });
  }

});

/* ------------------------------ Collection ------------------------------ */

var ReposCollection = Backbone.Collection.extend({

  model: Repo,

  url: '/api/repos',

  initialize: function(){
    this.deferred = this.fetch();
  }

});


var OrgView = Backbone.View.extend({

  className: 'item',

  initialize: function(){
    this.render();
  },

  render: function(){
    var content = JST.org_nav( this.model.toJSON() );
    this.$el.html( content ).appendTo('#orgs');
  },

  events: {
    "click a": "changeRepos"
  },

  changeRepos: function( e ){

    var org_name = $(e.currentTarget).text();

    $('#repos').empty();

    new ( ReposCollection.extend({ url: '/api/orgs/'+ org_name +'/repos?type=member' }) )();

    return false;
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

  nm.repos = new ReposCollection();
  nm.orgs = new OrgsCollection();

};

jQuery( nm.init );
