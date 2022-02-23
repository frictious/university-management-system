// REQUIRED MODULES WILL BE HERE
const   Student                 = require("../models/user"),
        Registration            = require("../models/registration"),
        bcrypt                  = require("bcryptjs"),
        passport                = require("passport"),
        Program                 = require("../models/program"),
        Course                  = require("../models/course"),
        Register                = require("../models/registration");
        Grade                   = require("../models/grade"),
        crypto                  = require("crypto"),
        path                    = require("path"),
        multer                  = require("multer"),
        {GridFsStorage}         = require("multer-gridfs-storage"),
        Grid                    = require("gridfs-stream"),
        mongoose                = require("mongoose"),
        nodemailer              = require("nodemailer");

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

//GRIDFS File db connection
const URI = process.env.MONGOOSE;
const conn = mongoose.createConnection(URI, {
    useNewUrlParser : true,
    useUnifiedTopology : true
});

//GRIDFS CONFIG FOR IMAGES
let gfs;
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("files");
});

//GRIDFS STORAGE CONFIG
const storage = new GridFsStorage({
    url: URI,
    options : {useUnifiedTopology : true},
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
            if (err) {
                return reject(err);
            }
            const filename = buf.toString('hex') + path.extname(file.originalname);
            const fileInfo = {
                filename: filename,
                bucketName: "files"
            };
            resolve(fileInfo);
            });
        });
    }
});

//Multer config for images
const files = multer({ storage });


require("../config/login")(passport);

// INDEX ROUTE
exports.index = (req, res) => {
    Registration.findOne({current_year : req.user.current_year, email : req.user.email})
    .then(registration => {
        res.render("index", {
            title : "Njala University Management System Homepage",
            registration : registration
        });
    })
    .catch(err => {
        console.log(err);
        res.redirect("back");
    });
}

// STATUS PAGE
exports.status = (req, res) => {
    Student.findById({_id : req.user._id})
    .then(student => {
        if(student){
            Program.findOne({name : student.program})
            .then(program => {
                Course.find({program : program.name})
                .then(courses => {
                    Register.findOne({email : student.email, current_year : student.current_year})
                    .then(registered => {
                        res.render("status", {
                            title : "Njala University Management Student Student Status Page",
                            student : student,
                            program : program,
                            courses : courses,
                            registered : registered
                        })
                    })
                })
            })
        }
    })
    .catch(err => {
        console.log(err);
        res.redirect("back");
    });
}

// REGISTER PAGE
exports.register = (req, res) => {
    Student.findById({_id : req.user._id})
    .then(student => {
        if(student){
            Program.findOne({name : student.program})
            .then(program => {
                Course.find({program : program.name})
                .then(courses => {
                    res.render("register", {
                        title : "Njala University Management Student Student Registration Page",
                        student : student,
                        program : program,
                        courses : courses
                    })
                })
            })
        }
    })
    .catch(err => {
        console.log(err);
        res.redirect("back");
    });
}

