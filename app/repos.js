var nm = require('./modules/namespace');

var RepoView = Backbone.View.extend({

  tagName: 'article',

  initialize: function(){
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

    this.bind('change', function(){
      this.view.render();
    }, this);

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



nm.init = function( $ ){

  nm.repos = new ReposCollection();

};

jQuery( nm.init );
