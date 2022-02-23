const   mongoose            = require("mongoose");

const feeSchema = mongoose.Schema({
    fee : Number,
    program : String,
    academicYear : String
});

module.exports = mongoose.model("Fee", feeSchema);
