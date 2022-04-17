const express = require("express");
    morgan = require("morgan");
    multer = require("multer");
    path = require("path");
    passport = require('passport');
    flash = require('connect-flash');
    cookieParser = require('cookie-parser');
    session = require('express-session');
    fileUpload = require('express-fileupload');
    app = express();
    PORT = process.env.PORT || 3000;

const inicioRoute = require('./routes/inicio');
const indexRoutes = require('./routes/index');
const agricRoutes = require('./routes/agricultor');
const analistaRoutes = require('./routes/analista');

require('./config/passportUser')(passport);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(fileUpload());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

//passport
app.use(session({
    secret: 'proyectosoftware2',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//routes
app.use('/', inicioRoute);
app.use('/index', indexRoutes);
app.use('/agricultor', agricRoutes);
app.use('/analista', analistaRoutes);

app.listen(PORT, () => {
    console.log('Inició el servidor');
});
