var
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

  $('#orgs').on('click', 'a', function(e){
    $('#repos').empty();

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
