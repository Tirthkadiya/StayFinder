

if (process.env.NODE_ENV !== "production") {
    const path = require("path");
    require("dotenv").config({
        path: path.join(__dirname, ".env"),
    });
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// Database URL
const MONGO_URL =
    process.env.ATLASDB_URL ||
    "mongodb://127.0.0.1:27017/wanderlust";

// Connect DB
main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

// View Engine
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");

// Frontend folders
app.set("views", path.join(__dirname, "../frontend/views"));
app.use(express.static(path.join(__dirname, "../frontend/public")));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Session Store
const store = MongoStore.create({
    mongoUrl: MONGO_URL,
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("ERROR IN MONGO SESSION STORE", err);
});

// Session Config
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
};

app.use(session(sessionOptions));
app.use(flash());

// Passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash Messages
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// Routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// 404 Handler
app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found!!"));
});

// Error Handler
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    let {
        statusCode = 500,
        message = "Something went wrong",
    } = err;

    res.status(statusCode).render("error.ejs", {
        err,
    });
});

// Server
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`);
});