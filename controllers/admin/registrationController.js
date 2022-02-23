const   Register            = require("../../models/registration"),
        Fee                 = require("../../models/fee"),
        Student             = require("../../models/user");

// GET ALL REGISTRATIONS
exports.registrations = (req, res) => {
    Student.find({})
    .then(students => {
        Fee.find({})
        .then(fees => {
            Register.find({})
            .then(registrations => {
                if(registrations){
                    res.render("admin/register/students", {
                        title : "Njala SRMS registrations",
                        registrations : registrations,
                        students : students,
                        fees : fees
                    });
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

// GET REGISTRATION INFO & FORM
exports.viewregistration = (req, res) => {
    Register.findById({_id : req.params.id})
    .then(registration => {
        if(registration){
            res.render("admin/register/register", {
                title : "Njala SRMS Student Registration Information",
                registration : registration
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

// registration VIEW/EDIT LOGIC
exports.editregistrationLogic = (req, res) => {
    Register.findByIdAndUpdate({_id : req.params.id}, req.body)
    .then(registration => {
        if(registration){
            if(registration.status === "Registered"){
                Student.findOneAndUpdate({email : registration.email, current_year : registration.current_year}, {status : "Registered"})
                .then(student => {
                    console.log("REGISTRATION INFORMATION UPDATED SUCCESSFULLY");
                    res.redirect("/admin/registrations");
                })
            }
        }
    })
    .catch(err => {
        if(err){
            console.log(err);
            res.redirect("back");
        }
    });
    
}

// registration DELETE LOGIC
exports.deleteregistration = (req, res) => {
    Register.findByIdAndDelete({_id : req.params.id})
    .then(registration => {
        if(registration){
            console.log("REGISTRATION INFORMATION DELETED SUCCESSFULLY");
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
