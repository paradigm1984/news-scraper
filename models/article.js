// Require mongoose
var mongoose = require("mongoose");
// Create Schema class
var Schema = mongoose.Schema;

// Create article schema
var ArticleSchema = new Schema({
  // title is a non required string because i wasnt able to take out the empty objects when scraping
  title: {
    type: String,
    required: false
  },
  link: {
    type: String,
    required: false
  },
  // link is a non required string because i wasnt able to take out the empty objects when scraping
  summary: {
    type: String,
    required: false
  },
  // This only saves one note's ObjectId, ref refers to the Note model
  note: {
    type: Schema.Types.ObjectId,
    ref: "comment"
  }
});

// Create the Article model with the ArticleSchema
var Article = mongoose.model("article", ArticleSchema);

// Export the model
module.exports = Article;
