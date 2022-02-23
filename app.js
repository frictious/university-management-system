const   express             = require("express"),
        Index               = require("./routes/index"),
        Admin               = require("./routes/admin"),
        mongoose            = require("mongoose"),
        methodOverride      = require("method-override"),
        session             = require("express-session"),
        passport            = require("passport");

const app = express();
require("dotenv").config();

// CONFIG
// MONGOOSE CONNECTION
global.Promise = mongoose.Promise
mongoose.connect(process.env.MONGODB, {
    useNewUrlParser : true,
    useUnifiedTopology : true
});

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(session({
    secret: 'Njala SRMS',//setting the secret key to create sessions
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
})

// ROUTES
app.use("/", Index);
app.use("/admin", Admin);


// SERVER
app.listen(process.env.PORT, () => {
    console.log(`Server Started on PORT ${process.env.PORT}`);
});
