var
  redis_options = {},
  client_options = [],
  redis_url = process.env.REDISTOGO_URL || false;

if( redis_url ){
  redis_url = require('url').parse( redis_url );

  redis_options = {
      host: redis_url.hostname
    , port: redis_url.port
    , db:   redis_url.auth.split(':')[0]
    , pass: redis_url.auth.split(':')[1]
  };

  client_options = [redis_options.port, redis_options.host];
}

module.exports = {

  hostname: process.env.FB_URL || 'http://batman.local:3000',

  mongo_url: process.env.MONGOLAB_URI || 'mongodb://localhost/quickhub',

  github: {
    id: process.env.GH_ID,
    secret: process.env.GH_SECRET
  },

  redis: {
    config: redis_options,
    connect: client_options
  }

};

