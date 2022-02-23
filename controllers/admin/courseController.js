const   Course              = require("../../models/course"),
        Program             = require("../../models/program");

// GET ALL COURSES
exports.courses = (req, res) => {
    Course.find({})
    .then(courses => {
        if(courses){
            res.render("admin/course/courses", {
                title : "Njala SRMS Courses",
                courses : courses
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

// GET COURSE ADD FORM
exports.addCourse = (req, res) => {
    Program.find({})
    .then(programs => {
        if(programs){
            res.render("admin/course/add", {
                title : "Njala SRMS Course Add",
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

// COURSE ADD LOGIC
exports.addCourseLogic = (req, res) => {
    Course.create({
        name : req.body.name,
        abbr : req.body.abbr,
        courseCode : req.body.courseCode,
        creditHour : req.body.creditHour,
        semester : req.body.semester,
        lecturer : req.body.lecturer,
        program : req.body.program,
        year : req.body.year
    })
    .then(course => {
        if(course){
            Program.findOne({name : req.body.program})
            .then(program => {
                if(program){
                    program.courses.push(course);//ADDING THE NEWLY CREATED COURSE TO PROGRAM
                    program.save();//SAVING THE ENTRY
                    res.redirect("/admin/course/add");
                }
            })
        }
    })
    .catch(err => {
        if(err){
            console.log(err);
            res.redirect("back");
        }
    })
}

// COURSE VIEW/EDIT FORM
exports.editCourse = (req, res) => {
    Course.findById({_id : req.params.id})
    .then(course => {
        if(course){
            Program.find({})
            .then(programs => {
                if(programs){
                    res.render("admin/course/update", {
                        title : "Njala SRMS Course Edit Form",
                        course : course,
                        programs : programs
                    })
                }
            })
        }
    })
    .catch(err => {
        if(err){
            console.log(err);
            res.redirect("back");
        }
    });
}

// COURSE VIEW/EDIT LOGIC
exports.editCourseLogic = (req, res) => {
    Course.findByIdAndUpdate({_id : req.params.id}, req.body)
    .then(course => {
        if(course){
            console.log("COURSE INFORMATION UPDATED SUCCESSFULLY");
            res.redirect("/admin/courses");
        }
    })
    .catch(err => {
        if(err){
            console.log(err);
            res.redirect("back");
        }
    });
    
}

// COURSE DELETE LOGIC
exports.deleteCourse = (req, res) => {
    Course.findByIdAndDelete({_id : req.params.id})
    .then(course => {
        if(course){
            console.log("COURSE DELETED SUCCESSFULLY");
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
