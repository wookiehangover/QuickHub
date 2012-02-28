var nm = require('./modules/namespace');

var RepoView = Backbone.View.extend({

  tagName: 'article',

  initialize: function(){
    this.render();
  },

  render: function(){
    var content = JST.repo( this.model.toJSON() );
    this.$el.html( content ).appendTo('#repos');
  }

});

/* ------------------------------ Model ------------------------------ */

var Repo = Backbone.Model.extend({

  initialize: function(){

    this.view = new RepoView({ model: this });

    this.bind('change', function(){
      this.view.render();
    }, this);

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

  new ReposCollection();

};

jQuery( nm.init );
