const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
     categoryName: String
},{ timestamps: true, });

const categories = mongoose.model("Categories", categorySchema);
module.exports = categories;