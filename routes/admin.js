const   express                 = require("express"),
        adminController         = require("../controllers/admin/adminController"),
        programController       = require("../controllers/admin/programController"),
        financeController       = require("../controllers/admin/financeController"),
        courseController        = require("../controllers/admin/courseController"),
        studentController       = require("../controllers/admin/studentController"),
        registrationController  = require("../controllers/admin/registrationController"),
        gradeController         = require("../controllers/admin/gradeController");
const   indexController         = require("../controllers/indexController");

const router = express.Router();

// LOG IN CHECKER
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        if(req.user.role === "Admin" || req.user.role === "Exam Officer" || req.user.role === "Finance Officer" || req.user.role === "Admissions Officer"){
            return next();
        }else{
            res.redirect("/admin/logout");
        }
    }else{
        res.redirect("/admin/login");
    }
};

// ROUTES
router.get("/", isLoggedIn, adminController.index);

// =====================================================================================
// PROGRAMS SECTION
// GET ALL PROGRAMS
router.get("/programs", isLoggedIn, programController.programs);

// ADD PROGRAM FORM
router.get("/program/add", isLoggedIn, programController.addProgram);

// ADD PROGRAM LOGIC
router.post("/program/add", programController.addProgramLogic);

// VIEW PROGRAM FOR EDIT
router.get("/program/:id/edit", isLoggedIn, programController.editProgram);

// EDIT PROGRAM LOGIC
router.put("/program/:id", programController.editProgramLogic);

// DELETE PROGRAM
router.delete("/program/:id", programController.deleteProgram);

// END OF PROGRAMS SECTION
// =====================================================================================


// =====================================================================================
// FEES SECTION
// GET ALL FEES
router.get("/fees", isLoggedIn, financeController.fees);

// ADD FEE FORM
router.get("/fee/add", isLoggedIn, financeController.addFee);

// ADD FEE LOGIC
router.post("/fee/add", financeController.addFeeLogic);

// VIEW FEE FOR EDIT
router.get("/fee/:id/edit", isLoggedIn, financeController.editFee);

// EDIT FEE LOGIC
router.put("/fee/:id", financeController.editFeeLogic);

// DELETE FEES
router.delete("/fee/:id", financeController.deleteFee);

// END OF FEES SECTION
// =====================================================================================


// =====================================================================================
// COURSES SECTION
// COURSES
router.get("/courses", isLoggedIn, courseController.courses);

// ADD COURSE FORM
router.get("/course/add", isLoggedIn, courseController.addCourse);

// ADD COURSE LOGIC
router.post("/course/add", courseController.addCourseLogic);

// EDIT COURSE FORM
router.get("/course/:id/edit", isLoggedIn, courseController.editCourse);

// UPDATE COURSE LOGIC
router.put("/course/:id/edit", courseController.editCourseLogic);

// DELETE COURSE
router.delete("/course/:id", courseController.deleteCourse);

// END OF COURSES SECTION
// =====================================================================================

// =====================================================================================
// STUDENT SECTION
// GET ALL STUDENTS
router.get("/students", isLoggedIn, studentController.students);

// ADD STUDENT FORM
router.get("/student/add", isLoggedIn, studentController.addStudent);

// ADD STUDENT LOGIC
router.post("/student/add", studentController.addStudentLogic);

// EDIT STUDENT FORM
router.get("/student/:id/edit", studentController.editStudent);

// EDIT STUDENT INFORMATION LOGIC
router.put("/student/:id", studentController.editStudentLogic);

// DELETE STUDENT INFROMATION
router.delete("/student/:id", isLoggedIn, studentController.deleteStudent);

// END OF STUDENT SECTION
// =====================================================================================

// =====================================================================================
// GRADES SECTION
// GET ALL GRADES
router.get("/grades", isLoggedIn, gradeController.grades);

// SEARCH FORM
router.get("/grade/search", isLoggedIn, gradeController.gradeSearch);

// SEARCH FORM LOGIC
router.post("/grade/search", gradeController.gradeSearchLogic);

// ADD GRADES FORM
router.get("/grade/add/:studentID/:year/:semester/:programName", isLoggedIn, gradeController.addGrade);

// ADD GRADE LOGIC
router.post("/grade/add", gradeController.addGradeLogic);

// EDIT GRADE FORM
router.get("/grade/:id/edit", isLoggedIn, gradeController.editGrade);

// EDIT GRADE LOGIC
router.put("/grade/:id", gradeController.editGradeLogic);

// DELETE GRADE
router.delete("/grade/:id", gradeController.deleteGrade);

// END OF GRADES SECTION
// =====================================================================================


// =====================================================================================
// USERS SECTION
router.get("/users", isLoggedIn, adminController.viewAdmins);

// ADD USERS
router.get("/user/add", isLoggedIn, adminController.signup);

// ADD USERS LOGIC
router.post("/user/add", adminController.signupLogic);

// VIEW/EDIT USERS INFORMATION
router.get("/user/:id/edit", isLoggedIn, adminController.editAdmin);

// UPDATE USER LOGIC
router.put("/user/:id", adminController.editAdminLogic);

// DELETE USER
router.delete("/user/:id", adminController.deleteAdmin);

// LOGIN USER
router.get("/login", adminController.login);

// LOGIN USER LOGIC
router.post("/login", adminController.loginLogic);

// LOGOUT
router.get("/logout", adminController.logout);

// END OF ADMIN SECTION
// =====================================================================================

// =====================================================================================
// STUDENT REGISTRATION INFO SECTION
// GET ALL REGISTRATIONS
router.get("/registrations", isLoggedIn, registrationController.registrations);

// GET SINGLE REGISTRATION INFORMATION
router.get("/register/:id", isLoggedIn, registrationController.viewregistration);

// UPDATE REGISTRATION INFORMATION
router.put("/register/:id", registrationController.editregistrationLogic);

// DELETE REGISTRATION INFORMATION
router.delete("/register/:id", registrationController.deleteregistration);

// GET FILES
router.get("/files/:filename", indexController.files);

// =====================================================================================
//404 ROUTE
router.get("*", isLoggedIn, adminController.error);

// EXPORTING THE ROUTER
module.exports = router;
