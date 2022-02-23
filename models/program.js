const   mongoose                = require("mongoose");

const programSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    duration : String,
    type: String,
    students : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Users"
    }],
    courses : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Courses"
    }],
    fee : Number // Fee that a student must pay in doing this program
});

module.exports = mongoose.model("Program", programSchema);
