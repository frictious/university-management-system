const   Student                 = require("../../models/user"),
        Program                 = require("../../models/program"),
        Fee                     = require("../../models/fee"),
        nodemailer              = require("nodemailer"),
        bcrypt                  = require("bcryptjs");

//CONFIG
require("dotenv").config();
//Nodemailer configuration
const transport = nodemailer.createTransport({
    service : "gmail",
    auth:{
        type: "login",
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

// GET ALL STUDENTS
exports.students = (req, res) => {
    Student.find({})
    .then(students => {
        if(students){
            res.render("admin/students/students", {
                title : "Njala University Management System Students",
                students : students
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

// ADD STUDENT FORM
exports.addStudent = (req, res) => {
    Program.find({})
    .then(programs => {
        if(programs){
            res.render("admin/students/add", {
                title : "Njala University Management System Add Student Form",
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

// ADD STUDENT LOGIC
exports.addStudentLogic = (req, res) => {
    if(req.body.password !== ""){
        Student.findOne({studentID : req.body.studentID})
        .then(foundStudent => {
            if(!foundStudent){
                bcrypt.genSalt(10)
                .then(salt => {
                    bcrypt.hash(req.body.password, salt)
                    .then(hash => {
                        if(hash){
                            Student.create({
                                studentID : req.body.studentID,
                                name : req.body.name,
                                email : req.body.email,
                                password : hash,
                                current_year : req.body.current_year,
                                program : req.body.program,
                                feePaid : 0,
                                role : "Student"
                            })
                            .then(student => {
                                Program.findOne({name : req.body.program})
                                .then(program => {
                                    if(program){
                                        program.students.push(student);//ADDING STUDENT TO THAT PROGRAM
                                        console.log("STUDENT INFORMATION ADDED TO PROGRAM");
                                        program.save();//SAVING THE STUDENT ID TO THAT PROGRAM
                                        
                                        //Send mail to student after successful registration
                                        const mailOptions = {
                                            from: process.env.EMAIL,
                                            to: req.body.email,
                                            subject : `Njala University Management System Login Information`,
                                            html: `<p>Dear <strong>${req.body.name}</strong>,</p>
                                            <p>This email is to inform you that you have been registered into the Njala University Management System.</p>
                                            <p>Your id is: <strong>${req.body.studentID}</strong>.</p>
                                            <p>You have paid: <strong>Le ${req.body.fee}</strong> fee.</p>
                                            <p>Your email is <strong>${req.body.email}</strong>.</p>
                                            <p>And your password is <strong>${req.body.password}</strong>.</p>
                                            <p>Please keep your login information private. If you so wish to change your password for security purposes, you can do so via the portal</p>

                                            <p>Note that your fee status will be updated once you fill the registration form, and send a copy of your University receipt by uploading it in the system</p>

                                            <p>Bear in  mind that you can and should change your password so it can be kept safe.</p>
                                            
                                            <br><br>
                                            <p>Sincerely</p>
                                            <p>Admissions Department</p>`
                                        }
                
                                        //Sending mail
                                        transport.sendMail(mailOptions, (err, mail) => {
                                            if(!err){
                                                console.log("MAIL SENT TO STUDENT");
                                                res.redirect("/admin/students");
                                            }else{
                                                console.log(err);
                                            }
                                        });
                                    }
                                })
                            })
                        }
                    })
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
}

// EDIT STUDENT FORM
exports.editStudent = (req, res) => {
    Student.findById({_id : req.params.id})
    .then(student => {
        if(student){
            Program.find({})
            .then(programs => {
                if(programs){
                    res.render("admin/students/update", {
                        title : "Njala University Management System Student Information Edit Form",
                        student : student,
                        programs : programs
                    });
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

// EDIT STUDENT LOGIC
exports.editStudentLogic = (req, res) => {
    Student.findByIdAndUpdate({_id : req.params.id}, {
        studentID : req.body.studentID,
        name : req.body.name,
        email : req.body.email,
        current_year : req.body.current_year,
        program : req.body.program,
        feePaid : req.body.feePaid
    })
    .then(student => {
        if(student){
            console.log("STUDENT INFORMATION UPDATED SUCCESSFULLY");
            res.redirect("/admin/students");
        }
    })
    .catch(err => {
        if(err){
            console.log(err);
            res.redirect("back");
        }
    });
    // else{
    //     bcrypt.genSalt(10)
    //     .then(salt => {
    //         bcrypt.hash(req.body.password, salt)
    //         .then(hash => {
    //             if(hash){
    //                 Student.create({
    //                     studentID : req.body.studentID,
    //                     name : req.body.name,
    //                     email : req.body.name,
    //                     password : hash,
    //                     current_year : req.body.current_year,
    //                     program : req.body.program
    //                 })
    //                 .then(student => {
    //                     Program.findOne({name : req.body.program})
    //                     .then(program => {
    //                         if(program){
    //                             program.students.push(student);//ADDING STUDENT TO THAT PROGRAM
    //                             program.save();//SAVING THE STUDENT ID TO THAT PROGRAM
                                
    //                             //Send mail to student after successful registration
    //                             const mailOptions = {
    //                                 from: process.env.EMAIL,
    //                                 to: req.body.email,
    //                                 subject : `Njala Student Result Management System Login Information`,
    //                                 html: `<p>Dear <strong>${req.body.name}</strong>,</p>
    //                                 <p>This email is to inform you that your password just changed, if this was not you, kindly use the link below to change your password and secure your account.</p>
                                    
    //                                 <p>If this was you, ignore this message.</p>

    //                                 <br><br>
    //                                 <p>Sincerely</p>
    //                                 <p>Exams Office</p>`
    //                             }
        
    //                             //Sending mail
    //                             transport.sendMail(mailOptions, (err, mail) => {
    //                                 if(!err){
    //                                     res.redirect("/admin/students");
    //                                 }else{
    //                                     console.log(err);
    //                                 }
    //                             });
    //                         }
    //                     })
    //                 })
    //             }
    //         })
    //     })
    //     .catch(err => {
    //         if(err){
    //             console.log(err);
    //             res.redirect("back");
    //         }
    //     });
    // }
}

// STUDENT FEE
exports.studentFee = (req, res) => {
    Student.findById({_id: req.params.id})
    .then(student => {
        res.render("admin/students/fee", {
            title : "Njala University Management System Add Student Form",
            student : student
        });
    })
    .catch(err => {
        console.log(err);
        res.redirect("back");
    });
}

// STUDENT FEE LOGIC
exports.addStudentFeeLogic = (req, res) => {
    Student.findByIdAndUpdate({_id : req.params.id}, {
        fee : req.body.fee
    })
    .then(student => {
        Fee.findOne({studentID : student.studentID})
        .then(fee => {
            if(fee){
                const newFee = fee.amountPaid + req.body.amountPaid;
                Fee.findByIdAndUpdate({_id : fee._id}, {amountPaid : newFee})
                .then(fee)
                //Send mail to student after successful registration
                const mailOptions = {
                    from: process.env.EMAIL,
                    to: student.email,
                    subject : `Njala University Management System Login Information`,
                    html: `<p>Dear <strong>${student.name}</strong>,</p>
                    <p>This email is to inform you that you have paid ${req.body.amountPaid}, and the total fee paid is now ${newFee}</p>
                    
                    <p>If there are any issues or there are issues with your fees, please contact the finance office for clarifications.</p>

                    <p>Thank you</p>

                    <br><br>
                    <p>Sincerely</p>
                    <p>Finance Department</p>`
                }

                //Sending mail
                transport.sendMail(mailOptions, (err, mail) => {
                    if(!err){
                        console.log("MAIL SENT TO STUDENT");
                        res.redirect("/admin/students");
                    }else{
                        console.log(err);
                    }
                });
            }
        })
    })
    .catch(err => {
        console.log(err);
        res.redirect("back");
    });
}

// DELETE STUDENT
exports.deleteStudent = (req, res) => {
    Student.findByIdAndDelete({_id : req.params.id})
    .then(student => {
        if(student){
            console.log("STUDENT INFORMATION DELETED SUCCESSFULLY");
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