var
  config       = require('./config'),
  mongoose     = require('mongoose'),
  mongooseAuth = require('mongoose-auth'),
  Schema       = mongoose.Schema,
  ObjectId     = Schema.ObjectId,
  models       = {};


/* ------------------------------ Mongoose ------------------------------ */

mongoose.connect( config.mongo_url );

/* ------------------------------ User ------------------------------ */

models.user = new Schema();

var User;

models.user.plugin(mongooseAuth, {
    everymodule: {
      everyauth: {
          User: function () {
            return User;
          }
      }
    },

    github: {
      everyauth: {
        myHostname: config.hostname,
        appId: config.github.id,
        appSecret: config.github.secret,
        redirectPath: '/',
        scope: 'user,repo'
      }
    }

});

/* ------------------------------ Hook ------------------------------ */

models.hook = new Schema({
  id: Number,
  repo: { type: String, unique: true }
});

/* ------------------------------ Commit ------------------------------ */

models.commit = new Schema({});

/* ------------------------------ Exports ------------------------------ */

mongoose.model( 'User', models.user );
User = mongoose.model( 'User' );
exports.user = mongoose.model( 'User' );

mongoose.model( 'Hook', models.hook );
exports.hook = mongoose.model( 'Hook' );

mongoose.model( 'Commit', models.commit );
exports.commit = mongoose.model( 'Commit' );

exports.mongooseAuth = mongooseAuth;
exports.mongoose = mongoose;


