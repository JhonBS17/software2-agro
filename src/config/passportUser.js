const LocalStrategy = require('passport-local').Strategy,
    bcrypt = require('bcrypt-nodejs'),
    agricultor = require("../models/Agricultor"),
    analista = require("../models/Analista"),
    { validationResult } = require('express-validator');

module.exports = function (passport) {

    var num = 0;

    //serializar usuario entrante
    passport.serializeUser(function (user, done) {
        if (user.usuario_Agricultor != null) {
            done(null, user.usuario_Agricultor);
        } else {
            done(null, user.usuario_Analista);
        }
    });

    //deserializar usuario
    passport.deserializeUser(function (user, done) {

        agricultor.getByUser(user, (err, rows) => {
            if (rows.length != 0) {
                done(err, rows[0]);
                return;
            } else {
                analista.getByUser(user, (err, rows) => {
                    done(err, rows[0]);
                    return;
                })
            }
        })

    });

    //local-signup del usuario

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'usuario_Agricultor',
        passwordField: 'contrasena_Agricultor',
        passReqToCallback: true
    },
        function (req, user, password, done) {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return done(null, false, req.flash('signupMessage', errors.errors));
            } else {
                agricultor.getByUser(user, (err, rows) => {
                    if (err)
                        return done(err);
                    if (rows.length) {
                        return done(null, false, req.flash('signupMessage', 'El usuario ya pertenece a una cuenta'));
                    } else {

                        agricultor.getByEmail(req.body.correo_Agricultor, (err, rows) => {
                            if (err)
                                return done(err);
                            if (rows.length) {
                                return done(null, false, req.flash('signupMessage', 'El correo ya pertenece a una cuenta'));
                            } else {

                                var newUser = new Object();

                                newUser.usuario_Agricultor = user;
                                newUser.contrasena_Agricultor = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
                                newUser.nombre_Agricultor = req.body.nombre_Agricultor;
                                newUser.correo_Agricultor = req.body.correo_Agricultor;
                                newUser.depart_Agricultor = req.body.depart_Agricultor;
                                newUser.ciudad_Agricultor = req.body.ciudad_Agricultor;

                                agricultor.create(newUser, (err, rows) => {

                                    if (err) {
                                        console.log(err);
                                    }
                                    req.flash('loginMessage', '¡Ha sido registrado con éxito en la plataforma!')
                                    return done(null, newUser);
                                });
                            }
                        });
                    }
                });
            }
        }));

    //local-login del usuario

    passport.use('local-login', new LocalStrategy({
        usernameField: 'usuario',
        passwordField: 'contraseña',
        passReqToCallback: true
    },
        function (req, user, password, done) {

            agricultor.getByUser(user, (err, rows) => {

                if (err)
                    return done(err);
                if (!rows.length) {
                    return done(null, false, req.flash('loginMessage', 'El usuario Agricultor no se ha encontrado!'));
                }

                if (!bcrypt.compareSync(password, rows[0].contrasena_Agricultor.replace(/^\$2y/, "$2a"))) {
                    return done(null, false, req.flash('loginMessage', 'Contraseña incorrecta!'));
                }

                return done(null, rows[0]);

            });
        }
    ));

    passport.use('local-loginAnalista', new LocalStrategy({
        usernameField: 'usuario',
        passwordField: 'contraseña',
        passReqToCallback: true
    },
        function (req, user, password, done) {

            num = 1

            analista.getByUser(user, (err, rows) => {

                if (err)
                    return done(err);
                if (!rows.length) {
                    return done(null, false, req.flash('loginMessage', 'El usuario Analista no se ha encontrado!'));
                }

                if (password != rows[0].contraseña_Analista) {
                    return done(null, false, req.flash('loginMessage', 'Contraseña incorrecta!'));
                }

                return done(null, rows[0]);

            });
        }
    ));
};
