if (process.env.NODE_ENV !== "production") {
  const path = require("path");
  require("dotenv").config({
    path: path.join(__dirname, ".env"),
  });
}

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;

const ExpressError = require("./utils/ExpressError.js");
const User = require("./models/user.js");

const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const bookingRoutes = require("./routes/booking.js");


const app = express();

const MONGO_URL = process.env.ATLASDB_URL;

/* Database Connection */
async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to DB");
}

main().catch(console.error);

/* Middleware */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* Session Store */
const store = MongoStore.create({
  mongoUrl: MONGO_URL,
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.error("SESSION STORE ERROR:", err);
});

/* Session Configuration */
app.use(
  session({
    store,
    secret: process.env.SECRET ,
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    },
  })
);

/* Passport Configuration */
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/* Routes */
app.use("/listings", listingRouter);
app.use("/booking", bookingRoutes);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);



/* 404 Handler */
app.use((req, res, next) => {
  next(new ExpressError(404, "API Endpoint not found!"));
});

/* Global Error Handler */
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);

  const { statusCode = 500, message = "Something went wrong" } = err;

  res.status(statusCode).json({
    success: false,
    message,
  });
});

/* Server */
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});