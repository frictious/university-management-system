const   mongoose                = require("mongoose");

const registrationSchema = mongoose.Schema({
    studentID : Number,
    studentName : {
        type: String,
        required : true
    },
    email : String,
    current_year : String,
    academicYear : String,
    dob : Date,
    address : String,
    program : String,
    status : String, // Status is to check if a student has been registered or not
    feePaid : Number,
    feeReceipt : String,
});

module.exports = mongoose.model("Registration", registrationSchema);
