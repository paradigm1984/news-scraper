// Require mongoose
var mongoose = require("mongoose");
// Create a schema class
var Schema = mongoose.Schema;

var CommentSchema = new Schema({

  comment: {
    type: String
  }
});

var Comment = mongoose.model("comment", CommentSchema);

module.exports = Comment;
