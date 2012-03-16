
/**
 * Module dependencies.
 */

var
  express      = require('express'),
  everyauth    = require('everyauth'),
  SessionStore = require('connect-redis')(express),

  config       = require('./lib/config'),
  routes       = require('./lib/routes'),
  models       = require('./lib/models'),
  mongooseAuth = models.mongooseAuth;

var sio = require('socket.io');

// Create server instance

var app = express.createServer(
  express.bodyParser(),
  express.static(__dirname + '/assets'),
  express.methodOverride(),
  express.cookieParser(),
  express.session({
    secret: 'suoiciled era sgodtoh',
    store: new SessionStore( config.redis.connect ),
    maxAge: 900001
  }),
  mongooseAuth.middleware()
);

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(app.router);
});

app.configure('development', function(){
  everyauth.debug = true;
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
  app.helpers({ production: true });
});

mongooseAuth.helpExpress( app );

// Web Sockets

var io = sio.listen( app );

io.sockets.on('connection', function( socket ){

  socket.on('disconnect', function () {
    io.sockets.emit('user disconnected');
  });

});

// Routes

app.get('/', routes.index);

app.get('/repos', routes.repos);

app.get('/hooks', routes.hooks);

app.get('/api/orgs', routes.github.orgs);

app.get('/api/orgs/:org/repos', routes.github.org_repos);

app.get('/api/users/:user/orgs/:org', routes.github.org_events);

app.post('/api/hook/:id', function( req, res ){

  var data = JSON.parse( req.body.payload );

  var commit = new models.commit( data );

  commit._owner = req.params.id;

  console.log(data);

  commit.save(function(err){
    if( err )
      throw new Error(err);

    io.sockets.emit( 'hook', data );
    res.send({}, 202);
  });
});

app.get('/api/hooks', routes.github.hooks.index);

app.get('/api/commits', routes.commit.index);
app.del('/api/commits/:id', routes.commit.del);

app.get('/api/repos', routes.github.repos);

app.get('/api/repos/:user/:repo/hooks', routes.github.hooks.show);

app.post('/api/repos/:user/:repo/hooks', routes.github.hooks.create);

app.del('/api/repos/:user/:repo/hooks/:id', routes.github.hooks.del);

app.post('/api/repos/:user/:repo/hooks/:id/test', routes.github.hooks.test);

app.listen( process.env.PORT || 3000 );
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
