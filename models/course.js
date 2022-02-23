const   mongoose            = require("mongoose");

const courseSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    abbr : String,
    courseCode : String,
    creditHour : Number,
    semester : String,
    lecturer : String,
    program : String,
    year : String
});

module.exports = mongoose.model("Course", courseSchema);
