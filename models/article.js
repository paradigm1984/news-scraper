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
  createdAt: {
    type: Date, 
    default: Date.now
  },
  // This only saves one note's ObjectId, ref refers to the Note model
  comments:[{
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }]
});

// Create the Article model with the ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = Article;
