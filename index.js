import express from "express";
import router from "./routes/index.js";
import notesRouter from "./routes/notes.js";
import authRouter from "./routes/authentication.js";
import morgan from "morgan";
import { format } from "timeago.js";
import flash from "connect-flash";
import session from "express-session";
import MySQLStore from "express-mysql-session";
import { databaseInfo } from "./keys.js";
import passport from "passport";
import "./passport.js";

const app = express();

//Define the port
const port = process.env.PORT || 4000;

//Add PUG
app.set("view engine", "pug");
app.locals.format = format;

//Middlewares
const MySQLStoreSession = MySQLStore(session);
const store = new MySQLStoreSession(databaseInfo.database);
app.use(
  session({
    secret: "Asupersecuresessionkey",
    resave: false,
    saveUninitialized: false,
    store,
  })
);
app.use(flash());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

//Global variables
app.use((req, res, next) => {
  const year = new Date();
  res.locals.currentYear = year.getFullYear();
  res.locals.webName = "NotesApp!";
  res.locals.success = req.flash("success");
  res.locals.failure = req.flash("failure");
  res.locals.user = req.user;
  return next();
});

//Add the router
app.use("/", router);
app.use("/mynotes", notesRouter);
app.use("/", authRouter);

//Define public folder
app.use(express.static("public"));

//Starts the server
app.listen(port, () => {
  console.log(`Server working at port: ${port}`);
});
