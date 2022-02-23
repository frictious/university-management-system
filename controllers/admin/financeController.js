const   Fee                = require("../../models/fee"),
        Program             = require("../../models/program");

// GET ALL FEES
exports.fees = (req, res) => {
    Fee.find({})
    .then(fees => {
        if(fees){
            res.render("admin/fee/fees", {
                title : "Njala University Program Fees",
                fees : fees
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

// ADD FEE FORM
exports.addFee = (req, res) => {
    Program.find({})
    .then(programs => {
        res.render("admin/fee/add", {
            title : "Njala University Fee Add Form",
            programs : programs
        });
    })
    .catch(err => {
        console.log(err);
        res.redirect("back");
    });
}

// ADD FEE LOGIC
exports.addFeeLogic = (req, res) => {
    Fee.create({
        fee : req.body.fee,
        program : req.body.program,
        academicYear : req.body.academicYear
    })
    .then(fee => {
        if(fee){
            Program.findOneAndUpdate({name : fee.program}, {fee : fee.fee})
            .then(programFee => {
                if(programFee){
                    console.log("FEE ADDED SUCCESSFULLY");
                    res.redirect("back");
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

// FEE EDIT FORM
exports.editFee = (req, res) => {
    Program.find({})
    .then(programs => {
        Fee.findById({_id : req.params.id})
        .then(fee => {
            if(fee){
                res.render("admin/fee/update", {
                    title : "Njala University Fee Update Form",
                    programs : programs,
                    fee : fee
                });
            }
        })
    })
    .catch(err => {
        if(err){
            console.log(err);
            res.redirect("back");
        }
    });
}

// FEE EDIT LOGIC
exports.editFeeLogic = (req, res) => {
    Fee.findByIdAndUpdate({_id : req.params.id}, req.body)
    .then(fee => {
        if(fee){
            console.log("FEE UPDATED SUCCESSFULLY");
            res.redirect("/admin/fees");
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
exports.deleteFee = (req, res) => {
    Fee.findByIdAndDelete({_id : req.params.id})
    .then(fee => {
        if(fee){
            console.log("FEE DELETED SUCCESSFULLY");
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
