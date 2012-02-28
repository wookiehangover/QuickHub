
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

// Routes

app.get('/', routes.index);

app.get('/admin', routes.admin);

app.get('/api/repos', routes.github.repos);

app.get('/api/orgs', routes.github.orgs);

app.get('/api/orgs/:org/repos', routes.github.org_repos);

app.listen( process.env.PORT || 3000 );
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
