const express = require("express");
const { create } = require("express-handlebars");
const passport = require("passport");

const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const csurf = require("csurf")
const mongoSanitize = require('express-mongo-sanitize');
var cors = require('cors')

const home = require("./routes/home");
const auth = require("./routes/login");
const User = require("./models/User");
const clientDB = require("./database/db")

require("dotenv").config();
require("./database/db");

const PORT = process.env.PORT || 3002;

const app = express();

var corsOptions = {
  credentials: true,
  origin: process.env.PATH_HEROKU || "*",
  methods: ["GET", "POST"]
}

app.use(cors(corsOptions))

app.use(
  session({
    secret: process.env.SECRET_WORD,
    resave: false,
    saveUninitialized: false,
    name: "session",
    store: MongoStore.create({
      clientPromise: clientDB,
      dbName: process.env.DB_NAME
    }),
    cookie: {
      secure: process.env.SECURE_PROTOCOL,
      maxAge: 15 * 24 * 60 * 60 * 1000
    }
  })
);

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) =>
  done(null, { id: user._id, usename: user.username })
);

passport.deserializeUser(async (user, done) => {
  const userDB = await User.findById(user.id);
  return done(null, { id: userDB._id, usename: userDB.username });
});

const hbs = create({
  extname: ".hbs",
  partialsDir: ["views/components"],
});

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", "./views");

app.use(express.urlencoded({ extended: true }));

app.use(mongoSanitize());
app.use(csurf())

app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken()
  res.locals.mensaje = req.flash("mensaje")
  next()
})

app.use("/", home);

app.use("/auth", auth);

app.use(express.static(__dirname + "/public"));

app.listen(PORT, () => {
  console.log(`Server run on port ${PORT}`);
});
