// Require mongoose
var mongoose = require("mongoose");
// Create a schema class
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
	comment: {
		type: String
	},
	createdAt: {
		type: Date, 
		default: Date.now
	}
});

var Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
