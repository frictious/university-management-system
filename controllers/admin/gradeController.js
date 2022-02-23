const   Grade                   = require("../../models/grade"),
        Course                  = require("../../models/course"),
        Student                 = require("../../models/user"),
        Program                 = require("../../models/program");

// GET GRADE FORM
exports.grades = (req, res) => {
    Grade.find({})
    .then(grades => {
        if(grades){
            res.render("admin/grade/grades", {
                title : "Njala SRMS Students Grades",
                grades : grades
            });
        }
    })
    .catch(err => {
        if(err){
            console.log(err);
            res.redirect("back");
        }
    });
}

// GRADE SEARCH FORM
exports.gradeSearch = (req, res) => {
    Program.find({})
    .then(programs => {
        if(programs){
            res.render("admin/grade/search", {
                title : "Njala SRMS Student Grade Search",
                programs : programs
            });
        }
    })
    .catch(err => {
        if(err){
            console.log(err);
            res.redirect("back");
        }
    });
}

// GRADE SEARCH LOGIC
exports.gradeSearchLogic = (req, res) => {
    Student.findOne({studentID : req.body.studentID})
    .then(student => {
        Program.findOne({name : req.body.programName})
        .then(program => {
            Course.find({year : student.current_year, semester : req.params.semester})
            .then(courses => {
                if(courses){
                    res.redirect(`/admin/grade/add/${req.body.studentID}/${req.body.year}/${req.body.semester}/${req.body.programName}`);
                    // , {
                    //     title : "Njala SRMS Student Grade",
                    //     student : student,
                    //     program : program,
                    //     courses : courses
                    // }
                }
            })
        })
    })
    .catch(err => {
        if(err){
            console.log(err);
            res.redirect("back");
        }
    });
}

// GET ADD GRADE FORM
exports.addGrade = (req, res) => {
    const semester = req.params.semester;
    Program.findOne({name : req.params.programName})
    .then(program => {
        Student.findOne({studentID : req.params.studentID, current_year : req.params.year})
        .then(student => {
            Course.find({program : req.params.programName})
            .then(courses => {
                res.render("admin/grade/add", {
                    title : "Njala SRMS Student Grade",
                    courses : courses,
                    program : program,
                    student : student,
                    semester : semester
                });
            })
        })
    })
    .catch(err => {
        if(err){
            console.log(err);
            res.redirect("back");
        }
    });
}

// ADD GRADE LOGIC
exports.addGradeLogic = (req, res) => {
    Grade.create({
        program : req.body.program,
        course : req.body.course,
        grade : req.body.grade,
        studentID : req.body.studentID,
        semester : req.body.semester,
        academicYear : req.body.academicYear,
        student_year : req.body.student_year
    })
    .then(grade => {
        if(grade){
            console.log("GRADE ADDED SUCCESSFULLY");
            res.redirect("back");
        }
    })
    .catch(err => {
        if(err){
            console.log(err);
            res.redirect("back");
        }
    });
}

// VIEW GRADE EDIT FORM
exports.editGrade = (req, res) => {
    Grade.findById({_id : req.params.id})
    .then(grade => {
        if(grade){
            res.render("admin/grade/update", {
                title : "Njala SRMS Students Grade Edit Form",
                grade : grade
            });
        }
    })
    .catch(err => {
        if(err){
            console.log(err);
            res.redirect("back");
        }
    });
}

// UPDATE/EDIT GRADE LOGIC
exports.editGradeLogic = (req, res) => {
    Grade.findByIdAndUpdate({_id : req.params.id}, req.body)
    .then(grade => {
        if(grade){
            console.log("GRADE UPDATED SUCCESSFULLY");
            res.redirect("back");
        }
    })
    .catch(err => {
        if(err){
            console.log(err);
            res.redirect("back");
        }
    });
}

// DELETE GRADE
exports.deleteGrade = (req, res) => {
    Grade.findByIdAndDelete({_id : req.params.id})
    .then(grade => {
        if(grade){
            console.log("GRADE INFORMATION DELETED SUCCESSFULLY");
            res.redirect("back");
        }
    })
    .catch(err => {
        if(err){
            console.log(err);
            res.redirect("back");
        }
    });
}
