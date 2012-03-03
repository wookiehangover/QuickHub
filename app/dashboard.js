var nm = require('./modules/namespace');

var CommitView = Backbone.View.extend({

  tagName: 'li',

  initialize: function(){
    this.render();
  },

  render: function(){
    var content = JST.commit( this.model.toJSON() );
    this.$el.html( content ).prependTo('#commits');
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
