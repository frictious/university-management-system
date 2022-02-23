const   Program              = require("../../models/program");

// GET ALL PROGRAMS
exports.programs = (req, res) => {
    Program.find({})
    .then(programs => {
        if(programs){
            res.render("admin/programs/programs", {
                title : "Njala University Programs",
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

// ADD PROGRAM FORM
exports.addProgram = (req, res) => {
    res.render("admin/programs/add", {
        title : "Njala University Program Add Form"
    });
}

// ADD PROGRAM LOGIC
exports.addProgramLogic = (req, res) => {
    Program.create({
        name : req.body.name,
        duration : req.body.duration,
        type : req.body.type,
        fee : req.body.fee
    })
    .then(program => {
        console.log("PROGRAM ADDED SUCCESSFULLY");
        res.redirect("back");
    })
    .catch(err => {
        if(err){
            console.log(err);
            res.redirect("back");
        }
    });
}

// PROGRAM EDIT FORM
exports.editProgram = (req, res) => {
    Program.findById({_id : req.params.id})
    .then(program => {
        if(program){
            res.render("admin/programs/update", {
                title : "Njala University Program Update Form",
                program : program
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

// PROGRAM EDIT LOGIC
exports.editProgramLogic = (req, res) => {
    Program.findByIdAndUpdate({_id : req.params.id}, req.body)
    .then(program => {
        if(program){
            console.log("PROGRAM UPDATED SUCCESSFULLY");
            res.redirect("/admin/programs");
        }
    })
    .catch(err => {
        if(err){
            console.log(err);
            res.redirect("back");
        }
    });
}

// DELETE LOGIC
exports.deleteProgram = (req, res) => {
    Program.findByIdAndDelete({_id : req.params.id})
    .then(program => {
        if(program){
            console.log("PROGRAM DELETED SUCCESSFULLY");
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
