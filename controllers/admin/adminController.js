const   User            = require("../../models/user"),
        bcryptjs        = require("bcryptjs"),
        Student         = require("../../models/user"),
        Program         = require("../../models/program"),
        Course          = require("../../models/course"),
        passport        = require("passport");

require("../../config/adminLogin")(passport);

// DASHBOARD ROOT ROUTE
exports.index = (req, res) => {
    Program.find({})
    .then(programs => {
        Student.find({})
        .then(students => {
            Course.find({})
            .then(courses => {
                User.find({})
                .then(admins => {
                    res.render("admin/index", {
                        title : "Njala SRMS Admin Panel",
                        programs : programs,
                        students : students,
                        courses : courses,
                        admins : admins
                    });
                })
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

// =====================================================================================
// VIEW ALL USERS
exports.viewAdmins = (req, res) => {
    User.find({})
    .then(users => {
        if(users){
            res.render("admin/admin/admins", {
                title : "Njala SRMS Admins",
                users : users
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

// LOGIN ROUTE
exports.login = (req, res) => {
    res.render("admin/admin/login", {
        title : "NJALA SRMS Admin Login Page"
    });
}

// LOGIN LOGIC
exports.loginLogic = (req, res, next) => {
    passport.authenticate("local", {
        successRedirect : "/admin",
        failureRedirect : "/admin/login"
    })(req, res, next);
}

// LOGOUT
exports.logout = (req, res) => {
    req.logout();
    res.redirect("/admin/login");
}

// USERS SIGN UP FORM
exports.signup = (req, res) => {
    res.render("admin/admin/add", {
        title : "Njala SRMS Admin Signup"
    });
}

// SIGN UP LOGIC
exports.signupLogic = (req, res) => {
    if(req.body.password === req.body.retypePassword){
        bcryptjs.genSalt(10)
        .then(salt => {
            bcryptjs.hash(req.body.password, salt)
            .then(hash => {
                User.create({
                    name : req.body.name,
                    email : req.body.email,
                    password : hash,
                    role : req.body.role
                })
                .then(user => {
                    if(user){
                        console.log("USER CREATED SUCCESSFULLY");
                        res.redirect("/admin/users");
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
    }else{
        console.log("PASSWORDS DO NOT MATCH");
        res.redirect("back");
    }
}

// EDIT ADMIN INFORMATION
exports.editAdmin = (req, res) => {
    User.findById({_id : req.params.id})
    .then(user => {
        if(user){
            res.render("admin/admin/update", {
                title : "Njala SRMS User Update Form",
                user : user
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

// EDIT ADMIN INFORMATION LOGIC
exports.editAdminLogic = (req, res) => {
    if(req.body.password === ""){
        User.findByIdAndUpdate({_id : req.params.id}, {
            name : req.body.name,
            email : req.body.email,
            role : req.body.role
        })
        .then(user => {
            if(user){
                console.log(user);
                console.log("USERS INFORMATION UPDATED SUCCESSFULLY");
                res.redirect("/admin/users");
            }
        })
        .catch(err => {
            if(err){
                console.log(err);
                res.redirect("back");
            }
        })
    }else{
        bcryptjs.genSalt(10)
        .then(salt => {
            bcryptjs.hash(req.body.password, salt)
            .then(hash => {
                User.findByIdAndUpdate({_id : req.params.id}, {
                    name : req.body.name,
                    email : req.body.email,
                    password : hash,
                    role : req.body.role
                })
                .then(user => {
                    if(user){
                        console.log(user);
                        console.log("USERS INFORMATION UPDATED SUCCESSFULLY");
                        res.redirect("back");
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
}

// DELETE ADMIN INFORMATION
exports.deleteAdmin = (req, res) => {
    User.findByIdAndDelete({_id : req.params.id})
    .then(user => {
        if(user){
            console.log("USER INFORMATION DELETED SUCCESSFULLY");
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
// =====================================================================================

// =====================================================================================
// 404 PAGES
exports.error = (req, res) => {
    res.render("admin/404", {
        title : "404 - Page Not Found"
    });
}
