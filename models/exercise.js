const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
    name: String,
    category: String,
    level: String,
    reps: String,
    img: String,
    video: String,
});

module.exports = mongoose.model("Exercise", exerciseSchema);
