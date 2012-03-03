var Commit = require('../models').commit;

exports.index = function( req, res ){
  Commit.find({}, function( err, docs ){
    if( err ){
      return res.send({ error: "Not found" }, 404);
    }

    return res.send( docs );
  });
};
