const   mongoose                    = require("mongoose");

const gradeSchema = mongoose.Schema({
    program : String,
    course : String,
    grade : String,
    studentID : Number,
    semester : String,
    academicYear : String,
    student_year : String//Year Student was in at the time the grade was entered
    // gpa : Number,
    // remarks : String
});

module.exports = mongoose.model("Grade", gradeSchema);