// REGISTER FORM LOGIC
exports.registerLogic = (req, res) => {
    Register.findOne({email : req.user.email})
    .then(register => {
        if(register){
            if(req.body.current_year === register.current_year){
                console.log("ALREADY REGISTERED FOR THIS ACADEMIC YEAR");
                res.redirect("/status");
            }else{
                Register.create({
                    studentID : req.body.studentID,
                    studentName : req.body.studentName,
                    email : req.body.email,
                    current_year : req.body.current_year,
                    academicYear : req.body.academicYear,
                    dob : req.body.dob,
                    address : req.body.address,
                    program : req.body.program,
                    status : "Pending",
                    feePaid : req.body.feePaid,
                    feeReceipt : req.file.filename
                })
                .then(registered => {
                    console.log("REGISTERED SUCCESSFULLY");
                    res.redirect("back");
                })
            }
        }else{
            Register.create({
                studentID : req.body.studentID,
                studentName : req.body.studentName,
                email : req.body.email,
                current_year : req.body.current_year,
                academicYear : req.body.academicYear,
                dob : req.body.dob,
                address : req.body.address,
                program : req.body.program,
                status : "Pending",
                feePaid : req.body.feePaid,
                feeReceipt : req.file.filename
            })
            .then(registered => {
                console.log("REGISTERED SUCCESSFULLY");
                res.redirect("back");
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.redirect("back");
    });
}

// RESULT ROUTE
exports.indexController = (req, res) => {
    Student.findOne({studentID : req.params.studentID})
    .then(student => {
        Program.findOne({name : student.program})
        .then(program => {
            Grade.find({student_year : req.params.student_year})
            .then(grades => {
                if(grades){
                    Course.find({}).sort()
                    .then(courses => {
                        if(courses){
                            res.render("result", {
                                title : "Njala SRMS",
                                student : student,
                                program : program,
                                grades : grades,
                                courses : courses,
                                academicYear : req.params.academicYear,
                                year : req.params.student_year
                            });
                        }else{
                            res.redirect("/grade/search");
                        }
                    })
                }else{
                    res.redirect("/grade/search");
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

// LOGIN ROUTE
exports.loginController = (req, res) => {
    res.render("login", {
        title : "NJALA SRMS Login Page"
    });
}

// LOGIN LOGIC
exports.loginLogicController = (req, res, next) => {
    passport.authenticate("local", {
        successRedirect : "/",
        failureRedirect : "/login"
    })(req, res, next);
}

// FORGOT PASSWORD ROUTE
exports.forgotPassword = (req, res) => {
    res.render("forgot_password", {
        title : "Njala SRMS Forgot Password Page"
    });
}

// FORGOT PASSWORD LOGIC
exports.forgotPasswordLogic = (req, res) => {
    Student.findOne({email : req.body.email, studentID : req.body.studentID})
    .then(student => {
        if(student){
            // console.log(req.headers.host);
            const link = `${req.headers.host}/resetpassword/${student._id}/${student.studentID}`
            console.log(`"${link}"`);
            //Send mail to student after successful registration
            const mailOptions = {
                from: process.env.EMAIL,
                to: req.body.email,
                subject : `Njala University SRMS Password Reset`,
                html: `<p>Dear <strong>${student.name}</strong>,</p>
                <p>A request was made to reset your password. The link to resetting your password is given below.</p>

                <a href=http://${link}>Click Here</a>
                
                <p>Please keep your login information private. If you so wish to change your password for security purposes, you can do so via the portal</p>

                <p>Bear in  mind that you can and should change your password so it can be kept safe.</p>
                
                <br><br>
                <p>Sincerely</p>
                <p>Exams Office</p>`
            }

            //Sending mail
            transport.sendMail(mailOptions, (err, mail) => {
                if(!err){
                    console.log("PASSWORD RESET MAIL SENT TO STUDENT");
                    res.redirect("/passwordresetlink");
                }else{
                    console.log(err);
                }
            });
        }
    })
}

// RESET PASSWORD LINK MESSAGE
exports.resetpasswordmessage = (req, res) => {
    res.render("resetpasswordlink", {
        title : "Njala SRMS Password Reset Link Message"
    });
}

// RESET PASSWORD PAGE
exports.resetpassword = (req, res) => {
    Student.findById({_id : req.params.id})
    .then(student => {
        if(student){
            // console.dir(res);
            res.render("reset_password", {
                title : "Njal SRMS Reset Student Password",
                student : student
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

// RESET PASSWORD LOGIC
exports.resetpasswordLogic = (req, res) => {
    if(req.body.password === req.body.repassword){
        bcrypt.genSalt(10)
        .then(salt => {
            bcrypt.hash(req.body.password, salt)
            .then(hash => {
                if(hash){
                    Student.findByIdAndUpdate({_id : req.params.id}, {password : hash})
                    .then(student => {
                        if(student){
                            // console.log("STUDENT PASSWORD CHANGED SUCCESSFULLY");
                            res.redirect("/login");
                        }
                    })
                    
                }
            })
        })
        .catch(err => {
            if(err){
                console.log(err);
                res.redirect("back");
            }
        });
    }else{
        console.log("PASSWORDS DO NOT MATCH");
        res.redirect("back");
    }
}

// GRADE SEARCH FORM
exports.gradeSearch = (req, res) => {
    Student.findById({_id : req.user._id})
    .then(student => {
        res.render("gradesearch", {
            title : "Njala SRMS Student Grade Search"
        })
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
    Grade.find({
        student_year : req.body.student_year,
        studentID : req.body.studentID
    })
    .then(grade => {
        if(grade){
            res.redirect(`/${req.body.studentID}/${req.body.student_year}/result`);
        }
    })
    .catch(err => {
        if(err){
            console.log(err);
            res.redirect("back");
        }
    });
}

// LOGOUT LOGIC
exports.logout = (req, res) => {
    req.logout();
    res.redirect("/login");
}

//Getting the files
exports.files = (req, res) => {
    gfs.files.findOne({filename : req.params.filename}, (err, foundFiles) => {
        if(foundFiles){
            const readstream = gfs.createReadStream(foundFiles.filename);
            readstream.pipe(res);
        }else{
            console.log(err);
        }
    });
}
