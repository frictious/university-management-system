const   mongoose                = require("mongoose");

const studentSchema = mongoose.Schema({
    studentID : Number,
    name : {
        type: String,
        required : true
    },
    email : String,
    password : String,
    current_year : String,
    program : String,
    role : String,
    status : String, // Status is to check if a student has been registered or not
    feePaid : Number
});

module.exports = mongoose.model("Students", studentSchema);
