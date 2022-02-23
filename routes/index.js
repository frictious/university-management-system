const   express             = require("express"),
        indexController     = require("../controllers/indexController"),
        mongoose            = require("mongoose"),
        crypto              = require("crypto"),
        path                = require("path"),
        multer              = require("multer"),
        {GridFsStorage}     = require("multer-gridfs-storage"),
        Grid                = require("gridfs-stream");

const router = express.Router();

// LOG IN CHECKER
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        if(req.user.role === "Student"){
            return next();
        }else{
            res.redirect("/logout");
        }
    }else{
        res.redirect("/login");
    }
};

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

// ROUTES
// INDEX ROUTE
router.get("/", isLoggedIn, indexController.index);

// STATUS ROUTE
router.get("/status", isLoggedIn, indexController.status);

// REGISTER ROUTE
router.get("/register", isLoggedIn, indexController.register);

// REGISTER POST ROUTE
router.post("/register", files.single("feeReceipt"), indexController.registerLogic);

// RESULT ROUTE
router.get("/:studentID/:student_year/result", isLoggedIn, indexController.indexController);

// LOGIN ROUTE
router.get("/login", indexController.loginController);

// LOGIN LOGIC
router.post("/login", indexController.loginLogicController);

// LOGOUT LOGIC
router.get("/logout", indexController.logout);

// FORGOT PASSWORD
router.get("/forgotpassword", indexController.forgotPassword);

// FORGOT PASSWORD LOGIC
router.post("/forgotpassword", indexController.forgotPasswordLogic);

// PASSWORD RESET LINK MESSAGE
router.get("/passwordresetlink", indexController.resetpasswordmessage);

// GET RESET PASSWORD PAGE
router.get("/resetpassword/:id/:studentID", indexController.resetpassword);

// RESET PASSWORD LOGIC
router.put("/resetpassword/:id/:studentID", indexController.resetpasswordLogic);

// GRADE SEARCH FORM
router.get("/grade/search", indexController.gradeSearch);

// GRADE SEARCH LOGIC
router.post("/grade/search", indexController.gradeSearchLogic);

// EXPORTING ROUTER
module.exports = router;
