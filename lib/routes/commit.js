var Commit = require('../models').commit;

exports.index = function( req, res ){
  Commit.find({ _owner: req.user._id }).run(function( err, docs ){
    if( err ){
      return res.send({ error: "Not found" }, 404);
    }

    res.send( docs );
  });
};

exports.del = function( req, res ){
  Commit.remove({ _id: req.params.id }, function( err ){
    if( err )
      return res.send({ error: err }, 404);

    res.send( {}, 204 );
  });
};
